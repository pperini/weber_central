/**
 * @package Weber.Tracking
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Tracking");

Weber.Tracking.Events = {
	PageView: "weber:page-view",

	DealerSearch: {
		StartSearch: "weber:dealer-search-start-search",
		ClickMarker: "weber:dealer-search-click-marker",
		FilterDistance: "weber:dealer-search-filter-distance"
	},

	Livecourses: {
		StartSearch: "weber:livecourses-start-search",
		ClickMarker: "weber:livecourses-click-marker",
		FilterDistance: "weber:livecourses-filter-distance"
	},

	OnlineDealer: {
		ClickBanner: "weber:online-dealer-click-banner"
	},

	AdWords: {
		ClickBanner: "weber:ad-words-dealer-click-banner"
	}
};
