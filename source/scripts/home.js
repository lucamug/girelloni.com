// Commands
//
// node source/scripts/home.js
// node source/scripts/google-spreadsheets-download.js > ./blog.2016-12-20T00:00.json
// node source/scripts/google-spreadsheets-download.js > ./last.json
//
// css goes into https://www.blogger.com/template-editor.g?blogID=3237061565949672219
//
// １２３４５６７８９０
/*

OLD LINKS

http://www.kozuredeyoroppa.com/2016/11/italy-sicily.JA.html
http://www.kozuredeyoroppa.com/2016/11/italy-sicily.EN.html
http://www.kozuredeyoroppa.com/2016/07/germany-wadden-sea-bremerhaven.JA.html
http://www.kozuredeyoroppa.com/2016/06/germany-wittenberg.html
http://www.kozuredeyoroppa.com/2015/09/ireland-dublin-united-kingdom-wales-bristol-stonehenge.html
http://www.kozuredeyoroppa.com/2014/07/poland-warsaw-mazuri-lake-district-torun-suvovinsuki-national-park-gdansk.html
http://www.kozuredeyoroppa.com/2013/07/germany-dusseldorf-cologne-frankfurt-heidelberg-rothenburg-nuremberg.html
http://www.kozuredeyoroppa.com/2013/06/spain-andalusia-valencia.html
http://www.kozuredeyoroppa.com/2013/05/poland-krakow-zalipie.html
http://www.kozuredeyoroppa.com/2012/08/iceland-reykjavik-germany-berlin-hamburg-luebeck.html
http://www.kozuredeyoroppa.com/2011/11/slovakia-bratislava-czech-republic-prague-cesky-krumlov-germany-dresden-italy-venice.html
http://www.kozuredeyoroppa.com/2011/06/austria-vienna-slovakia-bratislava-hungary-budapest.html
http://www.kozuredeyoroppa.com/2010/10/france-paris-reims.html
http://www.kozuredeyoroppa.com/2010/08/finland-helsinki.html
*/

//
// "aチ".match(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/)

var version = "0.20";
var readyForCopyandPaste = true;

Array.prototype.joinHtml = function () {
	return this.join('\n');
};

