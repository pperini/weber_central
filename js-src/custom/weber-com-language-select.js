document.on(Weber.Tracking.Events.PageView, function() {
	var layer = $("weber-com-language-selection-container");
	
	if (!layer)
		return;
	
	var no = "false";
	var yes = "true";
	var tokenName = "wdotc";
	var redirectTokenName = "webercomredirect";
	
	var saveState = yes;
	
	var cookieJar = new anyLib.CookieJar();
	var currentUrl = new anyLib.Url(window.location.toString());
	
	var queryStringItems = currentUrl.getQueryString().getItems();
	
	var hasCookieToHide = (cookieJar.has(tokenName) && cookieJar.get(tokenName) == yes);
	var hasCookieToRedirect = (cookieJar.has(redirectTokenName) && cookieJar.get(redirectTokenName) != "");
	var hasQueryStringToShow = (queryStringItems.hasKey(tokenName) && queryStringItems.get(tokenName) == yes);

	if ((queryStringItems.hasKey(tokenName) && queryStringItems.get(tokenName) == no) && hasCookieToRedirect) {
		hasCookieToHide = false;
		hasCookieToRedirect = false;
		
		cookieJar.set(tokenName, no);
		cookieJar.set(redirectTokenName, "");
	}
	
	if (hasCookieToHide && hasCookieToRedirect) {
		window.location = cookieJar.get(redirectTokenName);
		
		return;
	}
	
	if (hasCookieToHide || !hasQueryStringToShow) {
		layer.remove();

		return;
	}
	
	var checkboxElement = layer.down(".item-checkbox .checkbox");
	
	var checkbox = new Weber.Form.Element.CheckBox();

	checkbox.setElement(checkboxElement);

	checkbox.onValueChanged.add(function() {
		saveState = checkbox.getIsChecked() ? yes : no;
		
		cookieJar.set(tokenName, saveState);
	});
	
	if (Weber.Settings.LanguageSelection.LinkDE.indexOf("http") != -1) {
		layer.down("a.weber-com-select-de").href = Weber.Settings.LanguageSelection.LinkDE;
	}
	
	if (Weber.Settings.LanguageSelection.LinkAT.indexOf("http") != -1) {
		layer.down("a.weber-com-select-at").href = Weber.Settings.LanguageSelection.LinkAT;
	}
	
	if (Weber.Settings.LanguageSelection.LinkCH.indexOf("http") != -1) {
		layer.down("a.weber-com-select-ch-de").href = Weber.Settings.LanguageSelection.LinkCH;
	}
	
	if (Weber.Settings.LanguageSelection.LinkCHFR.indexOf("http") != -1) {
		layer.down("a.weber-com-select-ch-fr").href = Weber.Settings.LanguageSelection.LinkCHFR;
	}
	
	layer.show();
	
	var linkElement = null;
	
	if (currentUrl.getTopLevelDomain() == "de" || currentUrl.getTopLevelDomain() == "dev") {
		linkElement = layer.down("a.weber-com-select-de");
	}
	
	if (currentUrl.getTopLevelDomain() == "at") {
		linkElement = layer.down("a.weber-com-select-at");
	}
	
	if (currentUrl.getTopLevelDomain() == "ch") {
		linkElement = layer.down("a.weber-com-select-ch-de");
	}
	
	var chContainer = layer.down(".weber-com-language-selection-item.weber-com-select-ch");
	
	chContainer.on("touchstart", function() {
		chContainer.addClassName("hover");
	});
	
	layer.select("a").each(function(element) {
		element.on("click", function(event) {
			Event.stop(event);
			
			var targetElement = Event.findElement(event, "a");

			cookieJar.set(tokenName, saveState);
			cookieJar.set(redirectTokenName, "");
			
			if (linkElement != null && targetElement == linkElement) {
				new Effect.Fade(layer, {
					duration: 0.4
				});
				
				return;
			}
			
			cookieJar.set(redirectTokenName, targetElement.readAttribute("href"));
			
			window.location = cookieJar.get(redirectTokenName);
		});
	});
});
