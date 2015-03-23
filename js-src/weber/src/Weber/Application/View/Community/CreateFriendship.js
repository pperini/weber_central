/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.CreateFriendship = Class.create(anyLib.Application.View, {
	userID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		this.messageBox.getLightBox().afterClose.add(function() {
			Weber.Utilities.refreshWindow();
		});

		Weber.Utilities.getCommunityService().create(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				userID: this.userID
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Freundschaftsanfrage versendet</h3>' +
						'<p>Die Freundschaftsanfrage wurde erfolgreich versendet.</p>' +
					'</div>'
				);
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Fehler</h3>' +
						'<p>Die Freundschaftsanfrage konnte nicht gesendet werden.</p>' +
						'<p>Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</p>' +
					'</div>'
				);
			}
		)
	}
});
