let emotes = [];
let spamMessages = [];

const combo = {
	emote: null,
	oldEmote: null,
	count: 0,
	elt: null,
	timeout: null
};

const donations = [];

(async function() {
	await loadEmotes();
	await fetchWords();
	
	start();
})();


const adjectives = [
	"Cool",
	"Huge",
	"Funny",
	"Japanese",
	"Amazing",
	"Tiny",
	"Stupid",
	"Cowabunga",
	"Wide",
	"Incredible",
	"Corn",
	"Hame",
	"Beluga",
	"Red",
	"Orange",
	"Yellow",
	"Green",
	"Blue",
	"Purple",
	"Brown",
	"Grey",
	"Bong"
];

const nouns = [
	"Dude",
	"Man",
	"Boy",
	"Barf",
	"Girl",
	"MasterChief",
	"Yoshi",
	"Samurai",
	"Beast",
	"Fish",
	"Surfer",
	"Banker",
	"Gamer",
	"Carm",
	"Porkboy",
	"Gamer",
	"Fragger",
	"Hole",
	"Star"
];

//let colours = new Array("Red", "Blue", "Green", "Yellow", "Orange", "Brown", "Black", "White", "Fuchsia");
let colours = ["FF0000", "0000FF", "008000", "B22222", "FF7F50", "FF4500", "2E8B57", "DAA520", "D2691E", "5F9EA0", "1E90FF", "FF69B4", "8A2BE2", "00FF7F"];

const memeMessages = [
	["MaN", "NaM"],
	["Kapp", "Kappa", "Kapp sure"],
	["VaN IT'S SO FUCKING DEEP", "VaN", "VaN FUCK YOU"],
	["gachiHYPER SO AM I", "gachiHYPER", "gachiBASS", "gachiGASM", "gachiHYPER YES SIR", "gachiHYPER OK"],
	["Pepega Clap", "Pepega", "FARMING PEPEGAS WeirdChamp", "Pepega", "NOT PRETENDING PepeHands"],
	["monkaW", "CHAT DONT LOOK BEHIND YOU monkaW", "MEGALUL DETH"],
	["PeepoGlad TeaTime Cock", "PeepoGlad Cock", "Sadge YEP"],
	["WideHard Clap", "WideHard", "TriHard"],
	["LULW TRUE", "LULW", "LULW NOT FALSE"],
	["cmonBruh", "cmonBruh chu say?"]
];

class Chatter {
	constructor(name, colour) {
		// name not given? generate a cool one
		this.name = name || this.generateName();
		this.colour = colour || this.generateColour();
	}
	
	generateName() {
		const adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
		const noun = nouns[Math.floor(Math.random()*nouns.length)];

		let number;

		// force 10% of users to have 69 in their name
		// force 10% of users to have 420 in their name
		// force 20% of users to have no number in their name

		const numberDecider = Math.floor(Math.random()*9);

		if(numberDecider == 0 || numberDecider == 1) {
			number = "";
		} else if(numberDecider == 2) {
			number = 69;
		} else if(numberDecider == 3) {
			number = 420;
		} else {
			number = Math.floor(Math.random()*1000);
		}

		const username = adjective + noun.toLowerCase() + number;

		return username;
	};
	
	generateColour() {
		const colourIndex = Math.floor(Math.random()*colours.length);

		return "#" + colours[colourIndex];
	};
	
