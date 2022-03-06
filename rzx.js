"use strict";
const {
    WAConnection,
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
const funct = require('./lib/funct.js');
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
const WSF = require('wa-sticker-formatter')

const Exif = require('./lib/exif')
const exif = new Exif()

const { color, bgcolor } = require("./lib/color");
const { jsonformat, isUrl, randomNomor, sleep, fetchJson, fetchText, getBuffer, getRandom, getGroupAdmins, runtime } = require("./lib/funct");
const { isLimit, limitAdd, getLimit, giveLimit, addBalance, kurangBalance, getBalance, isGame, gameAdd, givegame, cekGLimit } = require("./lib/limit");
const { addBanned, unBanned, BannedExpired, cekBannedUser } = require("./lib/banned");
const { addCmd, getCmd, getCommandPosition } = require("./lib/commands")
const { addBadword, delBadword, isKasar, addCountKasar, isCountKasar, delCountKasar } = require("./lib/badword");
const prem = require("./lib/premium");
const _sewa = require("./lib/sewa");
const afk = require("./lib/afk");
const { yta, ytv } = require("./lib/ytdl");
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

module.exports = async (sock, mek) => {
	try {
		msg = await funct.serialize(sock, mek);
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
        const tanggal = moment.tz('Asia/Jakarta').format('||')
        const time = moment.tz('Asia/Jakarta').format('HH:mm:ss')
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
        const isAntiVO = isGroup ? antiviewonce.includes(from) : false
        const isWelcome = isGroup ? welcome.includes(from) : false
        const isAutoSticker = isGroup ? autosticker.includes(from) : false
        const isNsfw = isGroup ? nsfw.includes(from) : false
        const isBadword = isGroup ? grupbadword.includes(from) : false
        const isMuted = isGroup ? mute.includes(from) : false
        const isLevelingOn = isGroup ? _leveling.includes(from) : false
        const isUser = pendaftar.includes(sender)
        
        var countDownDate = new Date("April, 03, 2022 04:15:00").getTime();
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
        const sendMess = (hehe, teks) => {
            return sock.sendMessage(hehe, teks, text)
        }
        const mentions = (teks, memberr, id) => {
            let ai = (id == null || id == undefined || id == false) ? sock.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : sock.sendMessage(from, teks.trim(), extendedText, {quoted: msg, contextInfo: {"mentionedJid": memberr}})
            return ai
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
        
        if (sock.mode === 'self') {
        	if (!isOwner && !fromMe) return
        }
        
        var levelRole = getLevelingLevel(sender)
        var role = 'Copper 3'
        if (levelRole <= 10) {
            role = 'Copper 2'
        } else if (levelRole <= 20) {
            role = 'Copper 1'
        } else if (levelRole <= 30) {
            role = 'Silver 3'
        } else if (levelRole < 40) {
            role = 'Silver 2'
        } else if (levelRole < 50) {
            role = 'Silver 1'
        } else if (levelRole < 60) {
            role = 'Gold 3'
        } else if (levelRole < 70) {
            role = 'Gold 2'
        } else if (levelRole < 80) {
            role = 'Gold 1'
        } else if (levelRole < 90) {
            role = 'Exterminator'
        } else if (levelRole < 100) {
            role = 'Master'
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
                    mentions(`Terdeteksi @${sender.split('@')[0]} melakukan hidetag`, [sender], false)
                }
            }
        }
        
        if (isBan) return
        BannedExpired(ban)
        
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
        
        if (isCmd && !isUser){
			pendaftar.push(sender)
			fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar))
        } 
        
        if (isCmd && !isGroup && !isBaileys) {
            addBalance(sender, randomNomor(20), balance)
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
        	
        	case 'help': {
        	txtmenu = `Hai @${sender.split('@')[0]}
${ucapan}

❑ Name : ${pushname}
❑ Number : ${sender.split('@')[0]}

`
            sock.sendMessage(from, txtmenu, text)
            }
            break
            
            
        }
        } catch (e) {
        	console.log(String(e));
        }
        }









