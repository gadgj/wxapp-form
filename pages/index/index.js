const app = getApp()

Page({
  data: {
    formData: [
      {
        type: 'input',
        id:'idcard',
        lable:'身份证号',
        isRequired: true,//是否必填
        maxLength: 20,//最大长度
        placeholder:'请填写身份证号码',//初始值
        rules:[//规则验证数组
          {
            regular: '^\\S*$',//正则字符串
            tips: '不能有空格'//错误提示
          },
        ]
      },
      {
        type: 'input',
        id:'xingMing',
        lable:'姓名',
        isRequired: true,//是否必填
        maxLength: 8,//最大长度
        placeholder:'请填写姓名',//初始值
        rules:[//规则验证数组
          {
            regular: '^\\S*$',//正则字符串
            tips: '不能有空格'//错误提示
          },
        ]
      },
      {
        type: 'picker',
        id: 'xingBie',
        lable: '性别',
        defaultIdx:0,//默认选择索引
        disabled:false,
        isRequired:true,
        range:[
          {
            id: 0,
            name: '男'
          },
          {
            id: 1,
            name: '女'
          },
        
        ]
      },
      {
        type: 'picker',
        id: 'zhiCheng',
        lable: '当前职称',
        defaultIdx:0,//默认选择索引
        disabled:false,
        isRequired:true,
        range:[
          {
            id: 0,
            name: '医师系列'
          },
          {
            id: 1,
            name: '护理系列'
          },
          {
            id: 2,
            name: '药师系列'
          },
          {
            id: 3,
            name: '技师系列'
          }        
        ]
      },
      {
        type: 'date',
        id: 'pingDingShiJian',
        lable: '职称评定时间',
        isRequired: true,
        /* 显示完整时间包含时分秒；当使用endDate的时候关闭,不要同时打开, 否则日期将会换行；
           与config中的colum属性共同设置
        */
        // completeTime:true, //显示完整时间, 包含时分秒
        config: {
          endDate: false,///true,
          dateLimit: true,
          // initStartTime: "2020-01-01 12:32:44",
          // initEndTime: "2020-12-01 12:32:44",
          column: "day",//day、hour、minute、secend
          limitStartTime: "1950-01-01 00:00:59",
          limitEndTime: "2050-01-01 00:00:59"
        }
      },
      {
        type: 'input',
        id: 'pinRenNianDu',
        lable: '职称聘任年度',
        isRequired: true,//是否必填
        defaultValue:'2020',
        inputType: 'digit', //对应input组件type值(text,number)
        placeholder: '请填写职称聘任年度',
        disabled:false,
        rules: [
          
        ]
      },
      {
        type: 'picker',
        id: 'keShi',
        lable: '科室',
        defaultIdx:0,//默认选择索引
        disabled:false,
        isRequired:true,
        range:[
          {
            id: 0,
            name: '护理科'
          },
          {
            id: 1,
            name: '心血管科'
          },
          {
            id: 2,
            name: '呼吸内科'
          },
          {
            id: 3,
            name: '消化内科'
          }        
        ]
      },
      {
        type: 'picker',
        id: 'zhuanYe',
        lable: '专业',
        defaultIdx:0,//默认选择索引
        disabled:false,
        isRequired:true,
        range:[
          {
            id: 0,
            name: '护理学'
          },
          {
            id: 1,
            name: '临床医学'
          },
          {
            id: 2,
            name: '急救医学'
          },
          {
            id: 3,
            name: '预防医学'
          }        
        ]
      },
      {
        type: 'input',
        id: 'shouJi',
        lable: '手机',
        isRequired: true,//是否必填
        defaultValue:'',
        inputType: 'digit', //对应input组件type值(text,number)
        placeholder: '请填写手机号码',
        disabled:false,
        rules: [
          
        ]
      },
      {
        type: 'input',
        id: 'xueFenKa',
        lable: '华医网学分卡号',
        isRequired: true,//是否必填
        defaultValue:'',
        inputType: 'digit', //对应input组件type值(text,number)
        placeholder: '请填写华医网学分卡号',
        disabled:false,
        rules: [
          
        ]
      },
      {
        type: 'input',
        id: 'youXiang',
        lable: '邮箱',
        placeholder: '请填写邮箱',
        rules: [
          {
            regular: '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$',
            tips: '邮箱格式错误'
          }
        ]
      },
      {
        type: 'file',
        accept: 'image',
        id: 'tuPian',
        lable: '图片上传',
        maxCount: 5,
        maxSize: 5,
        isRequired: true,
        fileList: [
          ///{ url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }//初始图片
        ]
      },  
      {
        type: 'textarea',
        id: 'beiZhu',
        lable: '备注',
        isRequired: false,
        maxLength: 200,
        // defaultValue: '初始值',
        placeholder:'请输入备注',
        rules: [
          {
            regular: '^.{5,200}$',
            tips: '请输入5-200位以内字符'
          }
        ]
      }
      // ,
      // {
      //   type: 'file',
      //   accept: 'video',
      //   id: 'video',
      //   lable: '视频上传',
      //   maxCount: 1,
      //   maxSize: 5,
      //   // isRequired: true,
      //   fileList: [
      //     // { url: "http://tmp/wx4c198b0bd87f5470.o6zAJs1Ghz_xnqKSRnUi….xVILGkr0x8fm00dec98217739f2e6813a5937b68f928.mp4",isVideo:true}
      //   ]
      // },
    ],
    toSubmit: Math.random()
  },
  onFormSubmit(e){
    console.log('表单提交: ', e);

    wx.showLoading({
      title: '提交中...',
    });


    var imgPath = e.detail.tuPian.list[0].path;
    var cloudPath = "kingImg/" + imgPath.substring(imgPath.lastIndexOf('/') + 1);
    ///上传到云存储
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: e.detail.tuPian.list[0].path,
      success: res => {
        console.log("图片上传成功: ", res);
        var fileId = res.fileID;

        ///////////  更新数据库  ///////////////
        try{
          wx.cloud.callFunction({
            name:'formsubmit',
            data: {
              idcard: e.detail.idcard.value,
              xingMing: e.detail.xingMing.value,
              xingBie: e.detail.xingBie.original.range[e.detail.xingBie.idx].name,
              zhiCheng: e.detail.zhiCheng.original.range[e.detail.zhiCheng.idx].name,          
              pingDingShiJian: e.detail.pingDingShiJian.startDate,
              pinRenNianDu: e.detail.pinRenNianDu.value,
              keShi: e.detail.keShi.original.range[e.detail.keShi.idx].name,
              zhuanYe: e.detail.zhuanYe.original.range[e.detail.zhuanYe.idx].name,
              shouJi: e.detail.shouJi.value,
              xueFenKa: e.detail.xueFenKa.value,
              youXiang: e.detail.youXiang.value,
              tuPian: fileId,
              beiZhu: e.detail.beiZhu.value
            },
            success: res => {
              wx.hideLoading()
              console.log('提交成功', res);
              wx.showToast({
                title: '提交成功',
                icon: 'success'
              })
            },
            fail: err => {
              wx.hideLoading()
              wx.showToast({
                icon: 'error',
                title: '网络不给力....'
              })
              console.error('发布失败', err)
            },
            complete: res => {
              console.log(res);
            }
          });
        } catch(ex) {
          console.log(ex);
        };
        
      },
      fail: err => {
        // handle error
        wx.showToast({
          title: '上传图片错误',
          icon: 'error',        
        });
        console.log(err);
      }

    });    
    
  },
  onFormChange(e){
    console.log('表单变化: ',e);
  },
  //变更数值, 触发表单提交事件
  toSubmitChange(){
    this.setData({
      toSubmit: Math.random()
    })
  },
  onLoad: function (para) {
    console.log(para);
    if(para.tapId == "xinKa") {
      console.log('新卡，无学分卡字段');
      this.data.formData = this.data.formData.filter(({id}) => id !== 'xueFenKa');
      console.log(this.data.formData);
    }
    else if(para.tapId == "buKa") {
      console.log('补卡，字段最多，不处理');

    }
    else {
      console.log('调入，');
    }
  },
})
