/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.QuitFriendship = Class.create(anyLib.Application.View, {
	userID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		this.messageBox.getLightBox().afterClose.add(function() {
			Weber.Utilities.refreshWindow();
		});

		Weber.Utilities.getCommunityService().quit(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				userID: this.userID
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Freundschaft beendet</h3>' +
						'<p>Die Freundschaft wurde erfolgreich beendet.</p>' +
					'</div>'
				);
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Fehler</h3>' +
						'<p>Die Freundschaft konnte nicht beendet werden.</p>' +
						'<p>Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</p>' +
					'</div>'
				);
			}
		)
	}
});
