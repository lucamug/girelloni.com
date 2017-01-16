"use strict";
let downloadGoogleSpreadsheet = require("./downloadGoogleSpreadsheet");
downloadGoogleSpreadsheet("1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA", (data) => { // blog
	console.log(JSON.stringify(data, null, "\t"));
});
