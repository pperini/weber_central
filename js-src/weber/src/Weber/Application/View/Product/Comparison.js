/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Url
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Product");

Weber.Application.View.Product.Comparison = Class.create(anyLib.Application.View, {
	grillOne: null,
	grillTwo: null,

	render: function() {
		var me = this;

		var selectionChange = function() {
			var url = new anyLib.Url(window.location.href.toString());
			url.getQueryString().getItems().clear();

			url.getQueryString().addItem("GrillOne", me.grillOne.instance.getValue());
			url.getQueryString().addItem("GrillTwo", me.grillTwo.instance.getValue());

			window.location.href = url.getParsed();
		};

		this.grillOne.instance.onValueChanged.add(selectionChange);
		this.grillTwo.instance.onValueChanged.add(selectionChange);
	}
});