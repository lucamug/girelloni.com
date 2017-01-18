"use strict";
let downloadGoogleSpreadsheet = require("./downloadGoogleSpreadsheet");
downloadGoogleSpreadsheet("1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA", (data) => { // blog
	const unordered = data.sheets;
	const ordered = {};
	Object.keys(unordered).sort().forEach(function (key) {
		ordered[key] = unordered[key];
	});
	data.sheets = ordered;
	console.log(JSON.stringify(data, null, '\t'));
});
