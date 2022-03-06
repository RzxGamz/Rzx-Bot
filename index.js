"use strict";
const { WAConnection, MessageType } = require('@adiwajshing/baileys');
const funct = require('./lib/funct.js');
const moment = require("moment-timezone");
const fs = require('fs');
const cfonts = require('cfonts');
const { exec } = require('child_process');
const { color, bgcolor } = require('./lib/color');
const sock = new WAConnection();
const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss');

require('./rzx.js');
nocache('./rzx.js', module => console.log(`${module} is now updated!`));

async function starts () {
	sock.logger.level = 'warn';
    sock.version = [2, 2142, 12];
    sock.browserDescription = [ 'RzxGamz', 'EDGE', '3.0' ];
    console.log(color("Start running Rzx bot...", "blue"));
    cfonts.say('Rzx Bot', {
        colors: ['#f2aa4c'],
        font: 'block',
        align: 'center',
    });
    
    sock.mode = 'self'
    
    sock.on('qr', () => {
        console.log(color('[','white'), color('!','red'), color(']','white'), color(' SCAN THIS QR CODE!'))
    });
    
    fs.existsSync('./session.json') && sock.loadAuthInfo('./session.json');
    
    sock.on('connecting', () => {
        console.log('Connecting...');
    });
    
    sock.on('open', () => {
        console.log('Connected');
    });
    
    sock.on('close', () => {
    	console.log('Closed connection');
    });
    
    await sock.connect({timeoutMs: 30*1000});
        fs.writeFileSync('./session.json', JSON.stringify(sock.base64EncodedAuthInfo(), null, '\t'));
    
    sock.on('chat-update', async (mek) => {
    	if (!mek.hasNewMessage) return;
        mek = mek.messages.all()[0];
		if (!mek.message) return;
		mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
		if (mek.key && mek.key.remoteJid == 'status@broadcast') return;
		msg = await funct.serialize(sock, mek);
        require('./rzx.js')(sock, msg);
    });
    
    sock.on('group-participants-update', async (anu) => {
    	console.log(anu);
        mem = anu.participants[0];
		const mdata = await sock.groupMetadata(anu.jid);
		const member = mdata.participants;
		try {
		ppuser = await sock.getProfilePicture(mem)
		} catch {
		ppuser = 'https://i.ibb.co/0qDXtBb/c8ef383d9fa8.jpg'
		}
        if (anu.action == 'add') {
        	if (anu.participants[0] === sock.user.jid) {
        	sock.sendMessage(mdata.id, { contentText: `Hai semua, Saya Rzx Bot\n\nAnda dapat menggunakan fitur yang tertera dalam command dari bot ini\nKetik */menu* untuk menampilkan list command / ketuk tombol di bawah`, footerText: `@Rzxbot`, buttons: [{buttonId: "/menu", buttonText: { displayText: "ᴍᴇɴᴜ" }, type: "RESPONSE"}], headerType: "EMPTY" }, MessageType.buttonsMessage)
            }
        	textwel = `Selamat datang @${mem.split("@")[0]}`
            sock.sendMessage(anu.jid, textwel, MessageType.text, { contextInfo: { externalAdReply: { title: "Welcome Message", body: `${member.length} Members`, previewType: "PHOTO", sourceUrl: `` }, mentionedJid: [mem] }})
        } else if (anu.action == 'remove') {
        	textlev = `Selamat tinggal @${mem.split("@")[0]}`
            sock.sendMessage(anu.jid, textlev, MessageType.text, { contextInfo: { externalAdReply: { title: "Leave Message", body: `${member.length} Members`, previewType: "PHOTO", sourceUrl: `` }, mentionedJid: [mem] }})
        } else if (anu.action == 'promote') {
        	textpro = `@${mem.split("@")[0]} anda sekarang admin!`
            sock.sendMessage(anu.jid, textpro, MessageType.text, { contextInfo: { externalAdReply: { title: "Promote Message", body: `Rzxbot`, previewType: "PHOTO", sourceUrl: `` }, mentionedJid: [mem] }})
        } else if (anu.action == 'demote') {
        	textdem = `@${mem.split("@")[0]} anda bukan admin lagi!`
            sock.sendMessage(anu.jid, textdem, MessageType.text, { contextInfo: { externalAdReply: { title: "Demote Message", body: `Rzxbot`, previewType: "PHOTO", sourceUrl: `` }, mentionedJid: [mem] }})
        }
    });
    
    sock.on('group-update', async (anu) => {
    	console.log(anu);
		const metdata = await sock.groupMetadata(anu.jid);
        if(anu.announce == 'false'){
        teks = `*「 GROUP OPENED 」*\n\n_Group telah dibuka oleh admin_\n_Sekarang semua member bisa mengirim pesan_`
        sock.sendMessage(metdata.id, teks, MessageType.text, { contextInfo: { externalAdReply: { title: "Event Group Update", body: `</Rzc >`, previewType: "PHOTO", sourceUrl: `` }}})
  }
        else if(anu.announce == 'true'){
        teks = `*「 GROUP CLOSED 」*\n\n_Group telah ditutup oleh admin_\n_Sekarang hanya admin yang dapat mengirim pesan_`
        sock.sendMessage(metdata.id, teks, MessageType.text, { contextInfo: { externalAdReply: { title: "Event Group Update", body: `</Rzc >`, previewType: "PHOTO", sourceUrl: `` }}})
  }
        else if(!anu.desc == ''){
        tag = anu.descOwner.split('@')[0] + '@s.whatsapp.net'
        teks = `*「 GROUP DESC CHANGE 」*\n\nDeskripsi Group telah diubah oleh Admin @${anu.descOwner.split('@')[0]}\n• Deskripsi Baru : ${anu.desc}`
        sock.sendMessage(metdata.id, teks, MessageType.text, { contextInfo: { externalAdReply: { title: "Event Group Update", body: `</Rzc >`, previewType: "PHOTO", sourceUrl: `` }, mentionedJid: [tag] }})
  }
        else if(anu.restrict == 'false'){
        teks = `*「 GROUP SETTING CHANGE 」*\n\nEdit Group info telah dibuka untuk member\nSekarang semua member dapat mengedit info Group Ini`
        sock.sendMessage(metdata.id, teks, MessageType.text, { contextInfo: { externalAdReply: { title: "Event Group Update", body: `</Rzc >`, previewType: "PHOTO", sourceUrl: `` }}})
  }
        else if(anu.restrict == 'true'){
        teks = `*「 GROUP SETTING CHANGE 」*\n\nEdit Group info telah ditutup untuk member\nSekarang hanya admin group yang dapat mengedit info Group Ini`
        sock.sendMessage(metdata.id, teks, MessageType.text, { contextInfo: { externalAdReply: { title: "Event Group Update", body: `</Rzc >`, previewType: "PHOTO", sourceUrl: `` }}})
  }
});

    sock.on('CB:action,,call', async json => {
        const callerId = json[2][0][1].from;
        await sock.blockUser(callerId, "add");
     });

}

/**
 * Uncache if there is file change
 * @param {string} module Module name or path
 * @param {function} cb <optional> 
 */
function nocache(module, cb = () => { }) {
    console.log('Module', `'${module}'`, 'is now being watched for changes')
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    });
}

/**
 * Uncache a module
 * @param {string} module Module name or path
 */
function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    });
}

starts();