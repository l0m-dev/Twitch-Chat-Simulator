function donate(voicetext) {
	const httpreq = new XMLHttpRequest();
	voicetext = encodeURIComponent(replaceAll(voicetext, "&", " and "));
	const params = "msg=" + voicetext + "&lang=Brian&source=ttsmp3";
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
			} else {
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

function showCombo(emote) {
	const word = emote.text;
	const canvas = document.getElementById("canvas");
	if (word != combo.oldEmote) {
		$('#comboDiv').remove();
		combo.elt = null;

		clearTimeout(combo.timeout);
		combo.timeout = null;
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
		combo.oldEmote = word;

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
			$('#comboDiv').fadeOut(1000, () => {
				$('#comboDiv').remove();
				combo.elt = null
			});
		}, 5000)
	}
}