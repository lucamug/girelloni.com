var request = require("request");

function simplifyJson(feed) {
	// Parse data as it comes from Google Spreadsheet and
	// reorganize it in a simplified data structure
	var entry = feed.entry,
		r = {
			title: $t(feed, "title"),
			orderedSheetsTitle: [],
			orderedSheetsId: [],
			cells: {}
		};
	entry.map(function (value) {
		var title = $t(value, "title");
		var content = $t(value, "content");
		var id = $t(value, "id").match(/[^/]*$/)[0];
		if (id.match(/^R\d+C\d+$/)) {
			if (content !== '') {
				r.cells[title] = content;
			}
		} else {
			r.orderedSheetsTitle.push(title);
			r.orderedSheetsId.push(id);
		}
	});
	if (JSON.stringify(r.cells) === JSON.stringify({})) {
		delete r.cells;
	}
	return r;
}

function $t(value, name) {
	return value[name].$t;
}

function requestJson(url, callback) {
	request({ url: url, json: true }, function (err, response, data) {
		if (!err && response.statusCode === 200) {
			// console.log(JSON.stringify(data, null, "\t"));
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
		var simple1 = simplifyJson(data.feed),
			sheets = simple1.orderedSheetsId,
			counter = sheets.length;
		simple1.sheets = {};
		sheets.map(function (value) {
			var url = urlStart + "cells/" + id + "/" + value + urlEnd;
			requestJson(url, function retrieveSheet(data) {
				var simple2 = simplifyJson(data.feed),
					title = simple2.title;
				simple1.sheets[title] = simple2.cells;
				counter--;
				if (counter === 0) {
					callback(simple1);
				}
			});
		});
	});
}

//requestSpreadsheet("1Wl4MriZ-4HM_DmXWxHyH7Xt2VKoRPK3RfCji_KhFa7U", function (data) {
requestSpreadsheet("1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA", function (data) {
	console.log(JSON.stringify(data, null, "\t"));
});
