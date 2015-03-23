/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Product = Class.create(anyLib.Application.Controller, {
	groupAction: function() {
		var sliderRequest = new anyLib.Application.Controller.Request();

		sliderRequest.setModule("default");
		sliderRequest.setController("product");
		sliderRequest.setAction("group-slider");
		sliderRequest.setNamespace(Weber.Application);

		Weber.application.dispatch(sliderRequest);
	},
	overviewAction: function() {
	},
	toolFinderAction: function() {
		var data = $("perfect-tool-finder-data").innerHTML.evalJSON();

		this.getView().assign("productList", data.Items);
		this.getView().assign("filterList", data.FilterItems);
		this.getView().assign("featureList", data.FeatureItems);

		var grillTypeSelect = $("grill-type");
		var grillTypeResult = grillTypeSelect.next(".result");

		this.getView().assign("grillTypeSelect", grillTypeSelect);
		this.getView().assign("grillTypeOutput", grillTypeResult.down(".output"));
		this.getView().assign("grillTypeResetTrigger", grillTypeResult.down(".reset-trigger"));

		var pagingContainer = $("perfect-tool-finder-paging");

		this.getView().assign("pagingContainer", pagingContainer);
		this.getView().assign("pagesContainer", pagingContainer.down(".pages"));

		var selectionResult = $("selection-result");

		this.getView().assign("selectionResultGrillOne", selectionResult.down(".grill-one"));
		this.getView().assign("selectionResultGrillTwo", selectionResult.down(".grill-two"));
		this.getView().assign("selectionResultResetTrigger", selectionResult.down(".reset-trigger"));
		this.getView().assign("selectionResultComparisonTrigger", selectionResult.down(".trigger-comparison"));

		this.getView().assign("resultContainer", $("perfect-tool-finder-result"));
		this.getView().assign("filterContainer", $("perfect-tool-finder-filter-container"));

		this.getView().assign("comparisonTargetPage", $("perfect-tool-finder-comparison-target"));
	},
	comparisonAction: function() {
		this.getView().assign("grillOne", $("grill-one"));
		this.getView().assign("grillTwo", $("grill-two"));

		var imageOne = $$(".product-detail-grill-one");
		var imageTwo = $$(".product-detail-grill-two");

		if (imageOne.length > 0)
			this._dispatchZoom(imageOne.first());

		if (imageTwo.length > 0)
			this._dispatchZoom(imageTwo.first());

		this._dispatchRelatedSlider();

		this._dispatchDetailSlider();
	},
	detailAction: function() {
		this._dispatchRelatedSlider();

		this._dispatchDetailSlider();

		this._dispatchZoom($$(".product-detail .display").first());
	},
	zoomAction: function() {
		this.getView().assign("productDetailImage", this.getRequest().getParameters().get("productDetailImage"));
	},
	groupSliderAction: function() {
		this.getView().assign("sliderContainer", $$(".slider-container").first());
	},
	relatedSliderAction: function() {
		if (this.getRequest().getParameters().hasKey("container") === false)
			throw new anyLib.Exception.NullReference(this, "container", "The \"container\" parameter is required.");

		this.getView().assign("sliderContainer", this.getRequest().getParameters().getValue("container"));
	},

	_dispatchZoom: function(element) {
		var zoomRequest = new anyLib.Application.Controller.Request();

		zoomRequest.setAction("zoom");
		zoomRequest.setModule("default");
		zoomRequest.setController("product");
		zoomRequest.setNamespace(Weber.Application);

		zoomRequest.getParameters().add("productDetailImage", element);

		Weber.application.dispatch(zoomRequest);
	},
	_dispatchRelatedSlider: function() {
		var relatedSliderContainerList = $$(".related-slider-container");

		if (relatedSliderContainerList.length == 0)
			return;

		var sliderRequest = new anyLib.Application.Controller.Request();

		sliderRequest.setModule("default");
		sliderRequest.setController("product");
		sliderRequest.setAction("related-slider");
		sliderRequest.setNamespace(Weber.Application);

		relatedSliderContainerList.each(function(relatedSliderContainer) {
			sliderRequest.getParameters().set("container", relatedSliderContainer);

			Weber.application.dispatch(sliderRequest);
		});
	},
	_dispatchDetailSlider: function() {
		if ($$(".slider-container").length == 0)
			return;

		var detailSliderRequest = new anyLib.Application.Controller.Request();

		detailSliderRequest.setModule("default");
		detailSliderRequest.setController("product");
		detailSliderRequest.setAction("group-slider");
		detailSliderRequest.setNamespace(Weber.Application);

		Weber.application.dispatch(detailSliderRequest);

		this.getView().assign("sliderItems", $$(".slider-item"));
	}
});
