document.on(Weber.Tracking.Events.PageView, function() {
	var targetElement = $("website-information");

	if (!targetElement)
		return;

	var template = new Template('<iframe src="http://4289619.fls.doubleclick.net/activityi;src=4289619;type=weber431;cat=#{cat};ord=#{ord}?" width="1" height="1" frameborder="0" style="display:none"></iframe>');

	var currentUrl = new anyLib.Url(window.location.toString());

	var lastPathPart = decodeURIComponent(currentUrl.getPath().getPath().getAll().last());

	var trackingData = {
		"/": "homep992",
		"/Produktwelt.aspx": "produ485",
		"/Rund-ums-Grillieren.aspx": "rundu230",
		"/Rezepte.aspx": "rezep342",
		"/Service.aspx": "servi600",
		"/Unternehmen.aspx": "unter267",
		"/Premium-Partner-vor-Ort.aspx": "haend422",
		"/Online-Händler.aspx": "haend302",
		"/Produktwelt.aspx": "produ485",
		"/Produktwelt.aspx": "produ485"
	}

	var data = trackingData[lastPathPart];

	if (typeof(data) == "undefined")
		return;

	targetElement.insert({
		after: template.evaluate({
			cat: data,
			ord: (Math.random() * 10000000000000).toString()
		})
	});
});
