"use strict";
const {
    MessageType,
    Presence,
    Mimetype,
    GroupSettingChange,
    MessageOptions,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
    mentionedJid,
    WA_DEFAULT_EPHEMERAL
} = require("@adiwajshing/baileys");
const fs = require("fs");
const moment = require("moment-timezone");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const fetch = require("node-fetch");
const ms = require("parse-ms");
const util = require("util");
const toMS = require("ms");
const axios = require("axios");
const cheerio = require("cheerio");
const speed = require("performance-now");
const google = require('google-it');
const WSF = require('wa-sticker-formatter');
const hxz = require('hxz-api');
const BS = require('@bochilteam/scraper');

const Exif = require('./lib/exif')
const exif = new Exif()

const { color, bgcolor } = require("./lib/color");
const { jsonformat, isUrl, randomNomor, sleep, fetchJson, fetchText, getBuffer, getRandom, getGroupAdmins, kyun, runtime } = require("./lib/funct");
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("./lib/limit");
const { addBanned, unBanned, BannedExpired, cekBannedUser } = require("./lib/banned");
const { addCmd, getCmd, getCommandPosition } = require("./lib/commands")
const { addBadword, delBadword, isKasar, addCountKasar, isCountKasar, delCountKasar } = require("./lib/badword");
const prem = require("./lib/premium");
const _sewa = require("./lib/sewa");
const afk = require("./lib/afk");
const { getUser, getPost, searchUser } = require('./lib/instagram');
const { fbdl } = require("./lib/fbdl");

let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'))
let setting = JSON.parse(fs.readFileSync('./config.json'));
let mess = JSON.parse(fs.readFileSync('./database/mess.json'));
let balance = JSON.parse(fs.readFileSync('./database/balance.json'));
let premium = JSON.parse(fs.readFileSync('./database/premium.json'));
let sewa = JSON.parse(fs.readFileSync('./database/sewa.json'));
let ban = JSON.parse(fs.readFileSync('./database/ban.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let antiwame = JSON.parse(fs.readFileSync('./database/antiwame.json'));
let nsfw = JSON.parse(fs.readFileSync('./database/nsfw.json'));
let antiviewonce = JSON.parse(fs.readFileSync('./database/antiviewonce.json'));
let badword = JSON.parse(fs.readFileSync('./database/badword.json'));
let grupbadword = JSON.parse(fs.readFileSync('./database/grupbadword.json'));
let senbadword = JSON.parse(fs.readFileSync('./database/senbadword.json'));
let mute = JSON.parse(fs.readFileSync('./database/mute.json'));
let _leveling = JSON.parse(fs.readFileSync('./database/leveling.json'))
let _level = JSON.parse(fs.readFileSync('./database/level.json'))
let _respon = JSON.parse(fs.readFileSync('./database/respon.json'))
let _stick = JSON.parse(fs.readFileSync('./database/sticker.json'))
let _vn = JSON.parse(fs.readFileSync('./database/vn.json'))
let _image = JSON.parse(fs.readFileSync('./database/image.json'))
let _scommand = JSON.parse(fs.readFileSync('./database/scommand.json'))
let _claim = JSON.parse(fs.readFileSync('./database/claim.json'))
let limit = JSON.parse(fs.readFileSync('./database/limit.json'));

let { ownerNumber, limitCount } = setting

let multi = true
let nopref = false
let prefa = '/'

let imgurl = 'https://telegra.ph/file/3c50226a49384d2c14ce2.jpg'
let thumb2 = fs.readFileSync('./lib/thumb2.jpg');
let thumb = fs.readFileSync('./lib/thumb.png');
let imgrzx2 = fs.readFileSync('./lib/rzxbot2.jpg');
let imgrzx = fs.readFileSync('./lib/rzxbot.jpg');

const getLevelingXp = (userId) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        return _level[position].xp
    }
}

const getLevelingLevel = (userId) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        return _level[position].level
    }
}

const getLevelingId = (userId) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        return _level[position].jid
    }
}

const addLevelingXp = (userId, amount) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        _level[position].xp += amount
        fs.writeFileSync('./database/level.json', JSON.stringify(_level))
    }
}

const addLevelingLevel = (userId, amount) => {
    let position = false
    Object.keys(_level).forEach((i) => {
        if (_level[i].jid === userId) {
            position = i
        }
    })
    if (position !== false) {
        _level[position].level += amount
        fs.writeFileSync('./database/level.json', JSON.stringify(_level))
    }
}

const addLevelingId = (userId) => {
    const obj = {jid: userId, xp: 1, level: 1}
    _level.push(obj)
    fs.writeFileSync('./database/level.json', JSON.stringify(_level))
}

const xpGain = new Set()
const isGained = (userId) => {
    return !!xpGain.has(userId)
}

const addCooldown = (userId) => {
    xpGain.add(userId)
    setTimeout(() => {
        return xpGain.delete(userId)
    }, 60000)
}