	speak () {
		// check if we're gonna do the main meme or not
		// currently 33% chance
		const mainMemeDecider = Math.floor(Math.random()*2);

		let chatMessage, words;

		// we're copying the main meme!
		if(mainMemeDecider == 0 && mainMemeIndex != undefined && mainMemeDuration >= 0) {
			const m = memeMessages[mainMemeIndex];
			const i = randomInteger(m.length - 1);
			chatMessage = m[i];
			chatMessage = (chatMessage + ' ').repeat(randomInteger(8) + 1);

			mainMemeDuration--;
			words = chatMessage.split(' ');
		} else {
			// randomly grab a message from message array
			const messageDecider = Math.floor(Math.random()*spamMessages.length);
			chatMessage = spamMessages[messageDecider];
			
			//while (chatMessage.split(' ')[0] != 'showemote') {
			//	let messageDecider = Math.floor(Math.random()*spamMessages.length);
			//	chatMessage = spamMessages[messageDecider];
			//}
			
			words = chatMessage.split(' ');
			
			if (words[0] == "showemote") {
				const emote = emotes.find(e => e.text === words[1]);
				if (emote) {
					showEmote(emote.url);
				}
				chatMessage = '!#' + chatMessage;
			}
			
			const mainMemeOverwriteDecider = Math.floor(Math.random()*50);

			// let's start a new main meme!
			if(mainMemeOverwriteDecider == 0) {
				let memeMessageDecider = Math.floor(Math.random()*memeMessages.length);
				mainMemeIndex = memeMessageDecider;
				mainMemeDuration = mainMemeDurationStartValue;
				// console.log("overwriting main meme! to: " + memeMessages[messageDecider]);
			}
		}
		
		if (chatMessage.trim() == "")
			return;
		
		if (combo.emote == words[0]) {
			combo.count++;
			
			if (combo.count > 2)
				showCombo(words[0]);
		}	else {
			combo.emote = words[0];
			combo.count = 1;
		}
		
		chatMessage = replaceEmotes(chatMessage);
		
		const chatDiv = document.getElementById("chat");
		const shouldScroll = chatDiv.scrollHeight <= chatDiv.scrollTop + chatDiv.clientHeight; 

		// append the message as a paragraph, including username and name colour
		const stringToAppend = "<p class=\"chatMessage\"><span style=\"font-weight:bold; color:" + this.colour + ";\">" + this.name + "</span>: " + chatMessage + "</p>";
		chatDiv.insertAdjacentHTML('beforeend', stringToAppend);

		if(document.querySelectorAll("#chat > p.chatMessage").length > 100) {
			chatDiv.firstChild.remove();
		}
		
		if (shouldScroll) {
			const $chat = $("#chat");
			$chat.stop().animate({scrollTop:$chat[0].scrollHeight}, 100);
			//chatDiv.scrollTop = chatDiv.scrollHeight;
		}
	}
	
	attemptToSpeak() {
		const chatDecider = Math.floor(Math.random()*49);
		// let's chat!
		if(chatDecider == 3) {
			this.speak();
		}
	};
}

// main logic
const chatters = [];
let mainMemeIndex;
let mainMemeDuration;
const mainMemeDurationStartValue = 100;

function start() {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	const streamer = urlParams.get('streamer') || 'xqcow';
	
	const iframe = document.createElement('iframe');
	iframe.setAttribute("id", "frame");
	
	iframe.src = `https://player.twitch.tv/?channel=${streamer}&html5&parent=localhost&muted=false`;       
	iframe.frameBorder = "0";
	iframe.scrolling = "0";
	iframe.allowFullscreen = "true";
	
	const blankFrame = document.getElementById("blankFrame");
	blankFrame.parentNode.replaceChild(iframe, blankFrame);
	
	for(i = 0; i < 30; i++) {
		chatters.push(new Chatter());
	}
}

function attemptToChat() {
	if (chatters.length == 0)
		return;
	
	const speakDecider = Math.floor(Math.random()*3);

	if(speakDecider == 0) {
		const chatterPicker = Math.floor(Math.random()*chatters.length);

		chatters[chatterPicker].speak();
	}
}

function ajaxit() {
    const iFrameWindow = document.getElementById("myframe").contentWindow;
    iFrameWindow.document.body.appendChild(document.getElementById("form").cloneNode(true));   
    const frameForm = iFrameWindow.document.getElementById("form");
    frameForm.onsubmit = null;
    frameForm.submit();
    return false;
}

document.getElementById("textfield").name = new Date();

setInterval(() => { randomizeChatSpeed(); }, 5000);

let fireChatMessage = setInterval(() => { attemptToChat(); }, 100);

