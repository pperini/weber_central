document.on(Weber.Tracking.Events.PageView, function() {
	var cookieName = "moawawc";

	var cookieJar = new anyLib.CookieJar();
	var currentUrl = new anyLib.Url(window.location.href.toString());

	var cookieJarContainsKey = cookieJar.has(cookieName);
	var urlContainsKey = currentUrl.getQueryString().getItems().hasKey("aw");

	if (!urlContainsKey && !cookieJarContainsKey)
		return;

	var eventAction = "aw-cont";

	if (urlContainsKey && !cookieJarContainsKey)
		eventAction = "aw-in";

	var eventValue = "-";

	if (urlContainsKey) {
		try {
			var referringUrl = new anyLib.Url(document.referrer.toString());

			if (referringUrl.getQueryString().getItems().hasKey("q"))
				eventValue = referringUrl.getQueryString().getItems().getValue("q");
		} catch (e) {
		}
	}

	if (cookieJarContainsKey) {
		eventValue = cookieJar.get(cookieName);
	}

	cookieJar.set(cookieName, eventValue, 1);

	var trackingData = new Weber.Tracking.Data();

	trackingData.setValue(eventValue);
	trackingData.setAction(eventAction);
	trackingData.setLabel(currentUrl.getParsed(new Template('#{path}#{rawQueryString}')));

	Weber.tracking.trigger(trackingData);

	var actionRequest = new anyLib.Application.Controller.Request();

	var action = "ad-words-overview";

	if (Weber.initialRoutingInformation.action == "detail")
		action = "ad-words-detail";

	actionRequest.setAction(action);
	actionRequest.setModule("default");
	actionRequest.setController("dealer");
	actionRequest.setNamespace(Weber.Application);
	actionRequest.getParameters().add("search", eventValue);

	Weber.application.dispatch(actionRequest);
});
