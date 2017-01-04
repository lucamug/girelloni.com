var 凸 = (function (凸) {

	凸.remove = function remove(elem) {
		return elem.parentNode.removeChild(elem);
	};

	凸.language = function language(href) {
		href = href || 凸.href();
		if (href.match(/^http:\/\/ja/)) {
			return "ja";
		} else {
			return "en";
		}
	};

	凸.newLanguageHref = function newLanguageHref(newLanguage, href) {
		href = href || 凸.href();
		newLanguage = newLanguage || "en";
		newLanguage = newLanguage === "en" ? "www" : newLanguage;
		return href.replace(/^(http:\/\/)[^.]*/, "$1" + newLanguage);
	};

	凸.languageText = function languageText(language) {
		if (language === "en") {
			return [
				"<span>English</span>",
			].join('');
		} else {
			return [
				"<span>Japanese 日本語</span>",
			].join('');
		}
	};


	凸.pathname = function pathname(pathname) {
		return pathname || document.location.pathname;
	};
	凸.href = function pathname(href) {
		return href || document.location.href;
	};
	凸.search = function search(search) {
		return search || document.location.search;
	};

	凸.createLanguageHtml = function createLanguageHtml(href) {
		var newHref, title, presentLanguage = 凸.language(href);
		if (presentLanguage) {
			if (presentLanguage === "en") {
				newHref = 凸.newLanguageHref("ja", href);
				title = 凸.languageText("ja");
			} else {
				newHref = 凸.newLanguageHref("en", href);
				title = 凸.languageText("en");
			}
			return [
				"<div class='languageSwitch'>",
					"<style>",
						".languageSwitch {",
							"position: absolute;",
							"top: 0;",
							"right: 15px;",
							"height: 100%;",
						"}",
						".languageSwitch a {",
							"display: block;",
							"height: 100%;",
						"}",
						".languageSwitch span {",
							"position: relative;",
							"top: 9px;",
							//"right: 30px;",
						"}",
						".languageSwitch svg {",
							"position: relative;",
							"top: 15px;",
							"right: 10px;",
							"fill: #ff9900;",
						"}",
					"</style>",
					"<a href='" + newHref + "'>",
						'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 576 576">',
							'<path d="M240 32c132.5 0 240 87 240 194.2S372.5 420.4 240 420.4c-12.7 0-25.2-.8-37.4-2.3-51.6 51.5-111 60.7-170.6 62v-12.5c32-15.6 58-44.2 58-76.8 0-4.6-.4-9-1-13.4-54.3-35.6-89-90-89-151C0 119 107.5 32 240 32zm258 435.3c0 28 18.2 52.5 46 66V544c-51.6-1.2-99-9-143.6-53-10.5 1.3-21.4 2-32.4 2-47.7 0-91.7-13-126.8-34.6 72.3-.2 140.6-23.4 192.4-65.3 26-21 46.7-45.7 61.2-73.5 15.4-29.4 23.2-60.8 23.2-93.2 0-5.2-.2-10.4-.6-15.6 36.3 30 58.6 71 58.6 116 0 52-30 98.7-77 129.3-.7 3.6-1 7.4-1 11.3z"/>',
						'</svg>',
						title,
					"</a>",
				"</div>",
			].join('');
		} else {
			return false;
		}
	};
	凸.addLanguageButton = function addLanguageButton() {
		if (document.getElementsByClassName("languageSwitch").length > 0) {
			凸.remove(document.getElementsByClassName("languageSwitch")[0]);
		}
		var elem = document.getElementsByClassName("PageList"),
			html = 凸.createLanguageHtml();
		if (html && (elem.length > 0)) {
			elem[0].innerHTML = html + elem[0].innerHTML;
		}
	};
	return 凸;
}(凸 || {}));



凸.addLanguageButton();
凸.remove(document.getElementsByClassName("languageSelector")[0]);

if (document.location.pathname === '/') {
	document.body.className = document.body.className + ' body-toppage';
} else {
	document.body.className = document.body.className + ' body-subpage';
}
