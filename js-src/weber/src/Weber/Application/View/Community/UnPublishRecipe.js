/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.UnPublishRecipe = Class.create(anyLib.Application.View, {
	recipeID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		this.messageBox.getLightBox().afterClose.add(function() {
			Weber.Utilities.refreshWindow();
		});

		Weber.Utilities.getRecipeService().publish(
			{
				id: me.recipeID,
				published: false,
				token: Weber.Utilities.getCommunity().getToken()
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Rezept gespeichert</h3>' +
					'</div>'
				);
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Das Rezept konnte nicht privat geschaltet werden</h3>' +
						'<p>Versuchen Sie es bitte später erneut.</p>' +
					'</div>'
				);
			}
		);
	}
});
