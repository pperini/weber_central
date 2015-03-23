/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.IgnoreUser = Class.create(anyLib.Application.View, {
	userID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		this.messageBox.getLightBox().afterClose.add(function() {
			Weber.Utilities.refreshWindow();
		});

		Weber.Utilities.getCommunityService().decline(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				userID: this.userID
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Benutzer ignoriert</h3>' +
						'<p>Die Benutzer wurde erfolgreich ignoriert.</p>' +
					'</div>'
				);
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Fehler</h3>' +
						'<p>Die Benutzer konnte nicht ignoriert werden.</p>' +
						'<p>Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</p>' +
					'</div>'
				);
			}
		)
	}
});
