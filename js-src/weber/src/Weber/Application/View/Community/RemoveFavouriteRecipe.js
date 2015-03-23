/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.RemoveFavouriteRecipe = Class.create(anyLib.Application.View, {
	recipeID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		var reloadCallback = function() {
			Weber.Utilities.refreshWindow();
		};

		me.messageBox.getLightBox().afterClose.add(reloadCallback);

		Weber.Utilities.getRecipeService().hate(
			{
				RecipeID: me.recipeID,
				Token: Weber.Utilities.getCommunity().getToken()
			},
			reloadCallback,
			reloadCallback
		);
	}
});
