/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Message");

Weber.Application.View.Message.Delete = Class.create(anyLib.Application.View, {
	messageID: null,
	actionLink: null,
	messageBox: null,

	render: function() {
		var me = this;

		this.messageBox.getLightBox().afterClose.add(function() {
			Weber.Utilities.refreshWindow();
		});

		// TODO: Bestätigungsfenster einbauen!!
		// TODO: Die Nachrichten Texte in Templates auslagern

		Weber.Utilities.getMessageService().remove(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				id: this.messageID
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Nachricht gelöscht</h3>' +
						'<p>Die Nachricht wurde erfolgreich gelöscht.</p>' +
					'</div>'
				);
			},
			function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Fehler</h3>' +
						'<p>Die Nachricht konnte nicht gelöscht werden.</p>' +
						'<p>Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</p>' +
					'</div>'
				);
			}
		)
	}
});