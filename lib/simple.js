const fs = require('fs')
const util = require('util')
const path = require('path')
const FileType = require('file-type')
const fetch = require('node-fetch')
const PhoneNumber = require('awesome-phonenumber')
const { MessageType } = require('@adiwajshing/baileys')
const { getBuffer } = require('./funct')

exports.WAConnection = _WAConnection => {
	class WAConnection extends _WAConnection {
		constructor(...args) {
		  super(...args)
      this.on('message-new', m => {
        let type = m.messageStubType
        let participants = m.messageStubParameters
        switch (type) {
          case 27:
          case 31:
            this.emit('group-add', { m, type, participants })
            break
          case 28:
          case 32:
            this.emit('group-leave', { m, type, participants })
            break
          case 40:
          case 41:
          case 45:
          case 46:
            this.emit('call', {
              type, participants,
              isGroup: type == 45 || type == 46,
              isVideo: type == 41 || type == 46
            })
            break
        }
      })

      if (!Array.isArray(this._events['CB:action,add:relay,message'])) this._events['CB:action,add:relay,message'] = [this._events['CB:action,add:relay,message']]
      else this._events['CB:action,add:relay,message'] = [this._events['CB:action,add:relay,message'].pop()]
      this._events['CB:action,add:relay,message'].unshift(async function (json) {
        try {
          let m = json[2][0][2]
          if (m.message && m.message.protocolMessage && m.message.protocolMessage.type == 0) {
            let key = m.message.protocolMessage.key
            let c = this.chats.get(key.remoteJid)
            let a = c.messages.dict[`${key.id}|${key.fromMe ? 1 : 0}`]
            let participant = key.fromMe ? this.user.jid : a.participant ? a.participant : key.remoteJid
            let WAMSG = a.constructor
            this.emit('message-delete', { key, participant, message: WAMSG.fromObject(WAMSG.toObject(a)) })
          }
        } catch (e) {}
      })

      this.sendFileFromUrl = this.sendFile
        }
        async sendFileFromUrl(from, url, caption, msg, men) {
            let mime = '';
            let res = await axios.head(url)
            mime = res.headers['content-type']
            let type = mime.split("/")[0]+"Message"
            if(mime === "image/gif"){
                type = MessageType.video
                mime = Mimetype.gif
            }
            if(mime === "application/pdf"){
                type = MessageType.document
                mime = Mimetype.pdf
            }
            if(mime.split("/")[0] === "audio"){
                mime = Mimetype.mp4Audio
            }
            return this.sendMessage(from, await getBuffer(url), type, {caption: caption, quoted: msg, mimetype: mime, contextInfo: {"mentionedJid": men ? men : []}})
        }

    async copyNForward(jid, message, forceForward = false, options = {}) {
      let mtype = Object.keys(message.message)[0]
      let content = await this.generateForwardMessageContent(message, forceForward)
      let ctype = Object.keys(content)[0]
      let context = {}
      if (mtype != MessageType.text) context = message.message[mtype].contextInfo
      content[ctype].contextInfo = {
         ...context,
         ...content[ctype].contextInfo
      }
      const waMessage = await this.prepareMessageFromContent(jid, content, options)
      await this.relayWAMessage(waMessage)
      return waMessage
    }
    
    async sendMessageFromContent(jid,obj,opt={}){
     let prepare = await this.prepareMessageFromContent(jid,obj,opt)
    await this.relayWAMessage(prepare)
    return prepare
     }

    async cMod(jid, message, text = '', sender = this.user.jid, options = {}) {
      let M = message.constructor
      let copy = M.fromObject(M.toObject(message))
      let mtype = Object.keys(copy.message)[0]
      let msg = copy.message[mtype]
      if (typeof msg === 'string') copy.message[mtype] = text || msg
      else if (msg.caption) msg.caption = text || msg.caption
      else if (msg.text) msg.text = text || msg.text
      if (typeof msg !== 'string') copy.message[mtype] = {...msg, ...options}
      if (copy.participant) sender = copy.participant = sender || copy.participant
      else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
      if (message.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || message.key.remoteJid
      else if (message.key.remoteJid.includes('@broadcast')) sender = sender || message.key.remoteJid
      copy.key.remoteJid = sender
      copy.key.fromMe = sender === this.user.jid
      return copy
    }

    async genOrderMessage(message, options) {
      let m = {}
      switch (type) {
        case MessageType.text:
        case MessageType.extendedText:
          if (typeof message === 'string') message = { text: message }
          m.extendedTextMessage = WAMessageProto.ExtendedTextMessage.fromObject(message);
          break
        case MessageType.location:
        case MessageType.liveLocation:
          m.locationMessage = WAMessageProto.LocationMessage.fromObject(message)
          break
        case MessageType.contact:
          m.contactMessage = WAMessageProto.ContactMessage.fromObject(message)
          break
        case MessageType.image:
        case MessageType.sticker:
        case MessageType.document:
        case MessageType.video:
        case MessageType.audio:
          m = await this.prepareMessageMedia(message, type, options)
          break
        case 'orderMessage':
          m.orderMessage = WAMessageProto.OrderMessage.fromObject(message)
      }
      return WAMessageProto.Message.fromObject(m);
    }

    waitEvent(eventName, is = () => true, maxTries = 25) {
      return new Promise((resolve, reject) => {
        let tries = 0
        let on = (...args) => {
          if (++tries > maxTries) reject('Max tries reached')
          else if (is()) {
            this.off(eventName, on)
            resolve(...args)
          }
        }
        this.on(eventName, on)
      })
    }

    sendContact(jid, number, name, quoted, options) {
      // TODO: Business Vcard
      number = number.replace(/[^0-9]/g, '')
      let vcard = `
BEGIN:VCARD
FN:${name}
TEL;waid=${number}:${PhoneNumber('+' + number).getNumber('international')}
END:VCARD
`.trim()
      return this.sendMessage(jid, {
        displayName: name,
        vcard
      }, MessageType.contact, { quoted, ...options })
    }
    
    async getFile(path) {
      let res
	  	let data = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (res = await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : typeof path === 'string' ? path : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      let type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
      }

      return {
        res,
        ...type,
        data
      }
    }

  	reply(jid, text, quoted, options) {
  		return Buffer.isBuffer(text) ? this.sendFile(jid, text, 'file', '', quoted, false, options) : this.sendMessage(jid, text, MessageType.extendedText, { quoted, ...options })
  	}
	  fakeReply(jid, text = '', fakeJid = this.user.jid, fakeText = '', fakeGroupJid, options) {
  		return this.reply(jid, text, { key: { fromMe: fakeJid == this.user.jid, participant: fakeJid, ...(fakeGroupJid ? { remoteJid: fakeGroupJid } : {}) }, message: { conversation: fakeText }, ...options})
  	}

    async fakeReply2(jid, message, type, sender, message2, type2, options = {}, options2 = {}, remoteJid) {
      let content = await this.prepareMessageContent(message2, type2, options2)
      let quoted = this.prepareMessageFromContent(jid, content, options2)
      quoted = await this.cMod(jid, quoted, undefined, sender)
      if (remoteJid) quoted.key.remoteJid = remoteJid
      else delete quoted.key.remoteJid

      return this.prepareMessage(jid, message, type, { quoted, ...options })
    }
     async joinvialink(jid) {
     const link = jid.split('com/')[1]
        const response = await this.query({ json: ['action', 'invite', link], expect200: true })
        return response
    }
    async inviteInfo(jid) {
     const link = jid.split('com/')[1]
        const response = await this.query({ json: ['query', 'invite', link] })
        return response
    }
    
    async resetInvite(jid) {
        const response = await this.query({ json: ['action', 'inviteReset', jid], expect200: true })
        return response
    }
  	parseMention(text) {
  		return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
  	}

	  getName(jid)  {
  		let v = jid === '0@s.whatsapp.net' ? {
        jid,
        vname: 'WhatsApp'
      } : jid === this.user.jid ?
        this.user :
        this.contactAddOrGet(jid)
  		return v.name || v.vname || v.notify || PhoneNumber('+' + v.jid.replace('@s.whatsapp.net', '')).getNumber('international')
  	}

	  async downloadM(m) {
      if (!m) return Buffer.alloc(0)
    	if (!m.message) m.message = { m }
	  	if (!m.message[Object.keys(m.message)[0]].url) await this.updateMediaMessage(m)
  		return await this.downloadMediaMessage(m)
  	}

    serializeM(m) {
      return exports.smsg(this, m)
    }
	}

  return WAConnection
}

exports.smsg = (sock, msg) => {
    if (msg.message["ephemeralMessage"]){
        msg.message = msg.message.ephemeralMessage.message
        msg.ephemeralMessage = true
        
    }else{
      msg.ephemeralMessage = false
    }
    msg.isGroup = msg.key.remoteJid.endsWith('@g.us')
    try{
        const berak = Object.keys(msg.message)[0]
        msg.type = berak
    } catch {
        msg.type = null
    }
    try{
        const context = msg.message[msg.type].contextInfo.quotedMessage
        if(context["ephemeralMessage"]){
            msg.quotedMsg = context.ephemeralMessage.message
        }else{
            msg.quotedMsg = context
        }
        msg.isQuotedMsg = true
        msg.quotedMsg.sender = msg.message[msg.type].contextInfo.participant
        msg.quotedMsg.fromMe = msg.quotedMsg.sender === sock.user.jid ? true : false
        msg.quotedMsg.type = Object.keys(msg.quotedMsg)[0]
        let ane = msg.quotedMsg
        msg.quotedMsg.chats = (ane.type === 'conversation' && ane.conversation) ? ane.conversation : (ane.type == 'imageMessage') && ane.imageMessage.caption ? ane.imageMessage.caption : (ane.type == 'documentMessage') && ane.documentMessage.caption ? ane.documentMessage.caption : (ane.type == 'videoMessage') && ane.videoMessage.caption ? ane.videoMessage.caption : (ane.type == 'extendedTextMessage') && ane.extendedTextMessage.text ? ane.extendedTextMessage.text : ""
        msg.quotedMsg.id = msg.message[msg.type].contextInfo.stanzaId
        msg.quotedMsg.isBaileys = msg.quotedMsg.id.startsWith('3EB0') && msg.quotedMsg.id.length === 12
    }catch{
        msg.quotedMsg = null
        msg.isQuotedMsg = false
    }

    try{
        const mention = msg.message[msg.type].contextInfo.mentionedJid
        msg.mentioned = mention
    }catch{
        msg.mentioned = []
    }
    
    if (msg.isGroup){
        msg.sender = msg.participant
    }else{
        msg.sender = msg.key.remoteJid
    }
    if (msg.key.fromMe){
        msg.sender = sock.user.jid
    }

    msg.from = msg.key.remoteJid
    msg.fromMe = msg.key.fromMe
    msg.isBaileys = msg.key.id.startsWith('3EB0') && msg.key.id.length === 12

    const conts = msg.key.fromMe ? sock.user.jid : sock.contacts[msg.sender]
	msg.pushname = msg.key.fromMe ? sock.user.name : !conts ? '-' : conts.notify || conts.vname || conts.name || '-'   

    msg.chats = (msg.type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (msg.type == 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (msg.type == 'documentMessage') && msg.message.documentMessage.caption ? msg.message.documentMessage.caption : (msg.type == 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (msg.type == 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : ""

    return msg
}

exports.logic = (check, inp, out) => {
	if (inp.length !== out.length) throw new Error('Input and Output must have same length')
	for (let i in inp) if (util.isDeepStrictEqual(check, inp[i])) return out[i]
	return null
}