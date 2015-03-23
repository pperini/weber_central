/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.CookieJar
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Livecourses = Class.create(anyLib.Application.Controller, {
	zipsearchAction: function() {
		var settings = $("dealer-search-map-settings").innerHTML.evalJSON();

		settings.StartZoom = parseInt(settings.StartZoom);
		settings.StartLatitude = settings.StartLatitude.gsub(",", ".");
		settings.StartLongitude = settings.StartLongitude.gsub(",", ".");
		settings.ResultLatitude = settings.ResultLatitude.gsub(",", ".");
		settings.ResultLongitude = settings.ResultLongitude.gsub(",", ".");

		if (settings["SearchActive"] != 1) {
			this.getView().assign("searchAktive", true);
		}

		var searchResultList = $$(".livecourses-resultlist").first();

		this.getView().assign("settings", settings);
		this.getView().assign("mapContainer", $("dealer-search-map"));
		this.getView().assign("formElement", $$(".livecourses-search-form").first());
		this.getView().assign("submitButton", $$(".start-dealer-search").first());

		this.getView().assign("searchField", $("search"));

		this.getView().assign("distanceSelect", $("radius").up(".select"));
		this.getView().assign('month', $("month").up('.select'));
		this.getView().assign('year', $("year").up('.select'));

		if (searchResultList) {
			this.getView().assign("specialFilter", $$(".dealer-search-filter-special .checkbox"));
			this.getView().assign("categoryFilter", $$(".dealer-search-filter-category .checkbox"));

			this.getView().assign("searchResultContainer", searchResultList);
			this.getView().assign("searchResultItems", searchResultList.select(".dealerentry"));
		}

		var messagebox = new Weber.MessageBox();

		if (this.getRequest().getParameters().hasKey("messageBox")) {
			messagebox = this.getRequest().getParameters().get('messageBox');
		}

		this.getView().assign("messageBox", messagebox);

		this.getView().assign("courseMore", $$('.course-more'));
		this.getView().assign("dealerMore", $$('.dealer-more'));
	}
});
