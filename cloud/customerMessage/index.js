const cloud = require('wx-server-sdk')
const ms = require('ms')

cloud.init({
  // env: 'dev-hnrfx'
  // env: 'tcb-advanced-a656fc'
})

const TBPBot = require('./bots/tbp').TBPBot
const DialogStatus = require('./bots/tbp').DialogStatus

const db = cloud.database()
const _ = db.command
const CustomerMessageLog = db.collection('customer_message_log')

const STATUS = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE'
}

const MSG_TYPES = {
  text: 'text',
  image: 'image',
  miniprogrampage: 'miniprogrampage',
  event: 'event',
}

const HELP_TIPS = '您可以回复以下内容寻求帮助：\n重置会话请回复：reset\n订机票可回复：订机票'
const HELP_TIPS_King = '请回复以下内容支付办卡费用(支付时请务必备注姓名+科室)，完成办理申请。\n新办卡请回复: 1\n补办卡请回复: 2'

async function handleEnterEvent(event) {
  console.log(event);
  const { FromUserName } = event
  const reply = {
    touser: FromUserName,
    msgtype: MSG_TYPES.text,
    text: {
      content: `您好，请问有什么可以帮助您的？\n${HELP_TIPS}`
    }
  }
  return await cloud.openapi.customerServiceMessage.send(reply)
}

///下载云存储图片  --add by King 2021.01.23
let downLoad = async(tapId) => {
    const fileId = tapId == 'xinKa' ? 'cloud://gxwl-0g5grrgie1927a4c.6778-gxwl-0g5grrgie1927a4c-1304647022/zye40.png' : 'cloud://gxwl-0g5grrgie1927a4c.6778-gxwl-0g5grrgie1927a4c-1304647022/zye30.png';
    const res = await cloud.downloadFile({
        fileID: fileId, // 图片的File ID
    })
    const buffer = res.fileContent
    console.log(buffer)
    return buffer
}

///把媒体文件上传到微信服务器 --add by King 2021.01.23
let upload = async(Buffer) => {
    return await cloud.openapi.customerServiceMessage.uploadTempMedia({
        type: 'image',
        media: {
            contentType: 'image/png',
            value: Buffer
        }
    })
}

async function handleEnterEvent_King(event) {
  console.log('---------------------------------------进入发送收款码方法！\n');
  const FromUserName = event.userInfo.openId;///const { FromUserName } = event;

  const reply_txt = {
    touser: FromUserName,
    msgtype: MSG_TYPES.text,
    text: {
      content: `您好，已收到你提交的表单，${HELP_TIPS_King}`
    }
  }
  return await cloud.openapi.customerServiceMessage.send(reply_txt);

  ///sendShouKuanMa(event);
}

async function sendShouKuanMa(event) {
  ////发送收款码
  let Buffer = await downLoad(event.tapId);
  let meida = await upload(Buffer);
  console.log(meida);
  try {
      const result = await cloud.openapi.customerServiceMessage.send({
          touser: event.userInfo.openId,
          "msgtype": "image",
          "image": {
              "media_id": meida.mediaId
          }
      });
      console.log('-----------------------------发送收款码结果\n', result);
      return result;
  } catch (err) {
      console.log(err);
      return err;
  }
}


async function handleMiniprogrampageMsg(event) {

}

async function handleImageMsg(event) {
  const { FromUserName } = event
  const reply = {
    touser: FromUserName,
    msgtype: event.MsgType
  }
  reply.image = { media_id: event.MediaId }
  return await cloud.openapi.customerServiceMessage.send(reply)
}

async function handleTextMsg_King(event) {
  if (event.Content === '1') {
    event.tapId = 'xinKa';
    sendShouKuanMa(event);
  } else if (event.Content === '2') {
    event.tapId = 'buKa';
    sendShouKuanMa(event);
  } else {
    handleEnterEvent_King(event);
  }
  
}

