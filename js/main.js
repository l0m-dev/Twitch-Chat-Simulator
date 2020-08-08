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

(async function () {
	document.getElementById("textfield").name = new Date();

	await loadEmotes();
	await fetchWords();

	start();
})();

//let colours = new Array("Red", "Blue", "Green", "Yellow", "Orange", "Brown", "Black", "White", "Fuchsia");
let colours = ["FF0000", "0000FF", "008000", "B22222", "FF7F50", "FF4500", "2E8B57", "DAA520", "D2691E", "5F9EA0", "1E90FF", "FF69B4", "8A2BE2", "00FF7F"];

let username = (localStorage["username"] && localStorage["username"] != "") ? localStorage["username"] : "PepegaHunter2";

// main logic
const chatters = [];
let mainMemeIndex;
let mainMemeDuration;
const mainMemeDurationStartValue = 100;
let shouldScroll = true;
let streamer = new URLSearchParams(window.location.search).get('streamer') || 'xQcOW';

function start() {
	const iframe = document.createElement('iframe');
	iframe.setAttribute("id", "frame");

	iframe.src = `https://player.twitch.tv/?channel=${streamer}&html5&parent=localhost&muted=false`;
	iframe.frameBorder = "0";
	iframe.scrolling = "0";
	iframe.allowFullscreen = "true";

	const blankFrame = document.getElementById("blankFrame");
	blankFrame.parentNode.replaceChild(iframe, blankFrame);

	for (i = 0; i < 30; i++) {
		chatters.push(new Chatter());
	}
	attemptToChat();
}

function attemptToChat() {
	if (chatters.length == 0)
		return;

	const chatterPicker = Math.floor(Math.random() * chatters.length);

	chatters[chatterPicker].speak();

	setTimeout(() => {
		attemptToChat();
	}, Math.floor(Math.random() * 150) + 100);
}

function ajaxit() {
	const iFrameWindow = document.getElementById("myframe").contentWindow;
	iFrameWindow.document.body.appendChild(document.getElementById("chatFooterForm").cloneNode(true));
	const frameForm = iFrameWindow.document.getElementById("chatFooterForm");
	frameForm.onsubmit = null;
	frameForm.submit();
	return false;
}

function replaceEmotes(message) {
	const words = message.split(' ');

	for (let index in words) {
		const emote = findEmote(words[index]);
		if (emote) {
			words[index] = `<div class="emote_holder"><img src='${emote.url}' alt='${emote.text}' onload='scrollToBottomOnLoad(this)' class='emote'></img></div>`;
		}
	};

	return words.join(" ");
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
					url: emote.urls['1'].replace(/^\/\//, 'https://')
				}));
				emotes.push(...ffzEmotes);
			});
		})
		.catch(console.error)
}

async function fetchWords() {
	const response = await fetch("data/words.txt");
	const data = await response.text();

	spamMessages = data.split("<eos>");
}

function chat() {
	let colour = '#FF0000';

	const textfield = document.getElementById("textfield");

	let msgBody = textfield.value.trim();

	if (msgBody != "") {
		let words = msgBody.split(" ");

		if (words[0] == "!donate") {
			words.shift();
			msgBody = words.join(" ");
			donate(msgBody);
		} else if (words[0] == "!#showemote") {
			const emote = findEmote(words[1]);
			if (emote) {
				showEmote(emote.url);
			}
		} else {
			msgBody = replaceEmotes(msgBody);

			// append the message as a paragraph, including username and name colour
			const stringToAppend = `<div class="chatMessage"><span style="font-weight: bold; color: ${colour};">${username}</span><span>: </span><span class="chatMessageText">${msgBody}</span></div>`;

			const chatDiv = document.getElementById("chat");
			chatDiv.insertAdjacentHTML('beforeend', stringToAppend);

			//const $chat = $('#chat');
			//$chat.animate({scrollTop:chatDiv.scrollHeight}, 100);
			chatDiv.scrollTop = chatDiv.scrollHeight;
		}
		setTimeout(() => {
			// slight delay to allow autofill to save the message
			textfield.value = "";
		}, 50);
	}
}

function scrollToBottom() {
	const chatDiv = document.getElementById("chat");
	chatDiv.scrollTop = chatDiv.scrollHeight;
}

function scrollToBottomOnLoad(elt) {
	const chatDiv = document.getElementById("chat");
	const height = elt.parentNode.parentNode.clientHeight;
	let scroll = chatDiv.scrollHeight <= chatDiv.scrollTop + chatDiv.clientHeight + height;

	if (scroll) {
		chatDiv.scrollTop = chatDiv.scrollHeight;
	}
}

function openSettings() {
	//https://codepen.io/fogrew/pen/yVpmzY
	
	document.getElementById("streamer").value = streamer;
	document.getElementById("username").value = username;
	
	document.getElementsByClassName("settings_wrapper")[0].style.display = "block";
}

function closeSettings(e) {
	if (e.currentTarget != e.target)
		return;
	
	const myUsername = document.getElementById("username").value.trim();
	if (username != "") {
		username = myUsername;
		localStorage["username"] = username;
	}
	
	const streamerUsername = document.getElementById("streamer").value.trim();
	if (streamerUsername != "" && streamer != streamerUsername) {
		window.location.href = window.location.href.split('?')[0] + '?streamer=' + streamerUsername;
	}
	
	e.currentTarget.style.display = "none";
}

window.onerror = (msg, url, line) => {
	if (msg == "[IFRAME ERROR MESSAGE]") {
		return true
	}
}