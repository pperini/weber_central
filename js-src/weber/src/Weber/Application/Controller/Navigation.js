/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Navigation = Class.create(anyLib.Application.Controller, {
	mainNavigationAction: function() {
		var mainNavigation = $("main-navigation");

		this.getView().assign("navigationContainer", mainNavigation);
		this.getView().assign("navigationItems", mainNavigation.select("li.main"));
	},
	languageSelectAction: function() {
		var languageSelectContainer = $("language-select-container");

		this.getView().assign("mainContainer", $("main-container"));
		this.getView().assign("languageSelectContainer", languageSelectContainer);
		this.getView().assign("languageSelectLink", $$("#head-meta a.language-select").first());
		this.getView().assign("languageSelectContainerCloseLink", languageSelectContainer.down(".language-select-close"));
	},
	communityAction: function() {
		this.getView().assign("languageSelectLink", $$("#head-meta a.community-login").first());
	},
	dealerLanguageSelectAction: function() {
		this.getView().assign("languageItems",$$(".main-navigation-dealer-flags a"));
	}
});
