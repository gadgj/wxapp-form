const app = getApp()

Page({
  data: {
    formData: [
      {
        type: 'input',
        id:'ipt1',
        lable:'长标题长标题长标题',
        isRequired: true,//是否必填
        maxLength: 20,//最大长度
        defaultValue:'巡检计划',//初始值
        rules:[//规则验证数组
          {
            regular: '^\\S*$',//正则字符串
            tips: '不能有空格'//错误提示
          },
        ]
      },
      {
        type: 'input',
        id: 'email',
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
        type: 'input',
        id: 'num',
        lable: '数字',
        defaultValue:'禁用',
        inputType: 'digit', //对应input组件type值(text,number)
        placeholder: '请填写数字',
        disabled:true,
        rules: [
          
        ]
      },
      {
        type: 'picker',
        id: 'picker2',
        lable: '状态',
        defaultIdx:0,//默认选择索引
        disabled:true,
        isRequired:true,
        range:[
          {
            id: 0,
            name: '正常'
          },
          {
            id: 1,
            name: '异常'
          },
        
        ]
      },
      {
        type: 'date',
        id: 'timePicker',
        lable: '日期',
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
          limitStartTime: "2000-01-01 00:00:59",
          limitEndTime: "2100-01-01 00:00:59"
        }
      },
      {
        type: 'textarea',
        id: 'textarea1',
        lable: '描述',
        isRequired: true,
        maxLength: 200,
        // defaultValue: '初始值',
        placeholder:'请输入描述',
        rules: [
          {
            regular: '^.{5,200}$',
            tips: '请输入5-200位以内字符'
          }
        ]
      },
      {
        type: 'file',
        accept: 'image',
        id: 'pics',
        lable: '图片上传',
        maxCount: 5,
        maxSize: 5,
        isRequired: true,
        fileList: [
          ///{ url: 'https://img.yzcdn.cn/vant/leaf.jpg', name: '图片1' }//初始图片
        ]
      },
      {
        type: 'file',
        accept: 'video',
        id: 'video',
        lable: '视频上传',
        maxCount: 1,
        maxSize: 5,
        // isRequired: true,
        fileList: [
          // { url: "http://tmp/wx4c198b0bd87f5470.o6zAJs1Ghz_xnqKSRnUi….xVILGkr0x8fm00dec98217739f2e6813a5937b68f928.mp4",isVideo:true}
        ]
      },
    ],
    toSubmit: Math.random()
  },
  onFormSubmit(e){
    console.log('表单提交: ', e);

    wx.showLoading({
      title: '提交中...',
    });


    var imgPath = e.detail.pics.list[0].path;
    var cloudPath = "kingImg/" + imgPath.substring(imgPath.lastIndexOf('/') + 1);
    ///上传到云存储
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: e.detail.pics.list[0].path
    }).then(res=>{
      console.log("授权文件上传成功: ", res);
      var fileId = res.fileID;

      ///////////  更新数据库  ///////////////
      wx.cloud.callFunction({
        name:'formsubmit',
        data: {
          ipt1: e.detail.ipt1.value,
          email: e.detail.email.value,
          num: e.detail.num.value,
          picker2: e.detail.picker2.original.range[e.detail.picker2.idx],
          pics: fileId
        },
        success: res => {
          wx.hideLoading()
          console.log('提交成功', res)
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({
            icon: 'error',
            title: '网络不给力....'
          })
          console.error('发布失败', err)
        }
      });

    }).catch(err=>{
      wx.showToast({
        title: '上传文件错误',
        icon: 'error',        
      });
      console.log(err);

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
  onLoad: function () {
    
  },
})
