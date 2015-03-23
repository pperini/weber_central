/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Dealer = Class.create(anyLib.Application.Controller, {
	onlineAction: function() {
		this.getView().assign("bannerElements", $$(".online-dealer-search-list"));
	},

	defaultAction: function() {
		var settings = $("dealer-search-map-settings").innerHTML.evalJSON();

		settings.StartZoom = parseInt(settings.StartZoom);
		settings.StartLatitude = settings.StartLatitude.gsub(",", ".");
		settings.StartLongitude = settings.StartLongitude.gsub(",", ".");
		settings.ResultLatitude = settings.ResultLatitude.gsub(",", ".");
		settings.ResultLongitude = settings.ResultLongitude.gsub(",", ".");

		if (settings["SearchActive"] != 1) {
			this.getView().assign("searchAktive", true);
		}

		var searchResultList = $$(".dealer-search-result-list").first();

		this.getView().assign("settings", settings);
		this.getView().assign("mapContainer", $("dealer-search-map"));
		this.getView().assign("formElement", $$(".dealer-search-form").first());
		this.getView().assign("submitButton", $$(".start-dealer-search").first());

		this.getView().assign("searchField", $("search"));

		if ($$(".show-legend").length >= 1) {
			this.getView().assign("goToLegend", $$(".show-legend").first());
		}

		this.getView().assign("distanceSelect", $("radius").up(".select"));

		if (searchResultList) {
			this.getView().assign("specialFilter", $$(".dealer-search-filter-special .checkbox"));
			this.getView().assign("categoryFilter", $$(".dealer-search-filter-category .checkbox"));

			this.getView().assign("searchResultContainer", searchResultList);
			this.getView().assign("searchResultItems", searchResultList.select(".dealer-search-result-item"));
		}
	},

	adWordsDetailAction: function() {
		var dataContainer = $$(".product-search-information");

		var productInformation = {
			ean: 0,
			articleName: "",
			articleNumber: 0
		};

		if (dataContainer.length > 0)
			productInformation = dataContainer.first().innerHTML.evalJSON();

		this.getView().assign("information", productInformation);

		this.getView().assign("moreTrigger", $$(".foldout-dealer-list").first());
		this.getView().assign("containerList", $$(".online-dealer-ad-words-list"));
		this.getView().assign("targetElement", $$(".product-dealer-search").first());

		this.getView().assign("search", this.getRequest().getParameters().getValue("search"));
	},

	adWordsOverviewAction: function() {
		var dataContainer = $$(".product-search-information");

		var productInformation = {
			ean: 0,
			articleName: "",
			articleNumber: 0
		};

		if (dataContainer.length > 0)
			productInformation = dataContainer.first().innerHTML.evalJSON();

		this.getView().assign("information", productInformation);

		this.getView().assign("moreTrigger", $$(".foldout-dealer-list").first());
		this.getView().assign("containerList", $$(".online-dealer-ad-words-list"));
		this.getView().assign("targetElement", $$(".adwords-dealer-overview").first());

		this.getView().assign("search", this.getRequest().getParameters().getValue("search"));
	},

	newDesignAction: function() {
		var defaultActionRequest = new anyLib.Application.Controller.Request();
		defaultActionRequest.setModule("default");
		defaultActionRequest.setAction("default");
		defaultActionRequest.setController("dealer");
		defaultActionRequest.setNamespace(Weber.Application);
		
		Weber.application.dispatch(defaultActionRequest);
		
		this.getView().assign("columns", $$(".dealer-search-new-design-result-column"));
	}
});
