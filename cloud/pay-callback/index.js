const cloud = require('wx-server-sdk');
var rp = require('request-promise');///引入request-promise用于做网络请求

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// 云函数入口
exports.main = async function(event) {
  console.log(event);

  try {
    // res = await cloud.callFunction({
    //   name: 'pay-v2',
    //   data: {
    //     type: 'payorder',
    //     data: {
    //       outTradeNo: event.outTradeNo
    //     }
    //   }
    // })

    const { subMchId, subAppid, outTradeNo } = event;

    const { returnCode, ...restData } = await cloud.cloudPay.queryOrder({
      subMchId: subMchId,
      subAppid: subAppid,
      outTradeNo,
    });

    console.log(returnCode, restData);
    
    if (restData.tradeState === "SUCCESS") {//商户号已收到款; 交易是否成功需要查看交易状态tradeState --King 2020.12.21
      var res = '不调用业务代码';///await updateOrderAndNotify(restData);
    }

    console.log('------------------await updateOrderAndNotify()结果: ', res);

     ///返回FAIL则支付回调函数会再次调用；所以使用微信的cloud.cloudPay.queryOrder的通信标识returnCode来返回。--add by King 2020.12.20
    return { return_code: returnCode === 'SUCCESS' ? 'SUCCESS' : 'FAIL' };

 } catch (e) {
    console.log(e);
    return { return_code: 'FAIL' };
 }
};
/// 更新订单状态及通知
async function updateOrderAndNotify(restData) {
  var returnMsg = '';
  const db = cloud.database();
  const orderCollection = db.collection("orders-v2");

  const { data: dbData } = await orderCollection
    .where({ outTradeNo: restData.outTradeNo })
    .get();
  const dbOrderData = dbData[0];
  console.log('-----------------更新订单前dbOrderData订单结果', dbOrderData);

  if(dbOrderData.cardinfo_state === '"true|操作成功!"') {
    return '已经充值成功了！';///支付回调可能多次调用，业务系统充值成功，则不再重复调用;直接返回 --add by King 2020.12.21
  }

  ///////////////////////////////////更新外部饭卡余额--add by King
  let updateCardResult;
  try {
    updateCardResult = await updateFanTangCardInfo(dbOrderData.cardInfo, dbOrderData.totalFee);///调用外部接口，更新饭卡余额 
    returnMsg += updateCardResult;
  }
  catch(ex) {
    console.log('调用外部饭堂系统充值异常:', ex);
  }
  ///////////////////////////////////更新外部饭卡余额--add by King END

  ///微信收款和饭卡充值结果一起更新到数据库
  const result = await orderCollection
    .where({outTradeNo: restData.outTradeNo})
    .update({
      data: {
        status: 1,
        tradeState: restData.tradeState,
        tradeStateDesc: restData.tradeStateDesc,
        cardinfo_state: updateCardResult
      }
    });
  console.log('3----------------更新订单数据库结果: ', result);   

  try{
    if (dbOrderData.subscribedTmplId) {
      const curTime = restData.timeEnd;
      const time = `${curTime.slice(0, 4)}-${curTime.slice(
        4,
        6
      )}-${curTime.slice(6, 8)} ${curTime.slice(8, 10)}:${curTime.slice(
        10,
        12
      )}:${curTime.slice(12, 14)}`;

      const messageResult = await cloud.openapi.subscribeMessage.send({
        touser: restData.subOpenid,
        page: `pages/adminflow/pay-result/index?id=${restData.outTradeNo}`,
        data: {
          character_string1: {
            value: restData.outTradeNo, // 订单号
          },
          thing9: {
            value: dbOrderData.body, // 物品名称
          },
          date2: {
            value: time, // 支付时间
          },
          amount3: {
            value: restData.totalFee / 100 + "元", // 支付金额
          },
        },
        templateId: dbOrderData.subscribedTmplId,
      });

      console.log("messageResult", messageResult);
      returnMsg += messageResult;
    }
  }
  catch(ex) {
    console.log('发送通知异常:', ex);
  }
  return returnMsg;
};

///外部饭堂系统充值
async function updateFanTangCardInfo(cardInfo, totalFee) {
  var a = 1/0;///不调用，直接抛异常
  var query = {
      userCardNo: cardInfo.usercardno,// （逻辑卡号）物理卡号（对应后端的usercardno字段） 
      userId: cardInfo.sys_userinfoid,// 用户ID  （对应后端的sys_userinfoid字段）
      recharge: totalFee / 100,// 个人充值金额
      rechargesubsidy: 0,// 补贴充值金额
      oldBalance: cardInfo.allbalance,// 个人账户余额
      oldSubsidy: cardInfo.sys_csubsidy,// 应该默认为0，补贴账户余额（对应后端的sys_csubsidy字段）
      cardIndex: -1,// -1 这个值是写死的
      cardIndexMain: -1,// -1 这个值是写死的
      phyId: cardInfo.fixcardno,// 物理卡号 （对应后端的fixcardno字段）
      eqNo: 0,// 0 这个值是写死的
      remark: " ",// 备注
      type: 0,// 卡类型：默认为0，一类卡
      chargeType: 4,//充值类型：1现金,2刷卡,3转账,4微信
      corpname: cardInfo.corpname//新增的所属公司，对应账户
  }
  var queryJson = JSON.stringify(query);
  console.log(queryJson);
  let url = encodeURI(`https://wechat.sctcn.com/attendance/api/attendance/Attendance/GetCardRecharge?queryJson=${queryJson}`);
  console.log(url);
  var res = await rp(url)
    .then(function(response) {
      console.log('1---------------------response', response);
      
      return response;
    })
    .catch(function(err) {
      // 出错了;等价于 then 的第二个参数,但这样更好用更直观 :(
      console.log('---------------------err', err);
      return err;
    });
  console.log('2-----------------await rp()的结果', res);
  return res === undefined ? 'unnnnnnn--King' : res;
}