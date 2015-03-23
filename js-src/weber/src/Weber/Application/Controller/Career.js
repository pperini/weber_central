/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Url
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Career = Class.create(anyLib.Application.Controller, {
	locationMapAction: function() {
		this.getView().assign("locationItems", $("locationmap").select(".location"));


		if ($$('.related-slider-item').length > 1) {
			var lightboxRequest = new anyLib.Application.Controller.Request();

			lightboxRequest.setModule("default");
			lightboxRequest.setController("career");
			lightboxRequest.setAction("experience");
			lightboxRequest.setNamespace(Weber.Application);

			lightboxRequest.getParameters().set("sliderItems", $$('.related-slider-item'));

			Weber.application.dispatch(lightboxRequest);
		}
	},

	overviewAction: function() {
		var sliderRequest = new anyLib.Application.Controller.Request();

		sliderRequest.setModule("default");
		sliderRequest.setController("product");
		sliderRequest.setAction("group-slider");
		sliderRequest.setNamespace(Weber.Application);

		Weber.application.dispatch(sliderRequest);


		if ($$('.related-slider-item').length > 1) {
			var lightboxRequest = new anyLib.Application.Controller.Request();

			lightboxRequest.setModule("default");
			lightboxRequest.setController("career");
			lightboxRequest.setAction("experience");
			lightboxRequest.setNamespace(Weber.Application);

			lightboxRequest.getParameters().set("sliderItems", $$('.related-slider-item'));

			Weber.application.dispatch(lightboxRequest);
		}
	},

	lightboxTeaserAction: function() {
		var messagebox = new Weber.MessageBox();
		var lightboxTeaser = $$('.lightbox-teaser');

		if (this.getRequest().getParameters().hasKey("messageBox")) {
			messagebox = this.getRequest().getParameters().get('messageBox');
		}

		if (this.getRequest().getParameters().hasKey('lightboxTeasers')) {
			lightboxTeaser = this.getRequest().getParameters().get('lightboxTeasers');
		}

		this.getView().assign("messageBox", messagebox);
		this.getView().assign("lightboxTeasers", lightboxTeaser);
	},

	experienceAction: function() {
		var sliderItems = $$('.related-slider-item');

		if (this.getRequest().getParameters().hasKey('sliderItems')) {
			sliderItems = this.getRequest().getParameters().get('sliderItems');
		}
		this.getView().assign("sliderItems", sliderItems);
	},

	listAction: function() {
		var me = this;

		var availableActions =
			[
				"print",
				"recommend",
				"fbshare"
			];

		availableActions.each(function(actionName) {
			var actionLinks = $$(".sharefunction-" + actionName);

			if (actionLinks.length == 0)
				return;

			actionLinks.each(function(actionLink) {
				me._shareFunctionAction(actionName, actionLink);
			});
		});


		if ($$('.related-slider-item').length > 1) {
			var lightboxRequest = new anyLib.Application.Controller.Request();

			lightboxRequest.setModule("default");
			lightboxRequest.setController("career");
			lightboxRequest.setAction("experience");
			lightboxRequest.setNamespace(Weber.Application);

			lightboxRequest.getParameters().set("sliderItems", $$('.related-slider-item'));

			Weber.application.dispatch(lightboxRequest);
		}
	},

	_shareFunctionAction: function(action, element) {
		var actionRequest = new anyLib.Application.Controller.Request();

		actionRequest.setAction(action);
		actionRequest.setModule("default");
		actionRequest.setController("sharefunction");
		actionRequest.setNamespace(Weber.Application);

		var activeItem = $(window.location.hash.substr(1));

		if (action == "print") {

			actionRequest.getParameters().set("linkElements", [element]);
			actionRequest.getParameters().set("isUrlItem", true);

			if (activeItem) {
				actionRequest.getParameters().set("activeItem", activeItem);
			}

			Weber.application.dispatch(actionRequest);
		}

		if (action == "recommend") {
			var targets = $$(".careerShare span.recommend-target");

			actionRequest.getParameters().set("linkElements", [element]);

			if (targets.length > 0)
				actionRequest.getParameters().set("ajaxTarget", targets);

			Weber.application.dispatch(actionRequest);
		}

		if (action == "fbshare") {
			var facebookId = $$(".careerShare .fbshare-facebookid").first().innerHTML;

			actionRequest.getParameters().set("linkElements", [element]);

			if (facebookId.length > 0)
				actionRequest.getParameters().set("facebookId", facebookId);

			if (activeItem) {
				actionRequest.getParameters().set("name", activeItem.down('.heading a').innerHTML);
			}

			Weber.application.dispatch(actionRequest);
		}
	}
});
