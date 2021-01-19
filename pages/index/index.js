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
        ///defaultIdx:0,//默认选择索引
        disabled:false,
        isRequired:true,
        range:['男','女']
      },
      {
        type: 'multi_picker',
        id: 'zhiCheng',
        lable: '当前职称',
        ///defaultIdx:[0, 0],//默认选择索引
        disabled:false,
        isRequired:true,
        multi_range:[//存储x轴和某个可变的y轴，初始化为第一个x轴＋第一个y轴y_range[0] --King 2021.01.19
          ['医师系列','护理系列','药师系列','技师系列','中医医师系列','中西医结合医师系列','中医技师系列','中医药师系列','见习系列','工程系列','研究系列','教学系列','检验师系列','统计系列','计生系列','其他系列'],
          ['主任医师','副主任医师','主治医师','医师','主管医师','医士','助理医师']
        ],
        y_range:[//所有y轴
          ['主任医师','副主任医师','主治医师','医师','主管医师','医士','助理医师'], 
          ['主任护师','副主任护师','主管护师','护师','护士'], 
          ['主任药师','副主任药师','主管药师','药剂师','药剂士'], 
          ['主任技师','副主任技师','主管技师','技师','技士'], 
          ['中医主任医师','中医副主任医师','中医主治医师','中医医师','中医医士'],
          ['中西医结合主任医师','中西医结合副主任医师','中西医结合主治医师','中西医结合医师'],
          ['中医主任技师','中医副主任技师','中医主管技师','中医技师','中医技士'],
          ['中医主任药师','中医副主任药师','中医主治药师','中医药师','中医药士'],
          ['见习护师','见习检验师','见习检验士 ','见习技师','见习技士','见习药剂师','见习医师','见习医士','见习护士'],
          ['高级工程师','工程师','助理工程师 ','技术员'],
          ['研究员','副研究员','助理研究员 ','实习研究员'],
          ['教授','副教授','讲师 ','助教'],
          ['主任检验师','副主任检验师','主管检验师 ','检验师','检验士'],
          ['高级统计师','统计师','助理统计师','统计员'],
          ['无职称'],
          ['生殖健康高级咨询师','生殖健康咨询师','生殖健康助理咨询师','生殖健康咨询员','生殖健康助理咨询员']
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
        ///defaultIdx:0,//默认选择索引
        disabled:false,
        isRequired:true,
        range:['护理科','心血管科','呼吸内科','消化内科','肾内科','神经内科','血液内科','内分泌科','风湿免疫科','精神科','血液肿瘤科','脊柱骨病科','普外科','心胸外科','肝胆外科','泌尿外科','神经外科','烧伤整形外科','妇产科','儿科','急诊科','重症医学科','口腔科','耳鼻喉科','眼科','皮肤科','感染科','中医科','康复科','麻醉科','超声科','影像科','体检科','药学部','输血科','病理科','医务部','后勤保障部','财务部','信息技术部','全科','医学工程部','医院感染控制科','人力资源部','其他','关节创伤外科']
      },
      {
        type: 'multi_picker',
        id: 'zhuanYe',
        lable: '专业',
        ///defaultIdx:[0,0],//默认选择索引
        disabled:false,
        isRequired:true,
        multi_range:[
          ['护理学','临床医学','急救医学','预防医学','中医药学','医学生物工程学','基础医学','医药信息学','软科学','药学','其他医学专业','管理专业','其他'],
          ['护理学']
        ],
        y_range:[
          ['护理学'], 
          ['主任护师','副主任护师','主管护师','护师','护士'], 
          ['内科学','外科学','妇产科学','儿科学','眼科学','麻醉学','临床检验学','神经病学','医学影像学','精神病学','理疗学','临床肿瘤学','口腔医学','耳鼻咽喉科学','放射治疗学','全科医学','传染病学','皮肤病学','法医学','老年医学','运动医学'], 
          ['急救医学'], 
          ['地方病学','寄生虫学','卫生标准','环境卫生学','放射卫生学','微生态学','流行病学','卫生检验（疫）学','病毒学','营养和食品卫生学','微生物学','儿少卫生学','劳动卫生和职业病'],
          ['针灸学','中医临床','中医文献学','中医基础理论','中西医结合','中药学'],
          ['医用电子技术','医用激光','人造器官','生化仪器','生物力学','医疗器械','医学仪器','流体力学','医用新材料'],
          ['组织胚胎学','医用物理学','医用化学','医学免疫学','人体解剖学','生物化学','医学遗传学','生理学','病理生理学','航空航海医学','医用生物学','生物物理学','病理学','基础肿瘤学','实验动物'],
          ['医学生物学模式或识别','生物医学信号处理','医学人工智能和专家系统 ','医学统计学','医院信息系统','数字医学影像学','计算分子生物学','医学图书情报处理技术'],
          ['科研管理','卫生经济','卫生事业管理 ','卫生统计学','图书馆学','医院管理','健康教育','社会医学'],
          ['制药工艺学','微生物药学','药物检定 ','药物化学','药剂学','生物制品','药理学','生药学','药用植物学'],
          ['其他医学专业'],
          ['管理专业'],
          ['其他'],  
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
    toSubmit: Math.random(),    
    tapId: ''
  },
  onFormSubmit(e){
    console.log('表单提交: ', e);

    wx.showLoading({
      title: '提交中...',
    });

    ////// 弹出赞赏码确认
    // wx.hideLoading();
    // wx.previewImage({
    //   current: '',
    //   urls: ['cloud://gxwl-0g5grrgie1927a4c.6778-gxwl-0g5grrgie1927a4c-1304647022/lfy赞赏码.jpg'],
    // });
    ///return;

    if(e.detail.tuPian)
    {
      var imgPath = e.detail.tuPian.list[0].path;
      var cloudPath = "kingImg/" + imgPath.substring(imgPath.lastIndexOf('/') + 1);
      ///上传到云存储
      wx.cloud.uploadFile({
        cloudPath: cloudPath,
        filePath: imgPath,
        success: res => {
          console.log("图片上传成功: ", res);
          var fileId = res.fileID;
          this.addDb(e, fileId);          
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
    }
    else {
      this.addDb(e, undefined);
    }
    
    
  },
  addDb: function(e, fileId) {
    ///////////  更新数据库  ///////////////
    try{
      wx.cloud.callFunction({
        name:'formsubmit',
        data: {
          tapId: this.data.tapId,
          idcard: e.detail.idcard && e.detail.idcard.value,
          xingMing: e.detail.xingMing && e.detail.xingMing.value,
          xingBie: e.detail.xingBie && e.detail.xingBie.data,
          zhiCheng: e.detail.zhiCheng && e.detail.zhiCheng.data,          
          pingDingShiJian: e.detail.pingDingShiJian && e.detail.pingDingShiJian.startDate,
          pinRenNianDu: e.detail.pinRenNianDu && e.detail.pinRenNianDu.value,
          keShi: e.detail.keShi && e.detail.keShi.data,
          zhuanYe: e.detail.zhuanYe && e.detail.zhuanYe.data,
          shouJi: e.detail.shouJi && e.detail.shouJi.value,
          xueFenKa: e.detail.xueFenKa && e.detail.xueFenKa.value,
          youXiang: e.detail.youXiang && e.detail.youXiang.value,
          tuPian: fileId,
          beiZhu: e.detail.beiZhu && e.detail.beiZhu.value
        },
        success: res => {
          wx.hideLoading()
          console.log('提交成功', res);
          wx.showToast({
            title: '提交成功',
            icon: 'success'
          });              
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
      this.setData({
        tapId: para.tapId,
        formData : this.data.formData.filter(({id}) => id !== 'xueFenKa')
      });
      console.log(this.data.formData);
    }
    else if(para.tapId == "buKa") {
      console.log('补卡，字段最多，不处理');
      this.setData({
        tapId: para.tapId
      })
    }
    else {
      console.log('调入，');
      const daioRuYuansu = {'xingMing':1, 'zhiCheng':1, 'pingDingShiJian':1, 'pinRenNianDu': 1, 'keShi': 1, 'zhuanYe': 1, 'shouJi': 1, 'xueFenKa':1,}
      this.setData({
        tapId: para.tapId,
        formData : this.data.formData.filter(({id}) => id in daioRuYuansu)
      });
    }
  }
})
