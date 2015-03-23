/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Recipe = Class.create(anyLib.Application.Controller, {
	groupAction: function() {
		var sliderRequest = new anyLib.Application.Controller.Request();

		sliderRequest.setModule("default");
		sliderRequest.setController("product");
		sliderRequest.setAction("group-slider");
		sliderRequest.setNamespace(Weber.Application);

		Weber.application.dispatch(sliderRequest);

		var searchRequest = new anyLib.Application.Controller.Request();

		searchRequest.setAction("search");
		searchRequest.setModule("default");
		searchRequest.setController("recipe");
		searchRequest.setNamespace(Weber.Application);

		searchRequest.getParameters().add("searchForm", $("large-recipe-search"));

		Weber.application.dispatch(searchRequest);
	},
	searchPageAction: function() {
		var searchRequest = new anyLib.Application.Controller.Request();

		searchRequest.setAction("search");
		searchRequest.setModule("default");
		searchRequest.setController("recipe");
		searchRequest.setNamespace(Weber.Application);

		searchRequest.getParameters().add("searchForm", $("large-recipe-search"));

		Weber.application.dispatch(searchRequest);
	},
	overviewAction: function() {
		var searchRequest = new anyLib.Application.Controller.Request();

		searchRequest.setAction("search");
		searchRequest.setModule("default");
		searchRequest.setController("recipe");
		searchRequest.setNamespace(Weber.Application);

		searchRequest.getParameters().add("maximumNameLength", 34);
		searchRequest.getParameters().add("searchForm", $("small-recipe-search"));

		Weber.application.dispatch(searchRequest);
	},
	detailAction: function () {
		var recipeId = 0;
		var recipeIdContainer = $$(".community-info-recipe-id").first();

		if (recipeIdContainer != null) {
			recipeId = recipeIdContainer.innerHTML;
		}

		this.getView().assign("recipeID", recipeId);
		this.getView().assign("commentTextArea", $("comment"));
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("recipeImage", $$(".recipe-image").first());
		this.getView().assign("ratingContainer", $$(".recipe-rating").first());
		this.getView().assign("commentContainer", $$(".comment-container").first());
		this.getView().assign("userToken", Weber.Utilities.getCommunity().getToken());
		this.getView().assign("communityTools", $$(".recipe-community-tools").first());
		this.getView().assign("commentForm", $$(".community-create-comment-container").first());
		this.getView().assign("communityCommentsPageId", $$(".community-info-comments-page-id").first());
		this.getView().assign("commentSubmit", $$(".community-create-comment-container .form-button").first());
		this.getView().assign("socialButtonContainer", $$(".product-social-button-list.recipe-button-list").first());

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
	},
	searchAction: function() {
		if (this.getRequest().getParameters().hasKey("searchForm"))
			this.getView().assign("searchForm", this.getRequest().getParameters().get("searchForm"));

		if (this.getRequest().getParameters().hasKey("maximumNameLength"))
			this.getView().assign("maximumNameLength", this.getRequest().getParameters().get("maximumNameLength"));
	},
	editAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("formElement", $$(".recipe-edit-form").first());
		this.getView().assign("addIngredientLink", $$(".recipe-add-ingredient").first());
		this.getView().assign("ingredientContainer", $$(".ingredient-container").first());
		this.getView().assign("savePublishedButton", $$(".form-button.recipe-save-published").first());
		this.getView().assign("saveUnpublishedButton", $$(".form-button.recipe-save-unpublished").first());
	}
});
