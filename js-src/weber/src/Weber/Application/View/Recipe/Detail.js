/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.UI.LightBox
 * @requiresPackage Weber
 * @requiresPackage Weber.LightBox
 */
anyLib.registerNamespace("Weber.Application.View.Recipe");

Weber.Application.View.Recipe.Detail = Class.create(anyLib.Application.View, {
	recipeID: null,
	userToken: null,
	messageBox: null,
	commentForm: null,
	recipeImage: null,
	commentSubmit: null,
	ratingContainer: null,
	commentTextArea: null,
	commentContainer: null,
	socialButtonContainer: null,
	communityCommentsPageId: null,

	render: function () {
		var lightBox = new anyLib.UI.LightBox();

		lightBox.setLayout(new Weber.LightBox.Layout.RecipeDetail());

		var image = new anyLib.UI.LightBox.Content.Image();
		image._setContent(this.recipeImage.href);
		image.setKey("image");

		lightBox.addContent(image);

		this.recipeImage.on("click", function(event) {
			Event.stop(event);

			lightBox.change("image");
		});

		this._reloadComments();

		if (this.userToken == null || this.userToken.length != 32) {
			return;
		}

		this._refreshLikeButton();

		this.commentForm.show();
		this.communityTools.show();

		var me = this;

		this.commentSubmit.on("click", function() {
			if (me.commentTextArea.value == "") {
				me.commentTextArea.addClassName("error");

				return;
			}

			if (me.commentTextArea.hasClassName("error"))
				me.commentTextArea.removeClassName("error");

			var currentUrl = new anyLib.Url(window.location.toString());

			Weber.Utilities.getRecipeService().comment(
				{
					RecipeID: me.recipeID,
					Comment: me.commentTextArea.value,
					RecipeUrl: currentUrl.getParsed(),
					Token: Weber.Utilities.getCommunity().getToken()
				},
				function () {
					me.commentTextArea.value = "";

					me._reloadComments();
				},
				this._reload
			);
		});

		if (this.ratingContainer == null)
			return;

		var rating = this.ratingContainer.down(".rating");
		var saveLink = this.ratingContainer.down(".save");
		var infoText = this.ratingContainer.down(".info");
		var stars = this.ratingContainer.select(".rating .star");

		var ratingHandles = [];

		var assignedRating = 0;

		ratingHandles.push(rating.on("mouseleave", function() {
			rating.className = "rating rated-" + assignedRating;
		}));

		stars.each(function(star, index) {
			ratingHandles.push(star.on("mouseenter", function() {
				rating.className = "rating rated-" + (index + 1);
			}));

			ratingHandles.push(star.on("click", function() {
				assignedRating = index + 1;
			}));
		});

		saveLink.on("click", function(event) {
			Event.stop(event);

			ratingHandles.each(function(ratingHandle) {
				ratingHandle.stop();
			});

			Weber.Utilities.getRecipeService().rate(
				{
					RecipeID: me.recipeID,
					Rating: assignedRating,
					Token: Weber.Utilities.getCommunity().getToken()
				},
				function() {
					saveLink.hide();
					infoText.show();
				},
				function() {
					saveLink.hide();
				}
			);
		});
	},

	_createButton: function (data) {
		var template = new Template('<a class="button-background add-remove-favourite #{buttonClass} form-button" href="javascript:void(0);">' +
			'<span class="icon large">#{text} <span class="button-icon #{iconClass}"></span></span>' +
				'<span class="button-background left"></span>' +
				'<span class="button-background right"></span>' +
			'</a>');

		return template.evaluate(data);
	},

	_refreshLikeButton: function () {
		var me = this;

		var existingButton = $$(".add-remove-favourite").first();

		if (existingButton != null) {
			existingButton.replace('<div class="loading-overlay" style="width:228px;height:30px;"><br><br></div>');
		} else {
			this.socialButtonContainer.insert({
				bottom: '<div class="loading-overlay" style="width:228px;height:30px;"><br><br></div>'
			});
		}

		Weber.Utilities.getRecipeService().isFavourite({
			token: this.userToken,
			recipeID: this.recipeID,
			mandantID: Weber.Settings.MandantID
		}, function (response) {
			me._showAddOrRemoveFavouriteButton(response.responseJSON.TrueOrFalse);
		}, function() {});
	},

	_showAddOrRemoveFavouriteButton: function(isFavourite) {
		var loadingPlaceholder = this.socialButtonContainer.down(".loading-overlay");

		var buttonData;

		if (isFavourite) {
			buttonData = $$(".community-button-info-remove").first().innerHTML.evalJSON();
		} else {
			buttonData = $$(".community-button-info-add").first().innerHTML.evalJSON();
		}

		loadingPlaceholder.replace(this._createButton(buttonData));

		var me = this;

		this.socialButtonContainer.down(".add-remove-favourite").on("click", function () {
			Weber.Utilities.getRecipeService()[(isFavourite) ? "hate" : "like"]({
					RecipeID: me.recipeID,
					Token: Weber.Utilities.getCommunity().getToken()
				},
				function() {
					me._refreshLikeButton();
				},
				function() {}
			);
		});
	},

	_reloadComments: function() {
		if (this.communityCommentsPageId == null || this.communityCommentsPageId.innerHTML == "") {
			return;
		}

		var commentsList = this.commentContainer.down(".comment-list");

		if (commentsList != null) {
			commentsList.replace('<div class="loading-overlay" style="width:441px;height:30px;"><br><br></div>');
		} else {
			this.commentContainer.insert({
				bottom: '<div class="loading-overlay" style="width:441px;height:30px;"><br><br></div>'
			});
		}

		var loadingElement = this.commentContainer.down(".loading-overlay");

		// ReSharper disable once WrongExpressionStatement
		new Ajax.Request("/Default.aspx", {
			method: "GET",
			parameters: {
				moawr: true,
				WeberRecipeID: this.recipeID,
				ID: this.communityCommentsPageId.innerHTML
			},
			onSuccess: function(transport) {
				loadingElement.replace(transport.responseText);
			}
		});
	},

	_reload: function() {
		Weber.Utilities.refreshWindow();
	}

});
