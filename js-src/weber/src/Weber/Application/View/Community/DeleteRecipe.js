/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.DeleteRecipe = Class.create(anyLib.Application.View, {
	recipeID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		me.messageBox.confirm(
			'Möchten Sie dieses Rezept wirklich löschen?',
			'Rezept löschen',
			function() {
				me.messageBox.getLightBox().afterClose.add(function() {
					Weber.Utilities.refreshWindow();
				});

				Weber.Utilities.getRecipeService().remove(
					{
						Token: Weber.Utilities.getCommunity().getToken(),
						RecipeId: me.recipeID
					},
					function() {
						me.messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Rezept gelöscht</h3>' +
							'</div>'
						);
					},
					function() {
						me.messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Das Rezept konnte nicht gelöscht werden</h3>' +
								'<p>Versuchen Sie es bitte später erneut.</p>' +
							'</div>'
						);
					}
				)
			},
			function() {
				me.messageBox.getLightBox().close();
			}
		);
	}
});