async function handleTextMsgWithTBPBot(event) {
  const { FromUserName, ToUserName } = event

  const BotId = '61a6d821-b1e9-4c5c-a789-fb6150670f1b'
  const BotEnv = 'dev'
  const roomId = `${BotEnv}!${FromUserName}!${ToUserName}`

  let result = null

  const reply = {
    touser: FromUserName,
    msgtype: event.MsgType
  }

  // 获取上一次会话
  const {data: items} = await CustomerMessageLog.where({
    roomId: roomId,
    status: STATUS.OPEN
  }).orderBy('_id', 'desc').get()

  let doc = items[0]

  // 会话上下文有效时间20分钟
  if (doc && (new Date() - doc.updatedAt > ms('20m'))) {
    const tbp = new TBPBot(BotId, BotEnv, doc._id)
    await Promise.all([
      tbp.textReset(),
      CustomerMessageLog.doc(doc._id).update({
        data: {
          reason: 'EXPIRED',
          status: STATUS.CLOSE,
          updateAt: new Date()
        }
      })
    ])
    doc = null
  }

  // 如果不存在会话则创建
  doc = doc ? doc : await CustomerMessageLog.add({
    data: {
      botId: BotId,
      botEnv: BotEnv,
      roomId: roomId,
      fromUserName: FromUserName,
      toUserName: ToUserName,
      status: STATUS.OPEN,
      createdAt: new Date(),
      updatedAt: new Date(),
      logs: []
    }
  })

  const tbp = new TBPBot(BotId, BotEnv, doc._id)
  if (event.Content.toLowerCase() === 'reset') {
    await Promise.all([
      tbp.textReset(),
      CustomerMessageLog.doc(doc._id).update({
        data: {
          reason: 'RESET',
          status: STATUS.CLOSE,
          updateAt: new Date()
        }
      })
    ])
    reply.text = {
      content: `已为您重置会话上下文。\n${HELP_TIPS}`
    }
  }
  else {
    const tbpResult = await tbp.textProcess(event.Content)

    if (tbpResult.ResponseText === '对不起，我不明白你的意思。') {
      reply.text = {
        content: `智能客服未能理解您的意思，已经自动为您转人工客服，请稍后...`
      }
  
      result = {
        ToUserName: FromUserName,
        FromUserName: event.ToUserName,
        CreateTime: Math.floor(Date.now() / 1000),
        MsgType: 'transfer_customer_service'
      }
    }
    else {
      reply.text = {
        content: tbpResult.ResponseText
      }
    }

    await CustomerMessageLog.doc(doc._id).update({
      data: {
        status: tbpResult.DialogStatus === DialogStatus.COMPLETE ? STATUS.CLOSE : STATUS.OPEN,
        updatedAt: new Date(),
        logs: _.push({
          inputMessage: event.Content,
          replyMessage: tbpResult.ResponseText,
          event,
          reply,
          createdAt: new Date()
        })
      }
    })
  }

  await cloud.openapi.customerServiceMessage.send(reply)
  return result
}

async function handleTextMsgWithTBPBotSample(event) {
  const { FromUserName, ToUserName } = event

  const BotId = '61a6d821-b1e9-4c5c-a789-fb6150670f1b'
  const BotEnv = 'dev'
  const roomId = `${BotEnv}!${FromUserName}!${ToUserName}`

  let result = null

  const reply = {
    touser: FromUserName,
    msgtype: event.MsgType
  }

  const tbp = new TBPBot(BotId, BotEnv, roomId)

  if (event.Content.toLowerCase() === 'reset') {
    await Promise.all([
      tbp.textReset()
    ])
    reply.text = {
      content: `已为您重置会话上下文。\n${HELP_TIPS}`
    }
  }
  else {
    const tbpResult = await tbp.textProcess(event.Content)

    if (tbpResult.ResponseText === '对不起，我不明白你的意思。') {
      reply.text = {
        content: `智能客服未能理解您的意思，已经自动为您转人工客服，请稍后...`
      }
  
      result = {
        ToUserName: FromUserName,
        FromUserName: event.ToUserName,
        CreateTime: Math.floor(Date.now() / 1000),
        MsgType: 'transfer_customer_service'
      }
    }
    else {
      reply.text = {
        content: tbpResult.ResponseText
      }
    }
  }

  await cloud.openapi.customerServiceMessage.send(reply)
  return result
}

exports.main = async (event, context) => {
  console.log(event);
  let result

  switch (event.MsgType) {
    case MSG_TYPES.event:
      if (event.Event === 'user_enter_tempsession') {
        result = await handleEnterEvent_King(event);///await handleEnterEvent(event);
      }
      break;
  
   case MSG_TYPES.miniprogrampage:
       result = await handleMiniprogrampageMsg(event)
       break;
  
   case MSG_TYPES.image:
       result = await handleImageMsg(event)
       break;

   case MSG_TYPES.text:
      ///result = await handleTextMsgWithTBPBot(event)
      // result = await handleTextMsgWithTBPBotSample(event)
      result = await handleTextMsg_King(event);
      break;

    default:
      break;
  }

  // if(event.tapId) {
  //   result = await sendShouKuanMa(event);//主动调用会话云函数
  // }

  return result ? result : 'success'
}