function randomizeChatSpeed() {
	clearInterval(fireChatMessage);
	fireChatMessage = setInterval(() => {attemptToChat();}, Math.floor(Math.random()*50)+50);
}

function myStopFunction() {
    clearInterval(fireChatMessage);
}

function replaceEmotes(message) {
	const words = message.split(' ');
	
	for (let index in words) {
		const emote = emotes.find(e => e.text === words[index]);
		if (emote) {
			words[index] = `<img src='${emote.url}' alt='${emote.text}' class='emote'></img>`;
		}
	};
	
	message = words.join(" ");
	
    return message;
}

async function loadEmotes() {
	const handleTwitchEmotes = async response => {
		const data = await response.json();
	  
		const twitchEmotes = data.emotes.map(emote => ({
			text: emote.code,
			url: `https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/1.0`
		}));
		emotes.push(...twitchEmotes);
	}
	
	const handleBTTVEmotes = async response => {
		const data = await response.json();
		
		if (data.channelEmotes) {
			addBTTVEmotes(data.channelEmotes);
			addBTTVEmotes(data.sharedEmotes);
		} else {
			addBTTVEmotes(data);
		}
		
		function addBTTVEmotes(data) {
			const bttvEmotes = data.map(emote => ({
				text: emote.code,
				url: `https://cdn.betterttv.net/emote/${emote.id}/1x`
			}));
			emotes.push(...bttvEmotes);
		}
	}
	
	// Fetches global twitch emotes
	fetch('https://api.twitchemotes.com/api/v4/channels/0')
		.then(handleTwitchEmotes)
		.catch(console.error)
	
	// Fetches channel specific twitch emotes
	fetch('https://api.twitchemotes.com/api/v4/channels/71092938')
		.then(handleTwitchEmotes)
		.catch(console.error)
	
	// Fetches global bttv emotes
	fetch(`https://api.betterttv.net/3/cached/emotes/global`)
		.then(handleBTTVEmotes)
		.catch(console.error)

	// Fetches channel specific bttv emotes
	fetch(`https://api.betterttv.net/3/cached/users/twitch/71092938`)
		.then(handleBTTVEmotes)
		.catch(console.error)

	// Fetches channel specific ffz emotes
	fetch(`https://api.frankerfacez.com/v1/room/xqcow`)
		.then(async response => {
			const data = await response.json();
			Object.keys(data.sets).forEach(setID => {
				const ffzEmotes = data.sets[setID].emoticons.map(emote => ({
					text: emote.name,
					url: (emote.urls['4'] || emote.urls['2'] || emote.urls['1']).replace(/^\/\//, 'https://')
				}));
				emotes.push(...ffzEmotes);
			});
		})
		.catch(console.error)
}

async function fetchWords() {
	const response = await fetch("words.txt");
	const data = await response.text();
	
	spamMessages = data.split("<eos>");
	//console.log(spamMessages);
}

//writes the text of the input field into the chat with a random username
function chat() {
	let colour = '#FF0000';
	let name = 'l0m';
	
    const textfield = document.getElementById("textfield");
    
	let msgBody = textfield.value.trim();
	
    if(msgBody!="")
    {
		let words = msgBody.split(" ");
		
		if (words[0] == "!donate") {
			words.shift();
			msgBody = words.join(" ");
			donate(msgBody);
			
		} else if (words[0] == "!#showemote") {
			const emote = emotes.find(e => e.text === words[1]);
			if (emote) {
				showEmote(emote.url);
			}
		} else {
			msgBody = replaceEmotes(msgBody);
			
			// append the message as a paragraph, including username and name colour
			const stringToAppend = "<p class=\"chatMessage\"><span style=\"font-weight:bold; color:" + colour + ";\">" + name + "</span>: " + msgBody + "</p>";
			
			const chatDiv = document.getElementById("chat");
			chatDiv.insertAdjacentHTML('beforeend', stringToAppend);
			
			const $chat = $('#chat');
			$chat.animate({scrollTop:$chat[0].scrollHeight}, 100);
		}
		setTimeout(() => {
			// slight delay to allow autofill to save the message
			textfield.value = "";
		}, 50);
    }
}

function donate(voicetext) {
	const httpreq = new XMLHttpRequest();
	voicetext = encodeURIComponent(replaceAll(voicetext, "&"," and "));
	const params = "msg="+voicetext+"&lang=Brian&source=ttsmp3";
	httpreq.open("POST", 'https://cors-anywhere.herokuapp.com/https://ttsmp3.com/makemp3_new.php', true);
	httpreq.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	httpreq.overrideMimeType("application/json");
	httpreq.onreadystatechange = function (e) {
		if (this.readyState == 4 && this.status == 200) {
			const soundarray = JSON.parse(this.responseText);
			if (soundarray["Error"] == 0) {
				const myaudio = new Audio(soundarray["URL"]);
				myaudio.addEventListener('canplaythrough', function () {
					this.loop = false;
					if (donations.length == 0) {
						setTimeout(() => {
							this.play();
						}, 3000 + (Math.random() * 3000));
					}
					donations.push(this);
				});
				myaudio.addEventListener("ended", () => {
					setTimeout(() => {
						donations.shift();
						if (donations.length > 0)
							donations[0].play();
					}, 3000 + (Math.random() * 3000));
				});
			}
			else {
				alert(soundarray['Error']);
			}
		}
	}
	httpreq.send(params);
}
		
function showEmote(url) {
	const canvas = document.getElementById("canvas");
	
	const emote = document.createElement("img");
	emote.src = url;
	
	canvas.appendChild(emote);
	
    const left = (canvas.offsetWidth - 128) * Math.random();
    const top = (canvas.offsetHeight - 128) * Math.random();
	
    const emoteStyle = emote.style;
    emoteStyle.position = "absolute";
    emoteStyle.maxHeight = "56px";
    emoteStyle.top = top + 'px';
    emoteStyle.left = left + 'px';
	
	$(emote).hide();
	$(emote).fadeIn(1000);
	
	setTimeout(() => {
		$(emote).fadeOut(1000, () => $(emote).remove());
	}, 5000)
}

function showCombo(word) {
	const emote = emotes.find(e => e.text === word);
	if (!emote)
		return;
	
	const canvas = document.getElementById("canvas");
	if (word != combo.oldEmote) {
		$('#comboDiv').remove();
		combo.elt = null;
	}	
	
	if (combo.elt) {
		//update combo and pulse
		if (parseInt($("#combo span").text()) < combo.count) {
			clearTimeout(combo.timeout);
			combo.timeout = null;
			
			$('#comboDiv').animate({
				'font-size': '18px',
			}, 80, () => {
				$('#comboDiv').animate({
					'font-size': '16px',
				}, 80);
			});
		}
		
		$("#combo span").text(combo.count);
	} else {
		combo.oldEmote = emote.text;
		
		const div = document.createElement("div");
		div.setAttribute("id", "comboDiv");
		
		combo.elt = div;

		canvas.appendChild(div);
		
		$('#comboDiv').hide();
		$('#comboDiv').fadeIn(1000);
		
		const stringToAppend = `<p id='combo' class='chatMessage'>COMBO x<span>${combo.count}</span><img src='${emote.url}' class='emote'></img></p>`;
		document.getElementById("comboDiv").innerHTML = stringToAppend;
	}
	
	if (!combo.timeout) {
		combo.timeout = setTimeout(() => {
			$('#comboDiv').fadeOut(1000, () => {$('#comboDiv').remove(); combo.elt = null});
		}, 5000)
	}
}

function randomInteger(n) {
	if (n < 3)
		return 0;
	
	const x = Math.ceil(Math.random() * 100);
	
	if (x > 40)
		return 0;
	else if (x > 15)
		return 1;
	else if (x > 5)
		return 2;
	else return Math.min(n, 2 + Math.ceil(Math.random() * (n - 2)));
}

escapeRegExp = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace);

window.onerror = (msg, url, line) => {
    if (msg == "[IFRAME ERROR MESSAGE]") {
        return true
    }
}