"use strict";
let request = require("request");
let organizeData = (feed) => {
	// Parse data as it comes from Google Spreadsheet and
	// reorganize it in a simplified data structure
	let entry = feed.entry,
		r = {
			title: $t(feed, "title"),
			orderedSheetsTitle: [],
			orderedSheetsId: [],
			cells: {}
		};
	entry.map((value) => {
		let title = $t(value, "title"),
			content = $t(value, "content"),
			id = $t(value, "id").match(/[^/]*$/)[0];
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

let $t = (value, name) => {
	return value[name].$t;
}

let requestJson = (url, callback) => {
	request({ url: url, json: true }, (err, response, data) => {
		if (!err && response.statusCode === 200) {
			return callback(data);
		} else {
			if (err) {
				throw err;
			}
		}
	});
}

let downloadSpreadsheet = (id, callback) => {
	let urlStart = "https://spreadsheets.google.com/feeds/",
		urlEnd = "/public/basic?alt=json",
		url = urlStart + "worksheets/" + id + urlEnd;
	requestJson(url, (data) => {
		let simple1 = organizeData(data.feed),
			sheets = simple1.orderedSheetsId,
			counter = sheets.length;
		simple1.sheets = {};
		sheets.map((value) => {
			let url = urlStart + "cells/" + id + "/" + value + urlEnd;
			requestJson(url, (data) => {
				let simple2 = organizeData(data.feed),
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
module.exports = downloadSpreadsheet;
