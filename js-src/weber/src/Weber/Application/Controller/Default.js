/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.CookieJar
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Default = Class.create(anyLib.Application.Controller, {
	defaultAction: function() {
	},

	tooltipAction: function() {
		this.getView().assign("tooltipCollection", this.getRequest().getParameters().get("tooltipCollection"));
	},

	foldoutAction: function() {
		if (window.location.hash != null && window.location.hash != "") {
			this.getView().assign("activeItem", $(window.location.hash.substr(1)));
		}
		this.getView().assign("foldoutItems", $$(".foldout-item"));
	},

	cookingTimeAction: function() {
		this.getView().assign("selectElement", $("table-category"));
	},

	cookingTimeLightboxAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("selectElement", $("table-category"));
		this.getView().assign("showButton", $("show-cooking-time-table"));
	},

	galleryAction: function() {
		var cookieJar = new anyLib.CookieJar();
		var isLoggedIn = cookieJar.has("moawdgc");

		var formElement = null;
		var submitButton = null;

		if (!isLoggedIn) {
			formElement = $$(".gallery-login").first();

			submitButton = formElement.down(".form-button");
		}

		this.getView().assign("isLoggedIn", isLoggedIn);
		this.getView().assign("formElement", formElement);
		this.getView().assign("submitButton", submitButton);
	},

	glossaryAction: function() {
		this.getView().assign("glossaryLetters", $$(".glossary-letter"));
		this.getView().assign("glossaryContainers", $$(".glossary-container"));
	},

	grillCourseAction: function() {
		this.getView().assign("months", $$(".grill-course-month"));
		this.getView().assign("triggers", $$(".grill-course-months a"));

		var currentDate = new Date();
		this.getView().assign("currentMonth", currentDate.getMonth() + 1);
	},

	recommendAction: function() {
		var targets = $$("#footer-meta span.recommend-target");

		this.getView().assign("linkElements", $$("#footer-meta a.recommend"));

		if (targets.length > 0)
			this.getView().assign("ajaxTarget", targets.first().innerHTML);
	},
	pagingAction: function() {
		var pageCollection = this.getRequest().getParameters().get("pageCollection");

		this.getView().assign("pageContainerList", pageCollection);
		this.getView().assign("pagingLinkContainer", $$(".paging").first());
	},
	weberTvAction: function() {
		this.getView().assign("selectElement", $("video_type").up(".select"));
	}
});
