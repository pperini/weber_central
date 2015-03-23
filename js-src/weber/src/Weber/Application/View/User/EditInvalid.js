/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.EditInvalid = Class.create(anyLib.Application.View, {
	editForm: null,
	messageBox: null,
	validationItems: [],

	render: function() {
		var errors = [];

		this.validationItems.responseJSON.ErrorItems.each(function(error) {
			errors.push("<li>" + t(error.message) + "</li>");
		});

		this.messageBox.display(
			'<div class="light-box-message">' +
				'<h3>Bitte prüfen Sie Ihre Angaben</h3>' +
				'<p>Bitte kontrollieren Sie folgende Fehlder:</p>' +
				'<ul>' +
					errors.join("") +
				'</ul>' +
			'</div>'
		);
	}
});
