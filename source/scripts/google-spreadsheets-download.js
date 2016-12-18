var request = require("request");

function simplifyJson(data) {
	var entry = data.feed.entry,
		r = {
			title: data.feed.title.$t,
			orderedSheetsTitle: [],
			orderedSheetsId: [],
			cells: {}
		},
		i, id, title, content, smallId;
	for (i = 0; i < entry.length; i++) {
		id = entry[i].id.$t;
		title = entry[i].title.$t;
		content = entry[i].content.$t;
		smallId = entry[i].id.$t.match(/[^/]*$/)[0];
		if (smallId.match(/^R\d+C\d+$/)) {
			if (content !== '') {
				r.cells[title] = content;
			}
		} else {
			r.orderedSheetsTitle.push(title);
			r.orderedSheetsId.push(smallId);
		}
	}
	if (JSON.stringify(r.cells) === JSON.stringify({})) {
		delete r.cells;
	}
	return r;
}

function requestJson(url, callback) {
	request({ url: url, json: true }, function (err, response, data) {
		if (!err && response.statusCode === 200) {
			return callback(data);
		} else {
			if (err) {
				throw err;
			}
		}
	});
}

function requestSpreadsheet(id, callback) {
	var urlStart = "https://spreadsheets.google.com/feeds/",
		urlEnd = "/public/basic?alt=json",
		url = urlStart + "worksheets/" + id + urlEnd;
	requestJson(url, function (data) {
		var counter = 0,
			output = simplifyJson(data),
			sheets = output.orderedSheetsId,
			url, i;
		output.sheets = {};

		function retrieveSheet(data) {
			var simple = simplifyJson(data),
				title = simple.title;
			output.sheets[title] = simple.cells;
			counter--;
			if (counter === 0) {
				callback(output);
			}
		}
		for (i = 0; i < sheets.length; i++) {
			url = urlStart + "cells/" + id + "/" + sheets[i] + urlEnd;
			requestJson(url, retrieveSheet);
			counter++;
		}
	});
}

//requestSpreadsheet("1Wl4MriZ-4HM_DmXWxHyH7Xt2VKoRPK3RfCji_KhFa7U", function (data) {
requestSpreadsheet("1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA", function (data) {
	console.log(JSON.stringify(data, null, "\t"));
});
