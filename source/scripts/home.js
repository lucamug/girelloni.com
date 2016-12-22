// Commands
//
// node source/scripts/home.js
// node source/scripts/google-spreadsheets-download.js > ./blog.2016-12-20T11:07.json


var fs = require('fs');
var error;

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

var countries = [
	{ id: "austria", en: "Austria", ja: "オーストリア" },
	{ id: "czech-republic", en: "Czech Republic", ja: "チェコ共和国" },
	{ id: "finland", en: "Finland", ja: "フィンランド" },
	{ id: "france", en: "France", ja: "フランス" },
	{ id: "germany", en: "Germany", ja: "ドイツ" },
	{ id: "iceland", en: "Iceland", ja: "アイスランド" },
	{ id: "ireland", en: "Ireland", ja: "アイルランド" },
	{ id: "italy", en: "Italy", ja: "イタリア" },
	{ id: "poland", en: "Poland", ja: "ポーランド" },
	{ id: "slovakia", en: "Slovakia", ja: "スロバキア" },
	{ id: "spain", en: "Spain", ja: "スペイン" },
	{ id: "uk", en: "United Kingdom", ja: "イギリス" },
];
var japaneseSpace = "　";



var s = require('/Users/luca.a.mugnaini/kozuredeyoroppa/blog.2016-12-20T11:07.json');
var posts = [];
for (var i = 0; i < s.orderedSheetsTitle.length; i++) {
	var sheetTitle = s.orderedSheetsTitle[i];
	console.log(sheetTitle);
	var s2 = s.sheets[sheetTitle];
	var titleJA = s2.B1;
	var titleEN = s2.C1;
	var urlJA = s2.B2;
	var urlEN = s2.C2;
	var cover = s2.B7;
	if (urlTest(urlJA)) {} else {
		// console.log(error + ": " + urlJA, sheetTitle);
	}
	if (urlTest(urlEN)) {} else {
		// console.log(error + ": " + urlEN, sheetTitle);
	}
	if (urlTest(urlJA)) {
		// console.log(titleJA, urlJA);
		posts.push({
			title: titleJA,
			titleEn: titleEN,
			href: urlJA,
			imageUrl: cover,
		});
	}
}

function countryExist(country) {
	var i;
	for (i = 0; i < countries.length; i++) {
		//console.log(countries[i]);
		if (country === countries[i].id) {
			return countries[i];
		}
	}
	return false;
}

function urlTest(url) {
	var split;
	if (url) {
		if ((split = url.match(/.*(\d{4})\/(\d{2})\/([^/.]+)\.([^/.]+)\.(en|ja)\.html$/))) {
			if (countryExist(split[4])) {
				return {
					year: split[1],
					month: split[2],
					location: split[3],
					conutry: split[4],
					language: split[5]
				};
			} else {
				error = "Wrong country: " + split[4];
				return false
			}
		} else {
			error = "Wrong url";
			return false;
		}
	} else {
		error = "Missing url";
		return false;
	}
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
		/*
		<svg viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
		  <defs>
		    <clipPath id="a">
		      <path d="M-85.333 0h682.67v512h-682.67z" fill-opacity=".67"></path>
		    </clipPath>
		  </defs>
		  <g clip-path="url(#a)" transform="translate(80) scale(.94)">
		    <g stroke-width="1pt">
		      <path d="M-256 0H768.02v512.01H-256z" fill="#006"></path>
		      <path d="M-256 0v57.244l909.535 454.768H768.02V454.77L-141.515 0H-256zM768.02 0v57.243L-141.515 512.01H-256v-57.243L653.535 0H768.02z" fill="#fff"></path>
		      <path d="M170.675 0v512.01h170.67V0h-170.67zM-256 170.67v170.67H768.02V170.67H-256z" fill="#fff"></path>
		      <path d="M-256 204.804v102.402H768.02V204.804H-256zM204.81 0v512.01h102.4V0h-102.4zM-256 512.01L85.34 341.34h76.324l-341.34 170.67H-256zM-256 0L85.34 170.67H9.016L-256 38.164V0zm606.356 170.67L691.696 0h76.324L426.68 170.67h-76.324zM768.02 512.01L426.68 341.34h76.324L768.02 473.848v38.162z" fill="#c00"></path>
		    </g>
		  </g>
		</svg>
		*/
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


function flagSmall(country) {
	return [
		"<div class='flag-small'>",
			"<a href='/search/label/{countryEn}' title='{countryJa}{japaneseSpace}{countryEn}'>",
				"<span>{countryEn}</span>",
				flag(country.en),
			"</a>",
		"</div>",
	].joinHtml().supplant({
		countryEn: country.en,
		countryJa: country.ja,
		japaneseSpace: japaneseSpace
	});
}

function sectionFlag(country) {
	return [
		"<div class='cp-postlink sectionFlag'>",
			"<a href='/search/label/{countryEn}' title='{countryJa}{japaneseSpace}{countryEn}'>",
				"<span class='wrap'>",
					"<span class='image'>",
						flag(country.en),
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
		countryEn: country.en,
		countryJa: country.ja,
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


function createCommonStuff() {
	var html = [],
		i;

	var htmlFlagSmall = [];
	for (i = 0; i < countries.length; i++) {
		//console.log(countries[i]);
		htmlFlagSmall.push(flagSmall(countries[i]));
	}

	var htmlFlagLarge = [];
	for (i = 0; i < countries.length; i++) {
		//console.log(countries[i]);
		htmlFlagLarge.push(sectionFlag(countries[i]));
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

createCommonStuff();


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
