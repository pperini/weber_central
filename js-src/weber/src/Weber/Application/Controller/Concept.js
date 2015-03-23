/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Concept = Class.create(anyLib.Application.Controller, {
	defaultAction: function() {
		var panelList = $$(".concept-panel-list").first();

		var navigationContainer = panelList.select(".concept-navigation").first();

		this.getView().assign("navigationContainer", navigationContainer);
		this.getView().assign("markerItems", panelList.select(".concept-marker"));
		this.getView().assign("navigationItems", navigationContainer.select("a"));
		this.getView().assign("panelItems", panelList.select(".concept-panel-item"));

		this.getView().assign("useFallback", $$(".use-concept-fallback").length > 0);
	}
});
