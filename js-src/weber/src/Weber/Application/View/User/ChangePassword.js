/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Service
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.ChangePassword = Class.create(anyLib.Application.View, {
	messageBox: null,

	render: function() {
		this.messageBox.display(
			'<div class="columns-8">' +
				'<h3>Passwort ändern</h3>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="grid-8">' +
				'<div class="columns-4 lft form-item item-text required">' +
					'<label for="password_old">Altes Passwort</label>' +
					'<input type="password" id="password_old" name="password_old" placeholder="Altes Passwort">' +
				'</div>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="grid-8 space">' +
				'<div class="columns-4 lft form-item item-text required">' +
					'<label for="password">Passwort</label>' +
					'<input type="password" id="password" name="password" placeholder="Passwort">' +
				'</div>' +
				'<div class="columns-4 lft form-item item-text required">' +
					'<label for="password_confirm">Passwort wiederholen</label>' +
					'<input type="password" id="password_confirm" name="password_confirm" placeholder="Passwort wiederholen">' +
				'</div>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="columns-8 submit-area">' +
				'<a class="button-background form-button red rgt change-password-submit" href="javascript:void(0);">' +
					'Passwort speichern' +
					'<span class="button-background left"></span><span class="button-background right"></span>' +
				'</a>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>'
		);

		var handleChange = 1;

		var me = this;

		this.messageBox.getLightBox().afterChange.add(function() {
			if (handleChange === 2) {
				$$(".continue-edit-profile").first().on("click", function() {
					me.messageBox.getLightBox().close();
				});

				return;
			}

			if (handleChange !== 1)
				return;

			handleChange = 2;

			var submitButton = $$(".change-password-submit").first();
			var passwordField = $("password");
			var passwordOldField = $("password_old");
			var passwordConfirmField = $("password_confirm");

			var passwordFieldsAreEqual = function() {
				var fieldsAreEqual = (passwordField.value == passwordConfirmField.value);

				if (passwordField.value == "")
					return false;

				if (fieldsAreEqual === false) {
					passwordConfirmField.addClassName("error");
				} else {
					passwordConfirmField.removeClassName("error");
				}

				if (passwordOldField.value == "") {
					passwordOldField.addClassName("error");

					return false;
				} else {
					passwordOldField.removeClassName("error");
				}

				return fieldsAreEqual;
			};

			passwordField.on("keyup", passwordFieldsAreEqual);
			passwordConfirmField.on("keyup", passwordFieldsAreEqual);

			submitButton.on("click", function() {
				if (passwordFieldsAreEqual() === false)
					return;

				Weber.Utilities.getUserService().changePassword(
					{
						NewPassword: passwordField.value,
						OldPassword: passwordOldField.value,
						Token: Weber.Utilities.getCommunity().getToken()
					},
					function() {
						me.messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Ihr Passwort wurde erfolgreich gespeichert</h3>' +
								'<p><a href="javascript:void(0);" class="continue-edit-profile">mit der bearbeitung Ihres Profils forfahren</a></p>' +
								'<p><a href="' + Weber.service.user.links.home + '">zurück zu meiner Weber Community</a></p>' +
							'</div>'
						);
					},
					function() {
						me.messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Ihr Passwort konnte nicht gespeichert werden, versuchen Sie es bitte zu einem späteren Zeitpunkt erneut</h3>' +
								'<p><a href="javascript:void(0);" class="continue-edit-profile">mit der bearbeitung Ihres Profils forfahren</a></p>' +
								'<p><a href="' + Weber.service.user.links.home + '">zurück zu meiner Weber Community</a></p>' +
							'</div>'
						);
					}
				);
			});
		});
	}
});
