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

const memeMessages = [
	["MaN", "NaM", "VaN"],
	["Kapp", "Kappa", "Kapp sure"],
	["VaN IT'S SO FUCKING DEEP", "VaN", "VaN FUCK YOU"],
	["gachiHYPER SO AM I", "gachiHYPER", "gachiBASS", "gachiGASM", "gachiHYPER YES SIR", "gachiHYPER OK"],
	["Pepega Clap", "Pepega", "FARMING PEPEGAS WeirdChamp", "Pepega", "NOT PRETENDING PepeHands"],
	["monkaW", "CHAT DONT LOOK BEHIND YOU monkaW", "MEGALUL DETH"],
	["PeepoGlad TeaTime Cock", "PeepoGlad Cock", "Sadge YEP"],
	["WideHard", "WideHard YOINK", "TriHard"],
	["LULW TRUE", "LULW", "LULW NOT FALSE"],
	["cmonBruh", "cmonBruh chu say?", "cmonBruh WTF?", "cooBruh"]
];

class Chatter {
	constructor(name, colour) {
		// name not given? generate a cool one
		this.name = name || this.generateName();
		this.colour = colour || this.generateColour();
	}

	generateName() {
		const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
		const noun = nouns[Math.floor(Math.random() * nouns.length)];

		let number;

		// force 10% of users to have 69 in their name
		// force 10% of users to have 420 in their name
		// force 20% of users to have no number in their name

		const numberDecider = Math.floor(Math.random() * 9);

		if (numberDecider == 0 || numberDecider == 1) {
			number = "";
		} else if (numberDecider == 2) {
			number = 69;
		} else if (numberDecider == 3) {
			number = 420;
		} else {
			number = Math.floor(Math.random() * 1000);
		}

		const username = adjective + noun.toLowerCase() + number;

		return username;
	};

	generateColour() {
		const colourIndex = Math.floor(Math.random() * colours.length);

		return "#" + colours[colourIndex];
	};

	speak() {
		// check if we're gonna do the main meme or not
		// currently 33% chance
		const mainMemeDecider = Math.floor(Math.random() * 2);

		let chatMessage, words;

		// we're copying the main meme!
		if (mainMemeDecider == 0 && mainMemeIndex != undefined && mainMemeDuration >= 0) {
			const m = memeMessages[mainMemeIndex];
			const i = randomInteger(m.length - 1);
			chatMessage = m[i];
			chatMessage = (chatMessage + ' ').repeat(randomInteger(8) + 1);

			mainMemeDuration--;
			words = chatMessage.split(' ');
		} else {
			// randomly grab a message from message array
			const messageDecider = Math.floor(Math.random() * spamMessages.length);
			chatMessage = spamMessages[messageDecider];

			//while (chatMessage.split(' ')[0] != 'showemote') {
			//	let messageDecider = Math.floor(Math.random()*spamMessages.length);
			//	chatMessage = spamMessages[messageDecider];
			//}

			words = chatMessage.split(' ');

			if (words[0] == "showemote") {
				const emote = findEmote(words[1]);
				if (emote) {
					showEmote(emote.url);
				}
				chatMessage = '!#' + chatMessage;
			}

			const mainMemeOverwriteDecider = Math.floor(Math.random() * 50);

			// let's start a new main meme!
			if (mainMemeOverwriteDecider == 0) {
				let memeMessageDecider = Math.floor(Math.random() * memeMessages.length);
				mainMemeIndex = memeMessageDecider;
				mainMemeDuration = mainMemeDurationStartValue;
				// console.log("overwriting main meme! to: " + memeMessages[messageDecider]);
			}
		}

		if (chatMessage.trim() == "")
			return;

		if (combo.emote == words[0]) {
			combo.count++;

			if (combo.count > 2) {
				let emote = findEmote(words[0]);
				if (emote) {
					showCombo(emote);
				}
			}
		} else {
			combo.emote = words[0];
			combo.count = 1;
		}

		chatMessage = replaceEmotes(chatMessage);

		const chatDiv = document.getElementById("chat");
		//const height = chatDiv.lastChild.clientHeight || 0;

		shouldScroll = chatDiv.scrollHeight <= chatDiv.scrollTop + chatDiv.clientHeight + 16;

		// append the message as a paragraph, including username and name colour
		const stringToAppend = `<div class="chatMessage"><span style="font-weight: bold; color: ${this.colour};">${this.name}</span><span>: </span>${chatMessage}</div>`;
		chatDiv.insertAdjacentHTML('beforeend', stringToAppend);

		while ((document.querySelectorAll("#chat > div.chatMessage").length > 40 && shouldScroll) || document.querySelectorAll("#chat > div.chatMessage").length > 200) {
			chatDiv.firstChild.remove();
		}

		if (shouldScroll) {
			//const $chat = $("#chat");
			//$chat.stop().animate({scrollTop:chatDiv.scrollHeight}, 100);

			chatDiv.scrollTop = chatDiv.scrollHeight;
		}

		document.getElementById("autoscroll").style.opacity = shouldScroll ? "0" : "1";
		document.getElementById("autoscroll").style.pointerEvents = shouldScroll ? "none" : "all";
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