String.prototype.supplant = function (o) {
	return this.replace(/{([^{}]*)}/g,
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};

Number.prototype.pad = function (width, z) {
	z = z || '0';
	var n = this + '';
	width = width || n.length;
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

var fs = require('fs'),
	// error,
	japaneseSpace = "　",
	japaneseComma = "、",
	japaneseDot = "。",
	s = require('./../../last.json'),
	posts = [],
	allData = {},
	i, j,
	destinationFolder = "./build/development/";

createObject(s.sheets.Data, 'countries', "A", "BC", allData);
createObject(s.sheets.Data, 'locations', "D", "EFGH", allData);
createObject(s.sheets.Data, 'trips', "I", "JKLMNO", allData);
createObject(s.sheets.Posts, 'posts', "A", "BCDEFGHIJKLMNOPQR", allData);
createPostsByTrips();
createTitlesAndKeywords();
createCommonStuff();
createPosts();

// console.log(allData.titles);
// console.log(allData.trips);
// console.log(allData.ordered.posts);

function createTitlesAndKeywords() {
	var postID, postData, i, j, t = {},
		k = {},
		posts = allData.ordered.posts,
		titleJA, titleEN;
	for (i = 0; i < posts.length; i++) {
		titleEN = [];
		titleJA = [];
		postID = posts[i];
		postData = allData.posts[postID];

		// console.log(postData.Location1);
		if (postData.Location1) {
			titleJA.push(allData.locations[postData.Location1].JA);
			titleEN.push(allData.locations[postData.Location1].EN);
		}
		if (postData.Location2) {
			titleJA.push(allData.locations[postData.Location2].JA);
			titleEN.push(allData.locations[postData.Location2].EN);
		}
		if (postData.Location3) {
			titleJA.push(allData.locations[postData.Location3].JA);
			titleEN.push(allData.locations[postData.Location3].EN);
		}

		t[postID] = {};
		t[postID].EN = titleEN.join(", ") + " (" + allData.countries[postData.Country].EN + ")";
		t[postID].JA = titleJA.join(japaneseComma) + "【" + allData.countries[postData.Country].JA + "】";

		k[postID] = {};
		k[postID].EN = titleEN.join(",") + "," + allData.countries[postData.Country].EN;
		k[postID].JA = titleJA.join(",") + "," + allData.countries[postData.Country].JA;

		if (postData.Keywords) {
			var keywords = postData.Keywords.split(/\s*,\s*/);
			for (j = 0; j < keywords.length; j++) {
				k[postID].EN += "," + allData.locations[keywords[j]].EN;
				k[postID].JA += "," + allData.locations[keywords[j]].JA;
				// console.log(allData.locations[keywords[j]]);
			}
		}
		// console.log(titleJA);
	}
	allData.titles = t;
	allData.keywords = k;
}

function fromKeywordsToHtml(keywords, joiner) {
	// http://www.kozuredeyoroppa.com/search/label/
	var k = keywords.split(/\s*,\s*/);
	// console.log(k);
	var html = [];
	var i;
	for (i = 0; i < k.length; i++) {
		html.push("<a href='/search/label/" + k[i] + "'>" + k[i] + "</a>");
	}
	return html.join(joiner);
}

function createPostsByTrips() {
	var postID, postData, tripID, i, r = {},
		posts = allData.ordered.posts;
	for (i = 0; i < posts.length; i++) {
		postID = posts[i];
		postData = allData.posts[postID];
		tripID = postData.Trip;
		if (tripID) {
			r[tripID] = r[tripID] || [];
			r[tripID].push(postID);
		}
	}
	allData.postsByTrips = r;
}

function error(err) {
	if (err) {
		return console.log(err);
	}
}

function createPosts() {
	var counter = 1,
		imageFound, tripID, postsByTrips, lineJA, lineEN, boxContentEN, boxContentJA, headerJA, headerEN, htmlJA, htmlEN, postID, postData, fileNameJA, fileNameEN, postContent;
	for (i = 0; i < allData.ordered.posts.length; i++) {
		imageFound = false;
		htmlJA = [];
		htmlEN = [];
		postID = allData.ordered.posts[i];
		postData = allData.posts[postID];
		postContent = s.sheets[postID];
		tripID = postData.Trip;
		postsByTrips = allData.postsByTrips[tripID];
		fileNameJA = urlToFilename(postData.LinkJA);
		fileNameEN = urlToFilename(postData.LinkEN);
		headerJA = [
			readyForCopyandPaste ? "" : "<link rel='stylesheet' type='text/css' href='css/app.css'>",
			'<!--',
				'\tPost title: ' + allData.titles[postID].JA,
				'\tLabels: ' + allData.keywords[postID].JA,
				'\tSchedule: ' + postData.Year + '.' + postData.Month,
				'\tPermalink: ' + postData.Year + '.' + postData.Month,
				'\tLink: ' + postData.LinkJA,
				'\tPostID: ' + postID,
				'\tVersion: ' + version + " " + new Date(),
			'-->',
			'<!-- postData: ',
				JSON.stringify(postData, null, '\t'),
			'-->',
			'<!-- postsByTrips: ',
				JSON.stringify(postsByTrips, null, '\t'),
			'-->',
		].joinHtml('\n');
		headerEN = [
			// '<link href="css/app.css" rel="stylesheet" type="text/css">',
			'<!--',
				'\tPost title: ' + allData.titles[postID].EN,
				'\tLabels: ' + allData.keywords[postID].EN,
				'\tSchedule: ' + postData.Year + '.' + postData.Month,
				'\tPermalink: ' + postData.Year + '.' + postData.Month,
				'\tLink: ' + postData.LinkEN,
				'\tPostID: ' + postID,
				'\tVersion: ' + version + " " + new Date(),
			'-->',
			'<!-- postData: ',
				JSON.stringify(postData, null, '\t'),
			'-->',
			'<!-- postsByTrips: ',
				JSON.stringify(postsByTrips, null, '\t'),
			'-->',
		].joinHtml('\n');
		if (postContent) {
			//var box = '<div class="box" style="width: 40%; border: 2px solid #eee; float: right; padding: 1em; margin: 0 0 1em 1em">';
			boxContentEN = [];
			boxContentJA = [];
			boxContentEN.push('<p class="languageSelector"><a href="' + postData.LinkJA + '">Japanese 日本語</a></p>');
			boxContentJA.push('<p class="languageSelector"><a href="' + postData.LinkEN + '">English</a></p>');
			if (postsByTrips.length > 1) {
				var listEN = [];
				var listJA = [];
				for (j = 0; j < postsByTrips.length; j++) {
					if (postsByTrips[j] === postID) {
						listEN.push('<li class="current">' + allData.titles[postsByTrips[j]].EN + '</li>');
						listJA.push('<li class="current">' + allData.titles[postsByTrips[j]].JA + '</li>');
					} else {
						listEN.push('<li><a href="' + allData.posts[postsByTrips[j]].LinkEN + '">' + allData.titles[postsByTrips[j]].EN + '</a></li>');
						listJA.push('<li><a href="' + allData.posts[postsByTrips[j]].LinkJA + '">' + allData.titles[postsByTrips[j]].JA + '</a></li>');
					}
				}
				boxContentJA.push([
					'<p>この記事は<b>【' + allData.trips[tripID].JA + '】</b>旅行の一部を含む</p>',
					'<ol>',
						listJA.joinHtml('\n'),
					'</ol>',
				].joinHtml('\n'));
				boxContentEN.push([
					'<p>This post is part of <b>' + allData.trips[tripID].EN + '</b> trip that also include:</p>',
					'<ol>',
						listEN.joinHtml('\n'),
					'</ol>',
				].joinHtml('\n'));
				// console.log(list);
			}

			boxContentEN.push("<p>Labels: " + fromKeywordsToHtml(allData.keywords[postID].EN, ", ") + "</p>");
			boxContentJA.push("<p>ラベル：" + fromKeywordsToHtml(allData.keywords[postID].JA, japaneseComma) + "</p>");

			boxContentEN.push('<p>Note: The text may not be accurate because I automatically translated it from Japanese. Please bear with me until I find the time to review the translation, thank you.</p>');
			//htmlJA.push('<h1>' + allData.titles[postID].JA + '</h1>');
			//htmlEN.push('<h1>' + allData.titles[postID].EN + '</h1>');
			////////////////////////////////////
			// Adding the period and kids age //
			////////////////////////////////////
			htmlJA.push(allData.trips[postData.Trip].PeriodJA + japaneseComma + allData.trips[postData.Trip].KidsAgeJA + "<br><br>");
			htmlEN.push(allData.trips[postData.Trip].PeriodEN + ", " + allData.trips[postData.Trip].KidsAgeEN + "<br><br>");


			// htmlEN.push(fromKeywordsToHtml(allData.keywords[postID].EN, " *** "));
			// console.log(allData.keywords[postID].EN, " *** ");


			for (j = 2; j < 100; j++) {
				lineJA = postContent["B" + j];
				lineEN = postContent["C" + j];
				if (lineJA) {
					if (lineJA.match(/^http/)) {
						if (readyForCopyandPaste) {
							htmlJA.push([
								'<a href="' + lineJA + '" imageanchor="1">',
									'<img class="picture" src="' + lineJA + '" width="100%" />',
								'</a>'
							].join(''));
							htmlEN.push([
								'<a href="' + lineJA + '" imageanchor="1">',
									'<img class="picture" src="' + lineJA + '" width="100%" />',
								'</a>'
							].join(''));
						} else {
							htmlJA.push('<p>' + lineJA + '</p>');
							htmlEN.push('<p>' + lineJA + '</p>');
						}
						if (!imageFound) {
							imageFound = true;
							htmlJA.push("<!--more-->");
							htmlEN.push("<!--more-->");
						}
						// Need to add 
					} else {
						if (lineJA) {
							if (!lineEN) {
								console.log("[" + allData.titles[postID].EN + "] English missing " + lineJA);
							} else {
								if (lineJA.match(/^\*\*/)) {
									htmlJA.push("<h3>" + lineJA.replace(/^\*\*/, '') + "</h3>");
									htmlEN.push("<h3>" + lineEN.replace(/^\*\*/, '') + "</h3>");
								} else if (lineJA.match(/^\*/)) {
									htmlJA.push("<h2>" + lineJA.replace(/^\*/, '') + "</h2>");
									htmlEN.push("<h2>" + lineEN.replace(/^\*/, '') + "</h2>");
								} else {
									htmlJA.push(lineJA + "<br><br>");
									htmlEN.push(lineEN + "<br><br>");
								}
							}
						}
					}

				}
			}
		}
		var htmlForFileJA = [
			headerJA,
			'<div class="ja">',
				'<div id="boxTop1">',
					boxContentJA.joinHtml(),
				'</div>',
				htmlJA.joinHtml(),
				'<div class="boxBottom">',
					boxContentJA.joinHtml(),
				'</div>',
			'</div>',
		].joinHtml();
		var htmlForFileEN = [
			headerEN,
			'<div class="en">',
				'<div id="boxTop1">',
					boxContentEN.joinHtml(),
				'</div>',
				htmlEN.joinHtml(),
				'<div class="boxBottom">',
					boxContentEN.joinHtml(),
				'</div>',
			'</div>',
		].joinHtml();
		if (postData.Ready === "Yes") {
			fs.writeFile(destinationFolder + counter.pad(3) + 'J.' + fileNameJA, htmlForFileJA, error);
			fs.writeFile(destinationFolder + counter.pad(3) + 'E.' + fileNameEN, htmlForFileEN, error);
			counter++;
		}
	}
}

function urlToFilename(url) {
	url = url.replace(/^http.?:\/\/[^/]*\//, '');
	url = url.replace(/\//g, '.');
	return url;
}

function createCommonStuff() {
	var html = [],
		i,
		htmlFlagSmall = [],
		countries = allData.ordered.countries;

	for (i = 0; i < countries.length; i++) {
		htmlFlagSmall.push(flagSmall(
			allData.countries[countries[i]].EN,
			allData.countries[countries[i]].JA
		));
	}

	var htmlFlagLarge = [];
	for (i = 0; i < countries.length; i++) {
		//console.log(countries[i]);
		htmlFlagLarge.push(sectionFlag(
			allData.countries[countries[i]].EN,
			allData.countries[countries[i]].JA
		));
	}

	var htmlPosts = [];
	for (i = 0; i < posts.length; i++) {
		//console.log(countries[i]);
		htmlPosts.push(sectionPost(posts[posts.length - 1 - i]));
	}

	html.push([
		"<link rel='stylesheet' type='text/css' href='css/app.css'>",
		"<h1>cp-flagsmall-container</h1>",
		"<div class='cp-flagsmall-container'>",
			htmlFlagSmall.joinHtml(),
		"</div>",
		"<h1>cp-postlinks-container</h1>",
		"<div class='cp-postlinks-container'>",
			htmlFlagLarge.joinHtml(),
		"</div>",
		"<h1>cp-postlinks-container</h1>",
		"<div class='cp-postlinks-container'>",
			htmlPosts.joinHtml(),
		"</div>",
	].joinHtml());

	var destination = "./build/development/commonStuff.html";
	fs.writeFile(destination, html.joinHtml(), function (err) {
		if (err) {
			return console.log(err);
		}
		console.log("The file " + destination + " has been saved!");
	});
}

function flagSmall(countryEn, countryJa) {
	return [
		"<div class='flag-small'>",
			"<a href='/search/label/{countryEn}' title='{countryJa}{japaneseSpace}{countryEn}'>",
				"<span>{countryEn}</span>",
				flag(countryEn),
			"</a>",
		"</div>",
	].joinHtml().supplant({
		countryEn: countryEn,
		countryJa: countryJa,
		japaneseSpace: japaneseSpace
	});
}

function sectionFlag(countryEn, countryJa) {
	return [
		"<div class='cp-postlink sectionFlag'>",
			"<a href='/search/label/{countryEn}' title='{countryJa}{japaneseSpace}{countryEn}'>",
				"<span class='wrap'>",
					"<span class='image'>",
						flag(countryEn),
					"</span>",
				"</span>",
				"<span class='text'>",
					"<span class='title'>",
						"{countryJa}{japaneseSpace}{countryEn}",
					"</span>",
				"</span>",
			"</a>",
		"</div>",
	].joinHtml().supplant({
		countryEn: countryEn,
		countryJa: countryJa,
		japaneseSpace: japaneseSpace
	});
}

function sectionPost(post) {
	return [
		"<div class='cp-postlink sectionPost'>",
			"<a href='{postHref}' title='{postTitleEn}'>",
				"<span class='wrap'>",
					"<span class='image'>",
						"<img src='{postImageUrl}'>",
					"</span>",
				"</span>",
				"<span class='text'>",
					"<span class='title'>",
						post.title,
					"</span>",
				"</span>",
			"</a>",
		"</div>",
	].joinHtml().supplant({
		postHref: post.href,
		postTitleEn: post.titleEn,
		postImageUrl: post.imageUrl,
	});
}

function createObject(data, type, strID, str, r) {
	var ID, i, char;
	r = r || {};
	r[type] = r[type] || {};
	r.ordered = r.ordered || {};
	r.ordered[type] = r.ordered[type] || [];
	for (i = 2; i < 100; i++) {
		ID = data[strID + i];
		if (ID) {
			r.ordered[type].push(ID);
			r[type][ID] = r[type][ID] || {};
			// str = "BCDEFGHIJKLMNOPQ";
			for (j = 0; j < str.length; j++) {
				char = str.charAt(j);
				r[type][ID][data[char + 1]] = data[char + i];
			}
		}
		//}
	}
	return r;
}

function flag(countryEn) {
	var html = [];
	if (countryEn === "Austria") {
		html.push([
			"<g fill-rule='evenodd'>",
				"<path d='M640 480H0V0h640z' fill='#fff'></path>",
				"<path d='M640 480H0V319.997h640zm0-319.875H0V.122h640z' fill='#df0000'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Hungary") {
		html.push([
			"<g fill-rule='evenodd'>",
				"<path fill='#fff' d='M640.006 479.994H0V0h640.006z'/>",
				"<path fill='#388d00' d='M640.006 479.994H0V319.996h640.006z'/>",
				"<path fill='#d43516' d='M640.006 160.127H0V.13h640.006z'/>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Czech Republic") {
		html.push([
			"<defs>",
				"<clipPath id='a'>",
					"<path d='M-74 0h682.67v512H-74z' fill-opacity='.67'></path>",
				"</clipPath>",
			"</defs>",
			"<g clip-path='url(#a)' fill-rule='evenodd' stroke-width='1pt' transform='translate(69.38) scale(.94)'>",
				"<path d='M-74 0h768v512H-74z' fill='#e80000'></path>",
				"<path d='M-74 0h768v256H-74z' fill='#fff'></path>",
				"<path d='M-74 0l382.73 255.67L-74 511.01V0z' fill='#00006f'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Austria") {
		html.push([
			"<g fill-rule='evenodd'>",
				"<path d='M640 480H0V0h640z' fill='#fff'></path>",
				"<path d='M640 480H0V319.997h640zm0-319.875H0V.122h640z' fill='#df0000'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Finland") {
		html.push([
			"<path d='M0 0h640v480H0z' fill='#fff'></path>",
			"<path d='M0 174.545h640v130.909H0z' fill='#003580'></path>",
			"<path d='M175.455 0h130.909v480H175.455z' fill='#003580'></path>",
		].joinHtml());
	} else if (countryEn === "France") {
		html.push([
			"<g fill-rule='evenodd' stroke-width='1pt'>",
				"<path d='M0 0h640v480H0z' fill='#fff'></path>",
				"<path d='M0 0h213.337v480H0z' fill='#00267f'></path>",
				"<path d='M426.662 0H640v480H426.662z' fill='#f31830'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Germany") {
		html.push([
			"<path d='M0 320h640v160.002H0z' fill='#ffce00'></path>",
			"<path d='M0 0h640v160H0z'></path>",
			"<path d='M0 160h640v160H0z' fill='#d00'></path>",
		].joinHtml());
	} else if (countryEn === "Iceland") {
		html.push([
			"<defs>",
				"<clipPath id='a'>",
					"<path fill-opacity='.67' d='M0 0h640v480H0z'></path>",
				"</clipPath>",
			"</defs>",
			"<g fill-rule='evenodd' stroke-width='0' clip-path='url(#a)'>",
				"<path fill='#003897' d='M0 0h666.67v480H0z'></path>",
				"<path d='M0 186.67h186.67V0h106.67v186.67h373.33v106.67H293.34v186.67H186.67V293.34H0V186.67z' fill='#fff'></path>",
				"<path d='M0 213.33h213.33V0h53.333v213.33h400v53.333h-400v213.33H213.33v-213.33H0V213.33z' fill='#d72828'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Ireland") {
		html.push([
			"<g fill-rule='evenodd' stroke-width='1pt'>",
				"<path fill='#fff' d='M0 0h639.995v480.004H0z'></path>",
				"<path fill='#009A49' d='M0 0h213.334v480.004H0z'></path>",
				"<path fill='#FF7900' d='M426.668 0h213.334v480.004H426.668z'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Italy") {
		html.push([
			"<g fill-rule='evenodd' stroke-width='1pt'>",
				"<path d='M0 0h640v479.997H0z' fill='#fff'></path>",
				"<path d='M0 0h213.331v479.997H0z' fill='#009246'></path>",
				"<path d='M426.663 0h213.331v479.997H426.663z' fill='#ce2b37'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Poland") {
		html.push([
			"<g fill-rule='evenodd'>",
				"<path d='M640 480H0V0h640z' fill='#fff'></path>",
				"<path d='M640 480H0V240h640z' fill='#dc143c'></path>",
			"</g>",
		].joinHtml());
	} else if (countryEn === "Slovakia") {
		html.push([
			"<path d='M0 0h640v480H0z' fill='#ee1c25'></path>",
			"<path d='M0 0h640v320H0z' fill='#0b4ea2'></path>",
			"<path d='M0 0h640v160H0z' fill='#fff'></path>",
			"<path d='M233.004 370.8c-43.025-20.724-104.568-61.858-104.568-143.226 0-81.37 3.89-118.374 3.89-118.374h201.358s3.891 37.005 3.891 118.374c0 81.368-61.543 122.502-104.571 143.226z' fill='#fff'></path>",
			"<path d='M233.004 360c-39.472-19.013-95.934-56.75-95.934-131.4 0-74.651 3.57-108.6 3.57-108.6H325.37s3.57 33.95 3.57 108.6c0 74.65-56.462 112.387-95.936 131.4z' fill='#ee1c25'></path>",
			"<path d='M241.446 209.027c10.688.173 31.54.591 50.109-5.622 0 0-.49 6.645-.49 14.385 0 7.742.49 14.386.49 14.386-17.032-5.7-38.064-5.819-50.108-5.666v41.231h-16.883V226.51c-12.044-.153-33.076-.034-50.108 5.665 0 0 .49-6.644.49-14.386 0-7.74-.49-14.384-.49-14.384 18.568 6.213 39.42 5.795 50.108 5.622v-25.894c-9.741-.087-23.779.378-39.65 5.69 0 0 .49-6.645.49-14.386 0-7.74-.49-14.385-.49-14.385 15.848 5.303 29.868 5.776 39.607 5.691-.501-16.398-5.278-37.065-5.278-37.065s9.831.767 13.761.767c3.934 0 13.763-.767 13.763-.767s-4.776 20.667-5.277 37.064c9.739.084 23.759-.388 39.606-5.691 0 0-.49 6.644-.49 14.385 0 7.74.49 14.385.49 14.385-15.87-5.311-29.909-5.776-39.65-5.69v25.894z' fill='#fff'></path>",
			"<path d='M233 263.275c-19.878 0-30.525 27.575-30.525 27.575s-5.907-13.075-22.125-13.075c-10.973 0-19.06 9.761-24.2 18.8C176.113 328.34 207.964 347.941 233 360c25.039-12.06 56.91-31.657 76.875-63.425-5.14-9.039-13.227-18.8-24.2-18.8-16.219 0-22.15 13.075-22.15 13.075S252.879 263.275 233 263.275z' fill='#0b4ea2'></path>",
		].joinHtml());
	} else if (countryEn === "Spain") {
		html.push([
			"<path d='M0 0h640v480H0z' fill='#c60b1e'></path>",
			"<path d='M0 120h640v240H0z' fill='#ffc400'></path>",
		].joinHtml());
	} else if (countryEn === "United Kingdom") {
		html.push([
			"<defs>",
				"<clippath id='a'>",
					"<path d='M-85.333 0h682.67v512h-682.67z' fill-opacity='.67'></path>",
				"</clippath>",
			"</defs>",
			"<g clip-path='url(#a)'  transform='translate(80) scale(.94)'>",
				"<g stroke-width='1pt'>",
					"<path d='M-256 0H768.02v512.01H-256z' fill='#006'></path>",
					"<path d='M-256 0v57.244l909.535 454.768H768.02V454.77L-141.515 0H-256zM768.02 0v57.243L-141.515 512.01H-256v-57.243L653.535 0H768.02z' fill='#fff'></path>",
					"<path d='M170.675 0v512.01h170.67V0h-170.67zM-256 170.67v170.67H768.02V170.67H-256z' fill='#fff'></path>",
					"<path d='M-256 204.804v102.402H768.02V204.804H-256zM204.81 0v512.01h102.4V0h-102.4zM-256 512.01L85.34 341.34h76.324l-341.34 170.67H-256zM-256 0L85.34 170.67H9.016L-256 38.164V0zm606.356 170.67L691.696 0h76.324L426.68 170.67h-76.324zM768.02 512.01L426.68 341.34h76.324L768.02 473.848v38.162z' fill='#c00'></path>",
			    "</g>",
		    "</g>",
		].joinHtml());
	}
	return [
		"<svg viewbox='0 0 640 480' xmlns='http://www.w3.org/2000/svg'>",
			html.joinHtml(),
		"</svg>",
	].joinHtml();
}

/*

doctype html
head
	meta(name="version" content=pkg.version)
	meta(charset='UTF-8')
	meta(name='viewport' content='width=device-width, initial-scale=1.0')
	title Blog
	block livereload
		script(src='http://localhost:35729/livereload.js')
	block style
		link(href='css/app.css' rel='stylesheet' type='text/css')
	script.
		document.documentElement.className = document.documentElement.className.replace(/no-js/, "yes-js");
		document.documentElement.className = document.documentElement.className + (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ? " yes-touch" : " no-touch");
		document.documentElement.className = document.documentElement.className + (/iPhone/i.test(navigator.userAgent) ? " yes-iPhone" : " no-iPhone");
	block script
body
	h1 cp-flagsmall-container 
	.cp-flagsmall-container
		each country in countries
			+flagSmall(country)

	h1 cp-postlinks-container 
	.cp-postlinks-container
		each post in posts.reverse()
			+sectionPost(post)

	h1 Large flags 
	.cp-postlinks-container
		each country in countries
			+sectionFlag(country)
*/
