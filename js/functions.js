findEmote = (word) => emotes.find(e => e.text === word);

escapeRegExp = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

replaceAll = (str, find, replace) => str.replace(new RegExp(escapeRegExp(find), 'g'), replace);