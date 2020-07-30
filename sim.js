let emotes = [];
let spam = [];
let combo = {
	emote: null,
	count: 0,
	elt: null,
	combo: null
};

(async function() {
	await loadEmotes();
	await fetchWords();
	
	start();
})();


class Chatter {
	constructor(name, colour) {
		// name not given? generate a cool one
		this.name = name || this.generateName();
		this.colour = colour || this.generateColour();

		this.memeMessages = [
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
									
		this.spamMessages = spam;//new Array("SPAM", "YEP", "DonoWall", "Any joyers?", "4Shrug");
	}
	
	generateName() {
		// adjective list
		let adjectives = [
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

		// noun list
		let nouns = [
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

		let adjective = adjectives[Math.floor(Math.random()*adjectives.length)];
		let noun = nouns[Math.floor(Math.random()*nouns.length)];

		let number;

		// force 10% of users to have 69 in their name
		// force 10% of users to have 420 in their name
		// force 20% of users to have no number in their name

		let numberDecider = Math.floor(Math.random()*9);

		if(numberDecider == 0 || numberDecider == 1) {
			number = "";
		} else if(numberDecider == 2) {
			number = 69;
		} else if(numberDecider == 3) {
			number = 420;
		} else {
			number = Math.floor(Math.random()*1000);
		}

		let username = adjective + noun.toLowerCase() + number;

		return username;
	};
	
	generateColour() {
		// let colours = new Array("Red", "Blue", "Green", "Yellow", "Orange", "Brown", "Black", "White", "Fuchsia");
		let colours = ["FF0000", "0000FF", "008000", "B22222", "FF7F50", "FF4500", "2E8B57", "DAA520", "D2691E", "5F9EA0", "1E90FF", "FF69B4", "8A2BE2", "00FF7F"];

		let colourIndex = Math.floor(Math.random()*colours.length);

		return "#" + colours[colourIndex];
	};
	
	speak () {
		// check if we're gonna do the main meme or not
		// currently 33% chance
		let mainMemeDecider = Math.floor(Math.random()*2);

		let chatMessage, words;

		// we're copying the main meme!
		if(mainMemeDecider == 0 && mainMemeIndex != undefined && mainMemeDuration >= 0) {
			let m = this.memeMessages[mainMemeIndex];
			let i = randomInteger(m.length - 1);
			chatMessage = m[i];
			chatMessage = (chatMessage + ' ').repeat(randomInteger(8) + 1);

			mainMemeDuration--;
			words = chatMessage.split(' ');
		} else {
			// randomly grab a message from message array
			let messageDecider = Math.floor(Math.random()*this.spamMessages.length);
			chatMessage = this.spamMessages[messageDecider];
			
			//while (chatMessage.split(' ')[0] != 'showemote') {
			//	let messageDecider = Math.floor(Math.random()*this.spamMessages.length);
			//	chatMessage = this.spamMessages[messageDecider];
			//}
			
			words = chatMessage.split(' ');
			
			if (words[0] == "showemote") {
				const emote = emotes.find(e => e.text === words[1]);
				if (emote) {
					showEmote(emote.url);
				}
				chatMessage = '!#' + chatMessage;
			}
			
			let mainMemeOverwriteDecider = Math.floor(Math.random()*50);

			// let's start a new main meme!
			if(mainMemeOverwriteDecider == 0) {
				let memeMessageDecider = Math.floor(Math.random()*this.memeMessages.length);
				mainMemeIndex = memeMessageDecider;
				mainMemeDuration = mainMemeDurationStartValue;
				// console.log("overwriting main meme! to: " + this.messages[messageDecider]);
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
		
		let $chat = $('#chat');
		let shouldScroll = $chat[0].scrollHeight - $chat.height() <= $chat.scrollTop() + 60; 

		// append the message as a paragraph, including username and name colour
		let stringToAppend = "<p class=\"chatMessage\"><span style=\"font-weight:bold; color:" + this.colour + ";\">" + this.name + "</span>: " + chatMessage + "</p>";
		$chat.append(stringToAppend);

		if(document.querySelectorAll("#chat > p.chatMessage").length > 100) {
			$("#chat p:first-child").remove();
		}
		
		if (shouldScroll) {
			$chat.animate({scrollTop:$chat[0].scrollHeight}, 100);
		}
	}
	
	attemptToSpeak() {
		let chatDecider = Math.floor(Math.random()*49);
		// let's chat!
		if(chatDecider == 3) {
			this.speak();
		}
	};
}

// main logic
let chatters = [];
let mainMemeIndex;
let mainMemeDuration;
let mainMemeDurationStartValue = 100;

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
	
	$("#blankFrame").replaceWith(iframe);
	
	for(i = 0; i < 30; i++) {
		chatters.push(new Chatter());
	}
}

function attemptToChat() {
	if (chatters.length == 0)
		return;
	
	let speakDecider = Math.floor(Math.random()*3);

	if(speakDecider == 0) {
		let chatterPicker = Math.floor(Math.random()*chatters.length);

		chatters[chatterPicker].speak();
	}
}

function ajaxit() {
    let iFrameWindow = document.getElementById("myframe").contentWindow;
    iFrameWindow.document.body.appendChild(document.getElementById("form").cloneNode(true));   
    let frameForm = iFrameWindow.document.getElementById("form");
    frameForm.onsubmit = null;
    frameForm.submit();
    return false;
}

$("#textfield")[0].name = new Date();

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
	let words = message.split(' ');
	
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
	let response = await fetch("words.txt");
	let data = await response.text();
	
	spam = data.split("<eos>");
	//console.log(spam);
}

//writes the text of the input field into the chat with a random username
function chat() {
	let colour = '#FF0000';
	let name = 'l0m';
	
    let textfield = $("#textfield");
    
	let msgBody = textfield.val().trim();
	
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
			let stringToAppend = "<p class=\"chatMessage\"><span style=\"font-weight:bold; color:" + colour + ";\">" + name + "</span>: " + msgBody + "</p>";
			let $chat = $('#chat');
			
			$chat.append(stringToAppend);
			$chat.animate({scrollTop:$chat[0].scrollHeight}, 100);
		}
		setTimeout(() => {
			// slight delay to allow autofill to save the message
			textfield.val("");
		}, 50);
    }
}

async function donate(text) {
	let speak = await fetch("https://api.streamelements.com/kappa/v3/speech?voice=Brian&text=" + encodeURIComponent(text.trim()));

	if (speak.status != 200) {
		alert(await speak.text());
		return;
	}

	let mp3 = await speak.blob();

	let blobUrl = URL.createObjectURL(mp3);
	document.getElementById("source").setAttribute("src", blobUrl);
	let audio = document.getElementById("audio");
	audio.pause();
	audio.load();
	audio.play();
}

function showEmote(url) {
	let canvas = document.getElementById("canvas");
	
	let emote = document.createElement("img");
	emote.src = url;
	
	canvas.appendChild(emote);
	
    let left = ($("#canvas").width() - 128) * Math.random();
    let top = ($("#canvas").height() - 128) * Math.random();
	
    let emoteStyle = emote.style;
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
	
	let canvas = document.getElementById("canvas");
	let div = null;
	
	if (combo.elt) {
		div = combo.elt;
		//$('#comboDiv').fadeIn(1000);
		//clearInterval(combo.interval);
		
		//update combo and pulse
		return;
	} else {
		div = document.createElement("div");
		div.setAttribute("id", "comboDiv");
		
		combo.elt = div;
		
		$('#comboDiv').hide();
		$('#comboDiv').fadeIn(1000);

		canvas.appendChild(div);
		
		let left = 128;
		let top = $("#canvas").height() - 128;
		
		let divStyle = div.style;
		divStyle.position = "absolute";
		divStyle.maxHeight = "56px";
		divStyle.top = top + 'px';
		divStyle.left = left + 'px';
		
		let $comboDiv = $('#comboDiv');
		let stringToAppend = `<p class='chatMessage'>COMBO x${combo.count} <img src='${emote.url}'></img></p>`;
		$comboDiv.append(stringToAppend);
	}
	
	combo.interval = setTimeout(() => {
		$('#comboDiv').fadeOut(1000, () => {$('#comboDiv').remove(); combo.elt = null});
	}, 5000)
}

function randomInteger(n) {
	if (n < 3)
		return 0;
	
	let x = Math.ceil(Math.random() * 100);
	
	if (x > 40)
		return 0;
	else if (x > 15)
		return 1;
	else if (x > 5)
		return 2;
	else return Math.min(n, 2 + Math.ceil(Math.random() * (n - 2)));
}

window.onerror = (msg, url, line) => {
    if (msg == "[IFRAME ERROR MESSAGE]") {
        return true
    }
}