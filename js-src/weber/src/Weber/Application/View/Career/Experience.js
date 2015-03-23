/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Career");

Weber.Application.View.Career.Experience = Class.create(anyLib.Application.View, {
	sliderItems: [],

	render: function() {
		var me = this;
		if (me.sliderItems.length <= 0) {
			return;
		}

		var items = {item: ""};

		var template = new Template('<div class="heading"><h4>'+t('Erlebnisberichte')+'</h4></div> <div class="related-slider-viewport"><div class="related-slider-frame" style="width:1000px;left:0;">#{item}</div></div><div class="arrow left"></div><div class="arrow right"></div>');

		me.sliderItems.each(function(sliderItem) {
			items.item += sliderItem.outerHTML;
			if (me.sliderItems.first() == sliderItem) {
				sliderItem.replace('<div class="related-slider-container assortment career"></div>')
			} else {
				sliderItem.replace('');
			}
		});

		var slider = template.evaluate(items);
		var relatedSliderContainerList = $$(".related-slider-container");

		relatedSliderContainerList.first().innerHTML = slider;

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

		var lightboxRequest = new anyLib.Application.Controller.Request();

		lightboxRequest.setModule("default");
		lightboxRequest.setController("career");
		lightboxRequest.setAction("lightbox-teaser");
		lightboxRequest.setNamespace(Weber.Application);

		lightboxRequest.getParameters().set("lightboxTeasers", $$('.related-slider-item'));

		Weber.application.dispatch(lightboxRequest);
	}
});
