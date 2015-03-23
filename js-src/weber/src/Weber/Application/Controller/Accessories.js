/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Accessories = Class.create(anyLib.Application.Controller, {
	groupAction: function() {
		this.getView().assign("grillSelectionSelect", $("grill-selection"));

		var sliderRequest = new anyLib.Application.Controller.Request();

		sliderRequest.setModule("default");
		sliderRequest.setController("product");
		sliderRequest.setAction("group-slider");
		sliderRequest.setNamespace(Weber.Application);

		Weber.application.dispatch(sliderRequest);
	},
	overviewAction: function() {
		this.getView().assign("grillSelectionSelect", $("grill-selection"));
	},
	detailAction: function() {
		var relatedSliderContainerList = $$(".related-slider-container");

		if (relatedSliderContainerList.length > 0) {
			var sliderRequest = new anyLib.Application.Controller.Request();

			sliderRequest.setModule("default");
			sliderRequest.setController("product");
			sliderRequest.setAction("related-slider");
			sliderRequest.setNamespace(Weber.Application);

			relatedSliderContainerList.each(function(relatedSliderContainer) {
				sliderRequest.getParameters().set("container", relatedSliderContainer);

				Weber.application.dispatch(sliderRequest);
			});
		}

		this.getView().assign("productDetailImage", $$(".product-detail .display").first());
	}
});
