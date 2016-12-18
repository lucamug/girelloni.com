var gsjson = require('google-spreadsheet-to-json');
// requestSpreadsheet("1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA");
gsjson({
		spreadsheetId: '1Wl4MriZ-4HM_DmXWxHyH7Xt2VKoRPK3RfCji_KhFa7U',
		spreadsheetId: '1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA',


		// other options... 
	})
	.then(function (result) {
		console.log(result.length);
		console.log(result);
	})
	.catch(function (err) {
		console.log(err.message);
		console.log(err.stack);
	});
