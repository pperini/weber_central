/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.EditValid = Class.create(anyLib.Application.View, {
	messageBox: null,

	render: function() {
		this.messageBox.getLightBox().afterClose.add(function() {
			window.location = Weber.service.user.links.home;
		});

		this.messageBox.display(
			'<div class="light-box-message">' +
				'<h3>Ihr Profil wurde aktualisiert</h3>' +
				'<p><a href="' + Weber.service.user.links.home + '">zurück zu meiner Weber Community</a></p>' +
			'</div>'
		);
	}
});
