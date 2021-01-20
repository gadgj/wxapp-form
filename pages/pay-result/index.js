/* eslint-disable camelcase */
// 订单详情
// eslint-disable-next-line no-unused-vars
const regeneratorRuntime = require('../../utils/runtime');
var app = getApp();

Page({
  data: {
    order: {},
    query : {}
  },

  onLoad({id}) {
    wx.showLoading({
      title: '正在加载',
    })

    this.setData({
      outTradeNo: id
    }, async () => {
      await this.getOrder()

      wx.hideLoading()
    })
  },

  // 获取订单详情
  async getOrder() {
    const {result} = await wx.cloud.callFunction({
      name: 'pay-v2',
      data: {
        ///corpname: app.globalData.cardInfo.rows[0].corpname,
        type: 'orderquery',
        data: {
          outTradeNo: this.data.outTradeNo,
          ///: app.globalData.cardInfo.rows[0]
        }
      }
    })

    const data = result.data || {}
    console.log(data);

    this.setData({
      order: data
    }, () => {
      // 如果状态是退款中，则每次进来都会查询一下退款情况
      if (data.status === 3) {
        this.queryRefund()
      }
    })
  },

  // 发起支付
  pay() {
    const orderQuery = this.data.order;

    const { payment } = orderQuery;

    wx.requestPayment({
      ...payment,
      success: async (res) => {
        console.log(res);
        // wx.showLoading({
        //   title: "正在支付",
        // });

        wx.showToast({
          title: "支付成功",
          icon: "success",
          duration: 2000,///1500,
          success: async () => {
            ///this.getOrder();
            ///wx.hideLoading();
            setTimeout(() => {
              this.getOrder();
            }, 1000);///延时1秒后再执行本地更新订单 --add by King 2020.12.22
          },
        });
      },
      fail(res) {
        console.log(res);
      },
      complete(res) {
        console.log(res);
      }
    });
  },

  // 关闭订单
  async close() {
    wx.showLoading({
      title: '正在关闭',
    })

    const outTradeNo = this.data.outTradeNo

    await wx.cloud.callFunction({
      name: 'pay-v2',
      data: {
        ///corpname: app.globalData.cardInfo.rows[0].corpname,
        type: 'closeorder',
        data: {
          outTradeNo,
          ///cardInfo: app.globalData.cardInfo.rows[0]
        }
      }
    })

    this.getOrder()

    wx.hideLoading()
  },

  // 查询退款情况
  async queryRefund() {
    const {result} = await wx.cloud.callFunction({
      name: 'pay-v2',
      data: {
        ///corpname: app.globalData.cardInfo.rows[0].corpname,
        type: 'queryrefund',
        data: {
          outTradeNo: this.data.outTradeNo,
          ///cardInfo: app.globalData.cardInfo.rows[0]
        }
      }
    })

    // 退款成功，则更新本地数据状态
    if (!result.code && result.data) {
      const data = result.data
      const order = this.data.order
      order.tradeStateDesc = data.tradeStateDesc
      order.status = data.status
      order.tradeState = data.tradeState

      this.setData({
        order
      })
    }
  },

  // 申请退款，但不会马上退
  async refund() {
    wx.showLoading({
      title: '正在申请退款',
    });

    ///再次校验确认充值状态 --add by King
    const order = this.data.order
    const db = wx.cloud.database();
    const theOrder = await db.collection('orders-v2').doc(order._id).get();
    console.log(theOrder);
    if(theOrder.data.cardinfo_state === '"true|操作成功!"') {
      wx.showToast({
        title: "已充值成功，不能退款！",
        icon: "none",
        duration: 2000,///1500,
        success: async () => {
          this.getOrder();
          ///wx.hideLoading();
        },
      });
      return;
    }
    ///再次校验确认充值状态 --add by King END

    const tempResult = await wx.cloud.callFunction({
      name: 'pay-v2',
      data: {
        ///corpname: app.globalData.cardInfo.rows[0].corpname,
        type: 'refund',
        data: {
          outTradeNo: this.data.outTradeNo,
          ///cardInfo: app.globalData.cardInfo.rows[0]
        }
      }
    });
    console.log(tempResult);
    
    const result = tempResult.result

    wx.hideLoading()

    if (!result.code) {
      const order = this.data.order
      order.tradeStateDesc = '正在退款'
      order.status = 3
      order.tradeState = 'REFUNDING'

      this.setData({
        order
      })
    } else {
      wx.showToast({
        title: result.message,
        icon: 'none'
      })
    }
  },

  // 删除订单
  async delete() {
    const order = this.data.order
    const db = wx.cloud.database()
    try {
      wx.showLoading({
        title: '正在删除',
      })

      await db.collection('orders-v2').doc(order._id).remove()

      wx.hideLoading()
      wx.showToast({
        title: '删除成功 ',
        icon: 'none',
        duration: 1500,
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1600)
    } catch (e) {
      wx.hideLoading()
      wx.showToast({
        title: '删除失败，请重试 ',
        icon: 'none'
      })
    }
  }
})