module.exports = async (sock, msg) => {
	try {
		const { otakudesu, covid, ongoing, komiku, tebakgambar, surah, sholat, lirik, chara, wattpad, playstore, linkwa, pinterest, igdl, igstory, igstalk, twitter, fbdown, youtube, ttdownloader } = hxz
		const { type, quotedMsg, isGroup, isQuotedMsg, mentioned, sender, from, fromMe, pushname, chats, isBaileys } = msg
		const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product, buttonsMessage, listMessage } = MessageType
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
        if (multi){
		    var prefix = /^[°•π÷×¶∆£¢€¥®™✓=|!?#%^&.+,\/\\©^]/.test(command) ? command.match(/^[°•π÷×¶∆£¢€¥®™✓=|!?#%^&.+,\/\\©^]/gi) : '#'
        } else {
            if (nopref){
                prefix = ''
            } else {
                prefix = prefa
            }
        }
        const time = moment.tz('Asia/Jakarta').format('HH:mm:ss')
        const ucapan = "Selamat "+ moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const isCmd = command.startsWith(prefix)
        const q = chats.slice(command.length + 1, chats.length)
        const body = chats.startsWith(prefix) ? chats : ''
        const botNumber = sock.user.jid
        const groupMetadata = isGroup ? await sock.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender) || false
        const isOwner = ownerNumber.includes(sender)
        const isPremium = isOwner ? true : prem.checkPremiumUser(sender, premium)
        const isSewa = _sewa.checkSewaGroup(from, sewa)
	    const isBan = cekBannedUser(sender, ban)
        const isClaimOn = _claim.includes(sender)
        const isAntiLink = isGroup ? antilink.includes(from) : false
        const isAntiWame = isGroup ? antiwame.includes(from) : false
        const isAntiVO = isGroup ? antiviewonce.includes(from) : false
        const isNsfw = isGroup ? nsfw.includes(from) : false
        const isBadword = isGroup ? grupbadword.includes(from) : false
        const isMuted = isGroup ? mute.includes(from) : false
        const isLevelingOn = isGroup ? _leveling.includes(from) : false
        const isUser = pendaftar.includes(sender)
        const more = String.fromCharCode(8206)
		const readmore = more.repeat(4001)
        
        var countDownDate = new Date("April, 02, 2022 04:15:00").getTime();
        var now = new Date(new Date().getTime() + 25200000).getTime();
        var distance = countDownDate - now;
        var hD = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hH = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var hM = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var hS = Math.floor((distance % (1000 * 60)) / 1000);
        var hitungRamadhan = `${hD} Hari ${hH} Jam ${hM} Menit ${hS} Detik`
        
        let d = new Date(new Date + 3600000)
        let locale = 'id'
        // d.getTimeZoneOffset()
        // Offset -420 is 18.00
        // Offset    0 is  0.00
        // Offset  420 is  7.00
        let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
        let week = d.toLocaleDateString(locale, { weekday: 'long' })
        let date = d.toLocaleDateString(locale, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
        })
        let dateIslam = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
        }).format(d)
        let times = d.toLocaleTimeString(locale, {
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
        })
        
        const reply = (teks) => {
            return sock.sendMessage(from, teks, text, {quoted:msg})
        }
        const replyAd = (teks, title, desc) => {
			sock.sendMessage(from, teks, MessageType.text, { contextInfo: { externalAdReply: { title: title, body: desc, previewType: "PHOTO", thumbnail: imgrzx, sourceUrl: `` }}})
		}
        const sendMess = (hehe, teks) => {
            return sock.sendMessage(hehe, teks, text)
        }
        const custom = (id, mseg, type, opt = {}) => {
        	return sock.sendMessage(id, mseg, type, opt)
        }
        const mentions = (teks, memberr, id) => {
            let ai = (id == null || id == undefined || id == false) ? sock.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : sock.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
            return ai
        }
        const sendVideo = async(from, url, cpt) => {
           	await sock.sendMessage(from, { url: url }, // can send mp3, mp4, & ogg
               MessageType.video, 
               { quoted: msg, mimetype: 'video/mp4', caption: cpt} // some metadata (can't have caption in audio)
                )
        }
        const sendAudio = async(from, url) => {
           	await sock.sendMessage(from, { url: url }, // can send mp3, mp4, & ogg
               MessageType.audio, 
               { quoted: msg, mimetype: Mimetype.mp4Audio } // some metadata (can't have caption in audio)
                )
        }
        async function sendFileFromUrl(from, url, caption, msg, men) {
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
            return sock.sendMessage(from, await getBuffer(url), type, {caption: caption, quoted: msg, mimetype: mime, contextInfo: {"mentionedJid": men ? men : []}})
        }
        
        const isImage = (type === 'imageMessage')
        const isVideo = (type === 'videoMessage')
        const isSticker = (type == 'stickerMessage')
        const isList = (type == 'listResponseMessage')
        const isButton = (type == 'buttonsResponseMessage')
        const isViewOnce = (type == 'viewOnceMessage')
        
        const isQuotedImage = isQuotedMsg ? (quotedMsg.type === 'imageMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? (quotedMsg.type === 'audioMessage') ? true : false : false
        const isQuotedDocument = isQuotedMsg ? (quotedMsg.type === 'documentMessage') ? true : false : false
        const isQuotedVideo = isQuotedMsg ? (quotedMsg.type === 'videoMessage') ? true : false : false
        const isQuotedSticker = isQuotedMsg ? (quotedMsg.type === 'stickerMessage') ? true : false : false
        const isQuotedList = isQuotedMsg ? (quotedMsg.type === 'listResponseMessage') ? true : false : false
        const isQuotedButton = isQuotedMsg ? (quotedMsg.type === 'buttonsResponseMessage') ? true : false : false
        const isQuotedContact = isQuotedMsg ? (quotedMsg.type === 'contactMessage') ? true : false : false
        
        async function sendButMessage (id, content, footer, but = [], opt = {}) {
			sock.sendMessage(id, { 
				contentText: content,
				footerText: footer,
				buttons: but,
				headerType: 1
				}, MessageType.buttonsMessage, opt)
		}
		
		async function sendButImage (id, content, footer, img, but = [], opt = {}) {
			images = await sock.prepareMessage(id, img, image)
			sock.sendMessage(id, { 
				imageMessage: images.message.imageMessage,
				contentText: content,
				footerText: footer,
				buttons: but,
				headerType: 4
				}, MessageType.buttonsMessage, opt)
		}
		
		async function sendButVideo (id, content, footer, vid, but = [], opt = {}) {
			videos = await sock.prepareMessage(id, vid, video)
			sock.sendMessage(id, { 
				videoMessage: videos.message.videoMessage,
				contentText: content,
				footerText: footer,
				buttons: but,
				headerType: 5
				}, MessageType.buttonsMessage, opt)
		}
		
		async function sendButLocation (id, content, footer, loc, but = [], opt = {}) {
			locations = await sock.prepareMessage(id, loc, location)
			sock.sendMessage(id, { 
				locationMessage: locations.message.locationMessage,
				contentText: content,
				footerText: footer,
				buttons: but,
				headerType: 6
				}, MessageType.buttonsMessage, opt)
		}
		
		/*
        mimetype for sending message type document

        PDF : "application/pdf"
        DOCX : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        XLSX : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        DOC : "application/msword"
        EXCEL : "application/msexcel"
        */
        let mimedoc = ["application/pdf","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/msword"]
        let randomMime = mimedoc[Math.floor(Math.random() * mimedoc.length)]
		async function sendButDocument (id, content, footer, img, but = [], opt = {}) {
			sock.sendMessage(id, {
               contentText: content,
               footerText: footer,
               buttons: but,
               "headerType": "DOCUMENT", 
               "documentMessage": { 
               "url": "https://mmg.whatsapp.net/d/f/Ano5cGYOFQnC51uJaqGBWiCrSJH1aDCi8-YPQMMb1N1y.enc", 
               "mimetype": randomMime,
               "title": "@Rzxbot", 
               "fileSha256": "8Xfe3NQDhjwVjR54tkkShLDGrIFKR9QT5EsthPyxDCI=", 
               "fileLength": 50000000000, 
               "pageCount": 1000, 
               "mediaKey": "XWv4hcnpGY51qEVSO9+e+q6LYqPR3DbtT4iqS9yKhkI=", 
               "fileName": "ʀᴢx ʙᴏᴛ ᴡʜᴀᴛsᴀᴘᴘ", 
               "fileEncSha256": "NI9ykWUcXKquea4BmH7GgzhMb3pAeqqwE+MTFbH/Wk8=", 
               "directPath": "/v/t62.7119-24/35160407_568282564396101_3119299043264875885_n.enc?ccb=11-4&oh=d43befa9a76b69d757877c3d430a0752&oe=61915CEC", 
               "mediaKeyTimestamp": "1634472176",
               "jpegThumbnail": img }}, 
               MessageType.buttonsMessage,
               opt)
		}
		
		async function sendProduct (id, title, desc, opt = {}) {
			sock.sendMessageFromContent(id, {
		        productMessage: {
			    product: {
				productId: "123456789",
				productImage: { "url": "https://mmg.whatsapp.net/d/f/ArsikwrCZw71WxjojalTmUmJ4vE8VFl6MouPOKATdB3P.enc", "mimetype": "image/jpeg", "fileSha256": "lcS+bXzMDYjy8jUcudgo8v69jgoW0UNHCEr2VMvAZME=", "fileLength": "50000000000", "height": 800, "width": 1280, "mediaKey": "kr6Q7KJ1MccGKoaC2IF9RtvYWcQznGPXSxr4FbEvofM=", "fileEncSha256": "0P8vbNrJFahD+iC2TKEyO05o1fbWxZ3pDprC3kJ3tJY=", "directPath": "/v/t62.7118-24/31470510_528325865544547_2493423223647836827_n.enc?ccb=11-4&oh=01_AVw7smYxaKJWYRPmIW7aOBVJwRs1oOzdjFMImSL11WEOeg&oe=624E051C", "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIACwASAMBIgACEQEDEQH/xAArAAADAQEBAAAAAAAAAAAAAAABAgMEAAUBAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAPCAIraGMY1sZRaYnNxN1oaUTixlQSb5xuHAIYDroIrtzkUZCnHj/8QAIBAAAgICAwEAAwAAAAAAAAAAAQIAEQMhEhMxQRAicf/aAAgBAQABPwC9w7lEzjCNwAG5UqVA29wkeiKqAKCtsYDjth1+QdbuB1GMuJcnDgbmbr5Uo/s+T4YYlEi4WQMa/a9RwigpvRmN1QBgTZ0BBwZxpuY2TCEZjStHCqxANwz2UAIhClTCLJtvTLClSh8ERiXu9mZCVsXsmz+LsGLuVQ2ZyIqp2MRZltC7ADcZiwswRfsQbjbWVoTrUIpgwp0l5nQKqEfYRowexRsif//EABQRAQAAAAAAAAAAAAAAAAAAADD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAADD/2gAIAQMBAT8Af//Z", "scansSidecar": "B2RAqdIPa+maavFZ/ArqZEnSYCy0mpLbai1uWSPAF396OlAY9j+dkg==", "scanLengths": [9130, 24920, 14024, 22920], "midQualityFileSha256": "i9E6xnrQauMOkpyViN0m9ipiSUftf/zOMPrHwB+5aZM=" },
                title: title,
				description: desc,
				currencyCode: "IDR",
				priceAmount1000: "500000000000",
				salePriceAmount1000: "50000",
				productImageCount: 5,
				url: "https://github.com/RzxGamz",
				retailerId: "@RzxBot"
				},
				businessOwnerJid: "0@s.whatsapp.net"
				}}, opt)
		}
		
		async function sendGif (id, text, opt) {
	        sock.sendMessageFromContent(id, { videoMessage: {
	            "url": "https://mmg.whatsapp.net/d/f/Au15fKR7YGRI7RKIQngbXiOIYdhck3fj3EF6o_xBYEFp.enc",
	            "mimetype": "video/mp4",
	            "fileSha256": "+nIwYvigq83/rCsjMAZu7tvSFI/RWbqusttRrkUU3I8=",
	            "fileLength": "500000000000",
	            "seconds": 5000,
	            "mediaKey": "EZlSsuXXuTLN/b++f2pRwsgK0jnP8epTNg7Bo0rltdc=",
	            "caption": text,
	            "gifPlayback": true,
	            "fileEncSha256": "DRaOOzcrGsbpkCg7xxonDqnVnvUgSUv3buxenO1ctrs=",
	            "gifAttribution": "GIPHY"
        }}, opt)
        }
        
        async function sendListProduct (id, title, desc, footer, but, img, opt = {}) {
        	sock.sendMessageFromContent(id, { listMessage: {
                title: title,
                description: desc,
                listType: 2,
                productListInfo: { 
                productSections: [{
                    but
                }],
                headerImage: { productId: "", jpegThumbnail: img },
                businessOwnerJid: "6288225066473@s.whatsapp.net"
             },
          footerText: footer,
        }}, opt)
        }
		
		async function sendCatalog (id, title, desc, img, opt = {}) {
			msg = sock.prepareMessageFromContent(id, { "orderMessage": { "itemCount": 404, "message": title, "footerText": desc, "thumbnail": img, "surface": 'CATALOG' }, "businessOwnerJid": "0@s.whatsapp.net" }, opt)
			sock.relayWAMessage(msg)
		}
		
		async function sendGroupMess (id, title, capt, img, opt = {}) {
			msg = sock.prepareMessageFromContent(id, { "groupInviteMessage": { "groupJid": '6288213840883-1616169743@g.us', "inviteCode": 'https://chat.whatsapp.com/Dgt6JhzTvlmEor8Zz23fHx', "groupName": title, "footerText": "@Rzxbot", "jpegThumbnail": img, "caption": capt}}, opt)
			sock.relayWAMessage(msg)
		}
		
		if (isBaileys) return
        
        if (sock.mode === 'self') {
        	if (!isOwner && !fromMe) return
        }
        
        var levelRole = getLevelingLevel(sender)
        var role = 'Copper Ⅲ'
        if (levelRole <= 10) {
            role = 'Copper Ⅱ'
        } else if (levelRole <= 20) {
            role = 'Copper Ⅰ'
        } else if (levelRole <= 30) {
            role = 'Silver Ⅲ'
        } else if (levelRole < 40) {
            role = 'Silver Ⅱ'
        } else if (levelRole < 50) {
            role = 'Silver Ⅰ'
        } else if (levelRole < 60) {
            role = 'Gold Ⅲ'
        } else if (levelRole < 70) {
            role = 'Gold Ⅱ'
        } else if (levelRole < 80) {
            role = 'Gold Ⅰ'
        } else if (levelRole < 90) {
            role = 'Exterminator ★'
        } else if (levelRole < 100) {
            role = 'Master ★★★★★'
        }
        
        if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(https:\/\/chat.whatsapp.com)/gi)) {
                reply(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
                sock.groupRemove(from, [sender])
            }
        }

        if (isGroup && isAntiWame && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.match(/(wa.me\/)/gi)) {
                reply(`*「 NOMOR LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link nomor, maaf kamu akan di kick`)
                sock.groupRemove(from, [sender])
            }
        }
        
        if (isGroup && isViewOnce && isAntiVO && sock.mode !== 'self') {
            let typenya = msg.message.viewOnceMessage.message["videoMessage"] ? msg.message.viewOnceMessage.message.videoMessage : msg.message.viewOnceMessage.message.imageMessage
            typenya["viewOnce"] = false
            typenya["caption"] = `ANTI VIEWONCE\n\nCaption : ${(typenya.caption === '') ? 'NONE' : typenya.caption}`
            let peq = msg.message.viewOnceMessage.message["imageMessage"] ? { key: { fromMe: false, participant: sender, id: msg.key.id }, message: {"viewOnceMessage": {"message": { "imageMessage" : {"viewOnce": true } } } } } :  { key: { fromMe: false, participant: sender, id: msg.key.id }, message: {"viewOnceMessage": {"message": { "imageMessage" : {"viewOnce": true } } } } }
            let pe = await sock.prepareMessageFromContent(from, msg.message.viewOnceMessage.message, {quoted: peq})
            await sock.relayWAMessage(pe)
        }
        
        if (isGroup && isLevelingOn && isUser && sock.mode !== 'self' && !isMuted && !isGained(sender)) {
            const currentLevel = getLevelingLevel(sender)
            const checkId = getLevelingId(sender)
            try {
                addCooldown(sender)
                if (currentLevel === undefined && checkId === undefined) addLevelingId(sender)
                const amountXp = Math.floor(Math.random() * 10) + 150
                const requiredXp = 200 * (Math.pow(2, currentLevel) - 1)
                const getLevel = getLevelingLevel(sender)
                addLevelingXp(sender, amountXp)
                if (requiredXp <= getLevelingXp(sender)) {
                    addLevelingLevel(sender, 1)
                    await reply(`*「 LEVEL UP 」*\n\n❑ *Name*: @${sender.split('@')[0]}\n❑ *XP*: ${getLevelingXp(sender)}\n❑ *Level*: ${getLevel} -> ${getLevelingLevel(sender)}\n❑ *Role*: ${role} \n\nCongrats!! 🎉`)
                }
            } catch (err) {
                console.error(err)
            }
        }

        if (isGroup && isBadword && !isOwner && !isGroupAdmins && !fromMe){
            for (let kasar of badword){
                if (chats.toLowerCase().includes(kasar)){
                    if (isCountKasar(sender, senbadword)){
                        if (!isBotGroupAdmins) return reply(`Kamu beruntung karena bot bukan admin`)
                        reply(`*「 ANTI BADWORD 」*\n\nSepertinya kamu sudah berkata kasar lebih dari 5x, maaf kamu akan di kick`)
                        sock.groupRemove(from, [sender])
                        delCountKasar(sender, senbadword)
                    } else {
                        addCountKasar(sender, senbadword)
                        reply(`Kamu terdeteksi berkata kasar\nJangan ulangi lagi atau kamu akan dikick`)
                    }
                }
            }
        }
        
        if (isGroup && isBaileys) {
            if (mentioned.length >= groupMembers.length){
                if (!chats.match(/(@)/gi)) {
                    sock.sendMessage(from, `Terdeteksi @${sender.split('@')[0]} melakukan hidetag`, text, { quoted: msg, contextInfo: { mentionedJid: [sender] }})
                }
            }
        }
        
        if (isBan) return
        BannedExpired(sock, ban)
        
        if (isMuted){
            if (!isGroupAdmins && !isOwner) return
            if (chats.toLowerCase().startsWith(prefix+'unmute')){
                let anu = mute.indexOf(from)
                mute.splice(anu, 1)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot telah diunmute di group ini`)
            }
        }
        
        prem.expiredCheck(sock, premium)
        _sewa.expiredCheck(sock, sewa)
        
        if (time === "00:00:00") {
        	var reset = []
            _claim = reset
            limit = reset
            fs.writeFileSync('./database/claim.json', JSON.stringify(_claim))
            fs.writeFileSync('./database/limit.json', JSON.stringify(limit))
            sendMess("0@s.whatsapp.net", "Database telah di reset!")
        }
        
        if (isCmd && !isUser){
			pendaftar.push(sender)
			fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar))
        } 
        
        /*
		available = 'available', // "online"
        composing = 'composing', // "typing..."
        recording = 'recording', // "recording..."
        paused = 'paused' // stopped typing, back to "online"
        */
        await sock.updatePresence(from, Presence.available)
        
        if (isCmd && !isGroup && !isBaileys) {
            addBalance(sender, randomNomor(20), balance)
            sock.updatePresence(from, Presence.composing)
			console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
        }
        if (isCmd && isGroup && !isBaileys) {
            addBalance(sender, randomNomor(20), balance)
			console.log(color('[CMD]'), color(time, 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
        }

        if (isOwner){
        	if (chats.startsWith("=> ")) {
        	     function Return(sul) {
                        sat = JSON.stringify(sul, null, 2)
                        bang = util.format(sat)
                            if (sat == undefined) {
                                bang = util.format(sul)
                            }
                            return reply(bang)
                    }
                    try {
                        reply(util.format(eval(`(async () => { return ${chats.slice(3)} })()`)))
                    } catch (e) {
                        reply(String(e))
                    }
            } else if (chats.startsWith("> ")) {
                try {
                    let evaled = await eval(chats.slice(2))
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    reply(`${evaled}`)
                } catch (err) {
                    reply(`${err}`)
                }
            } else if (chats.startsWith("$ ")) {
                exec(chats.slice(2), (err, stdout) => {
					if (err) return reply(`${err}`)
					if (stdout) reply(`${stdout}`)
				})
            }
        }
        
        switch (command) {
        	
        	case 'help': 
            case 'menu': {
        	let groupChat = sock.chats.array.filter(v => v.jid.endsWith('g.us'))
            let privatChat = sock.chats.array.filter(v => v.jid.endsWith('s.whatsapp.net'))
        	let levelUser = getLevelingLevel(sender)
            let xpUser = getLevelingXp(sender)
            let reqXp  = 200 * (Math.pow(2, getLevelingLevel(sender)) - 1)
			let balUser = getBalance(sender, balance)
        	let sisalimit = getLimit(sender, limitCount, limit)
        	let exprem = `${ms(prem.getPremiumExpired(sender, premium) - Date.now()).days} days ${ms(prem.getPremiumExpired(sender, premium) - Date.now()).hours} hours ${ms(prem.getPremiumExpired(sender, premium) - Date.now()).minutes} minutes`
        	let txtmenu = `Hai @${sender.split('@')[0]}
${ucapan}

┌───────────
│     𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙩𝙞𝙤𝙣
├───────────
│
│𐌏 Name : ${pushname}
│𐌏 Number : ${sender.split('@')[0]}
│𐌏 Status : ${isOwner ? "Owner" : isPremium ? "Premium" : "Free User"}
│𐌏 Limit : ${isPremium ? 'Unlimited' : `${sisalimit}/${limitCount}`}
│𐌏 Balance : $${balUser}
│𐌏 Xp : ${xpUser} / ${reqXp}
│𐌏 Role : ${role}
│𐌏 Expired Premium : ${isOwner ? 'Unlimited' : isPremium ? exprem : 'Not Premium'}
│
├───────────${readmore}
│
│𐌏 Total Chat : ${allchat.length}
│𐌏 Private Chat : ${privatChat.length}
│𐌏 Group Chat : ${groupChat.length}
│
├───────────
│
│𐌏 Time : ${time}
│𐌏 Date : ${week} ${weton}, ${date}
│𐌏 Date Islamic : ${dateIslam}
│
├───────────
│
│𐌏 Lib : Baileys
│𐌏 Language : Javascript
│𐌏 Mode : ${sock.mode}
│𐌏 Prefix : ${multi ? "Multi Prefix" : nopref ? "No prefix" : prefa}
│𐌏 Runtime : ${kyun(process.uptime())}
│𐌏 User : ${pendaftar.length}
│
└───────────`
            let button = [
                    {buttonId: `${prefix}allmenu`, buttonText: {displayText: 'MENU'}, type: 1},
                    {buttonId: `${prefix}owner`, buttonText: {displayText: 'OWNER'}, type: 1},
                    {buttonId: `${prefix}script`, buttonText: {displayText: 'SCRIPT'}, type: 1}
            ]
            sendButDocument(from, txtmenu, 'Rzx Bot', imgrzx2, button, { contextInfo: { externalAdReply: { title: "Rzx Whatsapp Bot", body: "Created By RzxGamz", mediaType: "2", jpegThumbnail: imgrzx, mediaUrl: `https://instagram.com` }}})
            }
            break
            case 'allmenu': {
            	let levelUser = getLevelingLevel(sender)
                let xpUser = getLevelingXp(sender)
                let reqXp  = 200 * (Math.pow(2, getLevelingLevel(sender)) - 1)
			    let balUser = getBalance(sender, balance)
        	    let sisalimit = getLimit(sender, limitCount, limit)
            	let exprem = `${ms(prem.getPremiumExpired(sender, premium) - Date.now()).days} days ${ms(prem.getPremiumExpired(sender, premium) - Date.now()).hours} hours ${ms(prem.getPremiumExpired(sender, premium) - Date.now()).minutes} minutes`
            	let txtallmenu = `Hi ${pushname}
${ucapan}

*𐌏 Name : ${pushname}*
*𐌏 Number : ${sender.split('@')[0]}*
*𐌏 Status : ${isOwner ? "Owner" : isPremium ? "Premium" : "Free User"}*
*𐌏 Limit : ${isPremium ? 'Unlimited' : `${sisalimit}/${limitCount}`}*
*𐌏 Balance : $${balUser}*
*𐌏 Xp : ${xpUser} / ${reqXp}*
*𐌏 Role : ${role}*
*𐌏 Expired Premium : ${isOwner ? 'Unlimited' : isPremium ? exprem : 'Not Premium'}*

*═════════════════════*

*PREMIUM & SEWA*
⃝𐍂𐌶𐍇  •  ${prefix}upprem
⃝𐍂𐌶𐍇  •  ${prefix}sewabot

*OWNER*
⃝𐍂𐌶𐍇  •  ${prefix}public
⃝𐍂𐌶𐍇  •  ${prefix}self
⃝𐍂𐌶𐍇  •  ${prefix}setprefix *multi/nopref*
⃝𐍂𐌶𐍇  •  ${prefix}prem *add/del @tag 30d*
⃝𐍂𐌶𐍇  •  ${prefix}sewa *add/del @tag 30d*
⃝𐍂𐌶𐍇  •  ${prefix}ban *add/del @tag 30d*
⃝𐍂𐌶𐍇  •  ${prefix}reset

*BADWORD*
⃝𐍂𐌶𐍇  •  ${prefix}addbadword *text*
⃝𐍂𐌶𐍇  •  ${prefix}delbadword *text*
⃝𐍂𐌶𐍇  •  ${prefix}listbadword
⃝𐍂𐌶𐍇  •  ${prefix}clearbadword *@tag*

*PREMIUM*
⃝𐍂𐌶𐍇  •  ${prefix}cekprem
⃝𐍂𐌶𐍇  •  ${prefix}ceksewa
⃝𐍂𐌶𐍇  •  ${prefix}listprem
⃝𐍂𐌶𐍇  •  ${prefix}listsewa
⃝𐍂𐌶𐍇  •  ${prefix}listban

*LIMIT*
⃝𐍂𐌶𐍇  •  ${prefix}limit
⃝𐍂𐌶𐍇  •  ${prefix}level
⃝𐍂𐌶𐍇  •  ${prefix}buylimit *5*

*DOWNLOADER*
⃝𐍂𐌶𐍇  •  ${prefix}tiktok *link*
⃝𐍂𐌶𐍇  •  ${prefix}play *query*
⃝𐍂𐌶𐍇  •  ${prefix}ytmp4 *link*
⃝𐍂𐌶𐍇  •  ${prefix}ytmp3 *link*

*DATABASE*
⃝𐍂𐌶𐍇  •  ${prefix}mute *enable/disable*
⃝𐍂𐌶𐍇  •  ${prefix}nsfw *enable/disable*
⃝𐍂𐌶𐍇  •  ${prefix}leveling *enable/disable*
⃝𐍂𐌶𐍇  •  ${prefix}antilink *enable/disable*
⃝𐍂𐌶𐍇  •  ${prefix}antiwame *enable/disable*
⃝𐍂𐌶𐍇  •  ${prefix}antibadword *enable/disable*
⃝𐍂𐌶𐍇  •  ${prefix}antiviewonce *enable/disable*

*─────────────────────*

*✆ Github : https://github.com/RzxGamz*
*✆ Instagram : https://instagram.com/rzxgamz*
*✆ WhatsApp : https://api.whatsapp.com/send?phone=6288225066473
*✆ Gmail : rzxgamzofc@gmail.com*

*─────────────────────*`
            sendProduct(from, "𝙍𝙕𝙓 𝙒𝙃𝘼𝙏𝙎𝘼𝙋𝙋 𝘽𝙊𝙏", txtallmenu, { quoted: fakewa })
            }
            break
            
            case 'setprefix':
            if (!isOwner) return reply(mess.owner)
            if (args.length < 2) return reply(`Masukkan prefix\nOptions :\n=> multi\n=> nopref`)
            if (q === 'multi'){
                    multi = true
                    nopref = false
                    reply(`Berhasil mengubah prefix ke ${q}`)
            } else if (q === 'nopref'){
                    multi = false
                    nopref = true
                    reply(`Berhasil mengubah prefix ke ${q}`)
            } else {
                    multi = false
                    nopref = false
                    prefa = `${q}`
                    reply(`Berhasil mengubah prefix ke ${q}`)
            }
            break
            case 'public': 
            sock.mode = 'public'
            reply("Sukses change to public mode")
            break
            case 'self': 
        	sock.mode = 'self'
            reply("Sukses change to self mode")
            break
            
            case 'limit': 
            case 'ceklimit': 
            case 'balance':
            case 'uangku': 
            if (mentioned.length !== 0){
                 reply(`Limit : ${prem.checkPremiumUser(mentioned[0], premium) ? 'Unlimited' : `${getLimit(mentioned[0], limitCount, limit)}/${limitCount}`}\nBalance : $${getBalance(mentioned[0], balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit`)
            } else {
                 reply(`Limit : ${isPremium ? 'Unlimited' : `${getLimit(sender, limitCount, limit)}/${limitCount}`}\nBalance : ${getBalance(sender, balance)}\n\nKamu dapat membeli limit dengan ${prefix}buylimit`)
            }
            break
            case 'reset': {
            if (!isOwner) return reply(mess.owner)
            var reset = []
            _claim = reset
            limit = reset
            console.log('Hang tight, it\'s time to reset')
            fs.writeFileSync('./database/claim.json', JSON.stringify(_claim))
            fs.writeFileSync('./database/limit.json', JSON.stringify(limit))
            reply("Sukses mereset database")
            }
            break
            
            case 'premium':
            case 'prem':
            if (!isOwner) return reply(mess.owner)
            if (args.length < 2) return reply(`Penggunaan :\n*${prefix}premium* add/del @tag waktu\natau *${prefix}premium* add/del nomor waktu`)
            if (args[1].toLowerCase() === 'add'){
            if (mentioned.length !== 0){
                for (let i = 0; i < mentioned.length; i++) {
                    prem.addPremiumUser(mentioned[0], args[3], premium)
                    }
                    let timez = ms(toMS(args[3]))
                    sendMess(mentioned[0], `Anda telah ditambahkan oleh owner sebagai salah satu user premium bot, Sisa aktif premium anda adalah ${timez.days} day(s) ${timez.hours} hour(s) ${timez.minutes} minute(s)`)
                    reply('Sukses')
                } else {
                    prem.addPremiumUser(args[2] + '@s.whatsapp.net', args[3], premium)
                    let timez = ms(toMS(args[3]))
                    sendMess(args[2] + '@s.whatsapp.net', `Anda telah ditambahkan oleh owner sebagai salah satu user premium bot, Sisa aktif premium anda adalah ${timez.days} day(s) ${timez.hours} hour(s) ${timez.minutes} minute(s)`)
                    reply('Sukses')
                }
                } else if (args[1].toLowerCase() === 'del'){
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        premium.splice(prem.getPremiumPosition(mentioned[i], premium), 1)
                        fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                        sendMess(mentioned[i], `Anda telah dihapus dari daftar premium oleh owner, merasa Hal ini janggal? silahkan Chat owner`)
                    }
                    reply('Sukses')
                } else {
                    premium.splice(prem.getPremiumPosition(args[2] + '@s.whatsapp.net', premium), 1)
                    fs.writeFileSync('./database/premium.json', JSON.stringify(premium))
                        sendMess(args[2] + '@s.whatsapp.net', `Anda telah dihapus dari daftar premium oleh owner, merasa Hal ini janggal? silahkan Chat owner`)
                }
                } else {
                reply(`Penggunaan :\n*${prefix}premium* add/del @tag waktu\natau *${prefix}premium* add/del nomor waktu`)
            }
            break
            case 'premiumcheck':
            case 'cekpremium':
            case 'cekprem':
            if (!isPremium) return reply(`Kamu bukan user premium, kirim perintah *${prefix}uptopremium* untuk membeli premium`)
            let cekvip = ms(prem.getPremiumExpired(sender, premium) - Date.now())
            let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
            reply(premiumnya)
            break
            case 'uptopremium':
            case 'uppremium':
            case 'upprem':
            replyAd(`Hai ${pushname}\nBerikut adalah list premium dari bot kami\n\n• Premium 10 Hari => Rp 5.000\n• Premium 30 Hari => Rp 10.000\n• Premium Permanent => Rp 20.000\n\nJika anda berminat untuk membeli premium silahkan chat owner!`, "Upgrade To Premium", "Rzx Bot")
            break
            case 'sewabot': 
            replyAd(`Hai ${pushname}\nBerikut adalah list Sewa dari bot kami\n\n• Sewa Bot 10 Hari => Rp 2.500\n• Sewa Bot 30 Hari => Rp 5.000\n• Sewa Bot Permanent => Rp 15.000\n\n*Note : Jika bot tidak merespon berarti error / off, Bot ini dapat offline kapanpun, Jika bot offline bisa karena masalah jaringan atau baterai habis, Jadi itulah kekurangan bot kami mohon di maklumi*\nJika anda berminat untuk menyewa bot silahkan chat owner!`, "List Sewa Bot", "Rzx Bot")
            break
            case 'sewacheck':
            case 'ceksewa': {
            if (!isGroup)return reply(mess.group)
            if (!isSewa) return reply(`Group ini tidak terdaftar dalam list sewabot. Ketik ${prefix}sewabot untuk info lebih lanjut`)
            let cekvip = ms(_sewa.getSewaExpired(from, sewa) - Date.now())
            let premiumnya = `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s)`
            reply(premiumnya)
            }
            break
            case 'sewa':
            if (!isGroup)return reply(mess.group)
            if (!isOwner) return reply(mess.owner)
            if (args.length < 2) return reply(`Penggunaan :\n*${prefix}sewa* add/del waktu`)
            if (args[1].toLowerCase() === 'add'){
            _sewa.addSewaGroup(from, args[2], sewa)
            reply(`Success`)
            } else if (args[1].toLowerCase() === 'del'){
            sewa.splice(_sewa.getSewaPosition(from, sewa), 1)
            fs.writeFileSync('./database/sewa.json', JSON.stringify(sewa))
            } else {
            reply(`Penggunaan :\n*${prefix}sewa* add/del waktu`)
            }
            break
            
            case 'listprem':
            case 'premiumlist': {
            let txt = `List User Premium\nJumlah : ${premium.length}\n\n`
            let men = [];
                for (let i of premium){
                    men.push(i.id)
                    let cekvip = ms(i.expired - Date.now())
                    txt += `*ID :* @${i.id.split("@")[0]}\n*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                }
                mentions(txt, men, true)
            }
            break
            case 'sewalist': 
            case 'listsewa':
            let txt = `List Sewa\nJumlah : ${sewa.length}\n\n`
                for (let i of sewa){
                    let cekvipp = ms(i.expired - Date.now())
                    txt += `*ID :* ${i.id} \n*Expire :* ${cekvipp.days} day(s) ${cekvipp.hours} hour(s) ${cekvipp.minutes} minute(s) ${cekvipp.seconds} second(s)\n\n`
                }
            reply(txt)
            break

            case 'ban':
            if (!isOwner) return reply(mess.owner)
            if (args[1].toLowerCase() === 'add'){
            if (mentioned.length !== 0){
                 for (let i = 0; i < mentioned.length; i++){
                     addBanned(mentioned[0], args[3], ban)
                 }
                 reply('Sukses')
                } else if (isQuotedMsg) {
                    if (quotedMsg.sender === ownerNumber[0]) return reply(`Tidak bisa ban Owner`)
                    addBanned(quotedMsg.sender, args[2], ban)
                    reply(`Sukses ban target`)
                } else if (!isNaN(args[2])) {
                    addBanned(args[2] + '@s.whatsapp.net', args[3], ban)
                    reply('Sukses')
                 }
                } else if (args[1].toLowerCase() === 'del'){
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                        unBanned(mentioned[i], ban)
                    }
                    reply('Sukses')
                }if (isQuotedMsg) {
                    unBanned(quotedMsg.sender, ban)
                    reply(`Sukses unban target`) 
                } else if (!isNaN(args[2])) {
                    unBanned(args[2] + '@s.whatsapp.net', ban)
                    reply('Sukses')
                }
                } else {
               reply(`Kirim perintah ${prefix}ban add/del (@tag atau nomor atau reply pesan orang yang ingin di ban) masa_ban`)
            }
            break
            case 'listblock':
            case 'listban':
            let txtx = `List Banned\nJumlah : ${ban.length}\n\n`
            let menx = [];
                for (let i of ban){
                    menx.push(i.id)
                    txtx += `*ID :* @${i.id.split("@")[0]}\n`
                    if (i.expired === 'PERMANENT'){
                        let cekvip = 'PERMANENT'
                        txtx += `*Expire :* PERMANENT\n\n`
                    } else {
                        let cekvip = ms(i.expired - Date.now())
                        txtx += `*Expire :* ${cekvip.days} day(s) ${cekvip.hours} hour(s) ${cekvip.minutes} minute(s) ${cekvip.seconds} second(s)\n\n`
                    }
                 }
                mentions(txtx, menx, true)
            break
            case 'unblock':
            if (!isOwner) return reply(mess.owner)
            if (args.length < 2) return reply(`Kirim perintah *${command} nomer`)
            await sock.blockUser(args[1] + '@s.whatsapp.net', "remove")
            break
                
            case 'topglobal': case 'toplocal': case 'lb': case 'leaderboard': {
            if (isGroup && !isLevelingOn) return reply(`Fitur leveling belum di aktifkan!`)
                let top = '*「 LEADERBOARD LEVEL 」*\n\n'
                let arrTop = []
                     var nom = 0
                     _level.sort((a, b) => (a.xp < b.xp) ? 1 : -1)
                    for (let i = 0; i < 10; i++) {
                        var roless = 'Copper  Ⅲ'
                        if (_level[i].level <= 10) {
                            roless = 'Copper Ⅱ'
                        } else if (_level[i].level <= 20) {
                            roless = 'Copper Ⅰ'
                        } else if (_level[i].level <= 30) {
                            roless = 'Silver Ⅲ'
                       } else if (_level[i].level < 40) {
                            roless = 'Silver Ⅱ'
                       } else if (_level[i].level < 50) {
                            roless = 'Silver Ⅰ'
                       } else if (_level[i].level < 60) {
                            roless = 'Gold Ⅲ'
                      } else if (_level[i].level < 70) {
                            roless = 'Gold Ⅱ'
                      } else if (_level[i].level < 80) {
                            roless = 'Gold Ⅰ'
                      } else if (_level[i].level < 90) {
                            roless = 'Exterminator ★'
                      } else if (_level[i].level < 100) {
                            roless = 'Master ★★★★★'
                      }
                     arrTop.push(_level[i].jid)
                        nom++
                        top += `◪ *${nom}. @${_level[i].jid.replace('@s.whatsapp.net', '')}*\n├❑ *XP: ${_level[i].xp}*\n├❑ *Level: ${_level[i].level}*\n└❑ *Role: ${roless}*\n\n`
                    }
                       let topp = '*「 TOPGLOBAL BALANCE 」*\n\n'
                   balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                for (let i = 0; i < 10; i ++){
                    topp += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                    arrTop.push(balance[i].id)
                }
                balance.sort((a, b) => (a.balance < b.balance) ? 1 : -1)
                let toppp = '*「 TOPLOCAL BALANCE 」*\n\n'
                let anggroup = groupMembers.map(a => a.jid)
                for (let i = 0; i < balance.length; i ++){
                    if (anggroup.includes(balance[i].id)) {
                        toppp += `${i + 1}. @${balance[i].id.split("@")[0]}\n=> Balance : $${balance[i].balance}\n\n`
                        arrTop.push(balance[i].id)
                    }
                }
                mentions(top + '\n\n' + readmore + topp + '\n\n' + readmore + toppp, arrTop, true)
            }
            break
            case 'level':
            case 'xp': {
            if (isGroup && !isLevelingOn) return reply(`Fitur leveling belum di aktifkan!`)
            try {
               var pic = await sock.getProfilePicture(sender)
            } catch {
               var pic = 'https://i.ibb.co/Tq7d7TZ/age-hananta-495-photo.png'
            }
            var tolink = await fetchText('https://tinyurl.com/api-create.php?url=' + pic)
            const userLevel = getLevelingLevel(sender)
            const userXp = getLevelingXp(sender)
            const requiredXp = 200 * (Math.pow(2, getLevelingLevel(sender)) - 1)
            var link = `https://api.lolhuman.xyz/api/rank?apikey=${lolkey}&img=${tolink}&background=${bgbot}&username=${encodeURIComponent(pushname)}&level=${userLevel}&ranking=${role}&currxp=${userXp}&xpneed=${requiredXp}`
            const levelnya = `*「 LEVEL INFO 」*\n\n❑ *Name: @${sender.split('@')[0]}*\n❑ *XP: ${userXp} / ${requiredXp}*\n❑ *Level: ${userLevel}*\n❑ *Role: ${role}*`
            sock.sendImage(from, await getBuffer(pic), levelnya, msg, [sender])
            }
            break
            case 'buylimit': {
            if (args.length < 2) return reply(`Kirim perintah *${prefix}buylimit* jumlah limit yang ingin dibeli\n\nHarga 1 limit = $25 balance`)
            if (args[1].includes('-')) return reply(`Jangan menggunakan -`)
            if (isNaN(args[1])) return reply(`Harus berupa angka`)
            let ane = Number(nebal(args[1]) * 25)
            if (getBalance(sender, balance) < ane) return reply(`Balance kamu tidak mencukupi untuk pembelian ini`)
            kurangBalance(sender, ane, balance)
            giveLimit(sender, nebal(args[1]), limit)
            reply(`Pembeliaan limit sebanyak ${args[1]} berhasil\n\nSisa Balance : $${getBalance(sender, balance)}\nSisa Limit : ${getLimit(sender, limitCount, limit)}/${limitCount}`)
            }
            break
            case 'claim':
            case 'klaim':
            if (isClaimOn) return reply(`Kamu sudah mengclaim hari ini!\nKamu bisa claim lagi setelah jam 00:00 WIB`)
            addLevelingXp(sender, 10000)
            let hadippp = randomNomor(1000)
            addBalance(sender, hadippp, balance)
            _claim.push(sender)
            fs.writeFileSync('./database/claim.json', JSON.stringify(_claim))
            reply(`Anda telah mendapatkan 10000 Xp dan $${hadippp} Balance dari Claim hari ini`)
            break
            
            case 'tiktok':
            case 'tiktokdl':
            case 'tiktoknowm': {
            	if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
            	if (!q) return reply(`Masukkan link tiktok!`)
                if (!isUrl(q) && !q.includes('tiktok.com')) return reply(`Link invalid!`)
                reply(mess.wait)
            	let res = await ttdownloader(q)
                sock.sendMessage(from, { url: res.nowm }, video, { quoted: msg, mimetype: 'video/mp4', thumbnail: imgrzx })
                limitAdd(sender, limit)
            }
            break
            case 'play':
            case 'video': 
            case 'ytplay': {
            	if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!q) return reply(`Example : ${prefix + command} dj terbaru`)
                reply(mess.wait)
                let yts = require("yt-search")
                let search = await yts(q)
                let anu = search.videos[Math.floor(Math.random() * search.videos.length)]
                let buttons = [
                    {buttonId: `.ytmp3 ${anu.url}`, buttonText: {displayText: 'AUDIO'}, type: 1},
                    {buttonId: `.ytmp4 ${anu.url}`, buttonText: {displayText: 'VIDEO'}, type: 1}
                ]
                let buff = await getBuffer(anu.thumbnail)
                let buttonMessage = {
                    locationMessage: { degreesLatitude: "", degreesLongitude: "", jpegThumbnail: buff },
                    contentText: `• Title : ${anu.title}\n• Ext : Search\n• ID : ${anu.videoId}\n• Duration : ${anu.timestamp}\n• Viewers : ${anu.views}\n• Upload At : ${anu.ago}\n• Author : ${anu.author.name}\n• Channel : ${anu.author.url}\n• Description : ${anu.description}\n• Url : ${anu.url}`,
                    footerText: "Youtube Play",
                    buttons: buttons,
                    headerType: "LOCATION"
                }
                sock.sendMessage(from, buttonMessage, MessageType.buttonsMessage, { quoted: msg })
                limitAdd(sender, limit)
            }
            break
	        case 'ytmp3': 
            case 'ytaudio':
            case 'yta': {
                let { yta } = require('./lib/y2mate')
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!q) return reply(`Example : ${prefix + command} https://youtube.com/watch?v=PtFMh6Tccag%27 128kbps`)
                let isLinkYt = q.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinkYt) return reply(`Link invalid!`)
                reply(mess.wait)
                let quality = args[1] ? args[1] : '128kbps'
                let media = await yta(q, quality)
                if (media.filesize >= 50000) return reply('File Melebihi Batas\nSilahkan download sendiri '+util.format(media))
                sock.sendImage(from, getBuffer(media.thumb), `• Title : ${media.title}\n• File Size : ${media.filesizeF}\n• Url : ${isUrl(text)}\n• Ext : MP3\n• Resolusi : ${args[1] || '128kbps'}`, msg)
                sock.sendMessage(from, { url: media.dl_link }, audio, { quoted: msg, mimetype: Mimetype.mp4Audio })
                limitAdd(sender, limit)
            }
            break
            case 'ytmp4':
            case 'ytvideo': 
            case 'ytv': 
            case 'ytshort': {
                let { ytv } = require('./lib/y2mate')
                if (isLimit(sender, isPremium, isOwner, limitCount, limit)) return reply(`Limit kamu sudah habis silahkan kirim ${prefix}limit untuk mengecek limit`)
                if (!q) return reply(`Example : ${prefix + command} https://youtube.com/watch?v=PtFMh6Tccag%27 360p`)
                let isLinksYt= q.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)
                if (!isLinksYt) return reply(`Link invalid!`)
                reply(mess.wait)
                let quality = args[1] ? args[1] : '360p'
                let media = await ytv(q, quality)
                if (media.filesize >= 50000) return reply('File Melebihi Batas\nSilahkan download sendiri '+util.format(media))
                sock.sendMessage(from, { url: media.dl_link }, video, { quoted: msg, caption: `• Title : ${media.title}\n• File Size : ${media.filesizeF}\n• Url : ${isUrl(text)}\n• Ext : MP3\n• Resolusi : ${args[1] || '360p'}` })
                limitAdd(sender, limit)
            }
            break
            
            case 'antibadword':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (!isBotGroupAdmins) return reply(mess.badmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isBadword) return reply(`Udah aktif`)
                    grupbadword.push(from)
					fs.writeFileSync('./database/grupbadword.json', JSON.stringify(grupbadword))
					reply(`antibadword grup aktif, kirim ${prefix}listbadword untuk melihat list badword`)
                } else if (args[1].toLowerCase() === 'disable'){
                    anu = grupbadword.indexOf(from)
                    grupbadword.splice(anu, 1)
                    fs.writeFileSync('./database/grupbadword.json', JSON.stringify(grupbadword))
                    reply('antibadword grup nonaktif')
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
                break
            case 'listbadword':
                let bi = `List badword\n\n`
                for (let boo of badword){
                    bi += `- ${boo}\n`
                }
                bi += `\nTotal : ${badword.length}`
                reply(bi)
                break
            case 'addbadword':
                if (!isOwner) return reply(mess.owner)
                if (args.length < 2) return reply(`masukkan kata`)
                if (isKasar(args[1].toLowerCase(), badword)) return reply(`Udah ada`)
                addBadword(args[1].toLowerCase(), badword)
                reply(`Sukses`)
                break
            case 'delbadword':
                if (!isOwner) return reply(mess.owner)
                if (args.length < 2) return reply(`masukkan kata`)
                if (!isKasar(args[1].toLowerCase(), badword)) return reply(`Ga ada`)
                delBadword(args[1].toLowerCase(), badword)
                reply(`Sukses`)
                break
            case 'clearbadword':
                if (!isOwner) return reply(mess.owner)
                if (args.length < 2) return reply(`tag atau nomor`)
                if (mentioned.length !== 0){
                    for (let i = 0; i < mentioned.length; i++){
                    delCountKasar(mentioned[i], senbadword)
                    }
                    reply('Sukses')
                } else {
                    delCountKasar(args[1] + '@s.whatsapp.net', senbadword)
                    reply('Sukses')
                }
                break
            case 'mute':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                if (isMuted) return reply(`udah mute`)
                mute.push(from)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot berhasil dimute di chat ini`)
                } else if (args[1].toLowerCase() === 'disable'){
                let anu = mute.indexOf(from)
                mute.splice(anu, 1)
                fs.writeFileSync('./database/mute.json', JSON.stringify(mute))
                reply(`Bot telah diunmute di group ini`)
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
                break
            case 'antilink':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (!isBotGroupAdmins) return reply(mess.badmin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isAntiLink) return reply(`Udah aktif`)
                    antilink.push(from)
					fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
					reply('Antilink grup aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antilink.indexOf(from)
                    antilink.splice(anu, 1)
                    fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink))
                    reply('Antilink grup nonaktif')
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
                break
            case 'antiviewonce': case 'antivo':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isAntiVO) return reply(`Udah aktif`)
                    antiviewonce.push(from)
					fs.writeFileSync('./database/antiviewonce.json', JSON.stringify(antiviewonce))
					reply('Antiview Once grup aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antiviewonce.indexOf(from)
                    antiviewonce.splice(anu, 1)
                    fs.writeFileSync('./database/antiviewonce.json', JSON.stringify(antiviewonce))
                    reply('antiviewonce grup nonaktif')
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
                break
            case 'antiwame':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isAntiWame) return reply(`Udah aktif`)
                    antiwame.push(from)
					fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
					reply('antiwame aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = antiwame.indexOf(from)
                    antiwame.splice(anu, 1)
                    fs.writeFileSync('./database/antiwame.json', JSON.stringify(antiwame))
                    reply('antiwame nonaktif')
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
            break
            case 'nsfw':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isNsfw) return reply(`Udah aktif`)
                    nsfw.push(from)
					fs.writeFileSync('./database/nsfw.json', JSON.stringify(nsfw))
					reply('nsfw aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = nsfw.indexOf(from)
                    nsfw.splice(anu, 1)
                    fs.writeFileSync('./database/nsfw.json', JSON.stringify(nsfw))
                    reply('nsfw nonaktif')
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
                break
            case 'leveling':
                if (!isGroup) return reply(mess.group)
                if (!isGroupAdmins && !isOwner) return reply(mess.admin)
                if (args.length === 1) return reply(`Pilih enable atau disable`)
                if (args[1].toLowerCase() === 'enable'){
                    if (isLevelingOn) return reply(`Udah aktif`)
                    _leveling.push(from)
					fs.writeFileSync('./database/leveling.json', JSON.stringify(_leveling))
					reply('leveling aktif')
                } else if (args[1].toLowerCase() === 'disable'){
                    let anu = _leveling.indexOf(from)
                    _leveling.splice(anu, 1)
                    fs.writeFileSync('./database/leveling.json', JSON.stringify(_leveling))
                    reply('levelinh nonaktif')
                } else {
                    reply(`*Silahkan ketik ${prefix}enable*`)
                }
                break
                
                
            
            
        }
        } catch (e) {
        	console.log(String(e));
        }
        }









