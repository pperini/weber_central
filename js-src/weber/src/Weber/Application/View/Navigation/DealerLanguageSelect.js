/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Url
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Navigation");

Weber.Application.View.Navigation.DealerLanguageSelect = Class.create(anyLib.Application.View, {
	languageItems: [],
	linkContainerMap: {},
	currentActiveItem: null,

	render: function() {
		var me = this;

		var currentUrl = new anyLib.Url(window.location.href.toString());

		this.languageItems.each(function(element) {
			var language = element.className.split(" ").without("active").first();

			if (typeof(me.linkContainerMap[language]) == "undefined") {
				me.linkContainerMap[language] = {
					linkElement: element,
					containerElement: $$(".dealer-flag-item.dealer-" + language).first()
				};
			}

			if (!me.linkContainerMap[language].containerElement.hasClassName("hidden"))
				me.currentActiveItem = language;

			element.on("click", function(event) {
				if (!me.linkContainerMap[language].containerElement.hasClassName("hidden"))
					return;

				event.preventDefault();

				me.linkContainerMap[me.currentActiveItem].linkElement.removeClassName("active");
				me.linkContainerMap[me.currentActiveItem].containerElement.addClassName("hidden");

				me.linkContainerMap[language].linkElement.addClassName("active");
				me.linkContainerMap[language].containerElement.removeClassName("hidden");

				me.currentActiveItem = language;
			});
		});

		me.linkContainerMap[me.currentActiveItem].containerElement.select("a").each(function(linkElement) {
			var url = new anyLib.Url(linkElement.readAttribute("href"));

			linkElement.writeAttribute("href", url.getPath().getFullPath());
		});
	}
});

