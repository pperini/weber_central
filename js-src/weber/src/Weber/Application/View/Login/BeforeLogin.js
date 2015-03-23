/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.LightBox
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Application.View.Login");

Weber.Application.View.Login.BeforeLogin = Class.create(anyLib.Application.View, {
	loginLink: null,
	loginRequiredLinks: [],

	render: function() {
		var messageBox = new Weber.MessageBox();

		var content = '<div class="login-layer">' +
			'<div class="login-layer-column left lft">' +
				'<h3>Anmeldung zur Weber Community</h3>' +
				'<div class="form-item item-text required">' +
					'<label for="username">Benutzername</label>' +
					'<input type="text" id="username" name="username" placeholder="Benutzername">' +
				'</div>' +
				'<div class="form-item item-text required">' +
					'<label for="password">Passwort</label>' +
					'<input type="password" id="password" name="password" placeholder="Passwort">' +
				'</div>' +
				'<div class="form-item item-checkbox">' +
					'<label for="remember_me">' +
						// '<span class="checkbox unchecked" id="remember_me"></span>Passwort merken' +
					'</label>' +
				'</div>' +
				'<p><a href="/Service/Weber-Community/Passwort-vergessen.aspx">Passwort vergessen</a></p>' +
				'<a class="button-background form-button red lft login-button" href="javascript:void(0);">Login<span class="button-background left"></span><span class="button-background right"></span></a>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="login-layer-column right rgt">' +
				'<h3>Noch kein Mitglied?<br>Ihre Vorteile:</h3>' +
				'<ul>' +
					'<li>Eigenes Profil einrichten</li>' +
					'<li>Eigene Rezepte veröffentlichen</li>' +
					'<li>Community-Rezepte bewerten und kommentieren</li>' +
					'<li>Im Forum schreiben und kommentieren</li>' +
					'<li>Eigene Rezeptsammlung erstellen</li>' +
				'</ul>' +
				'<a class="button-background form-button red lft" href="/Service/Weber-Community/Registrierung-zur-Community.aspx">Jetzt kostenlos anmelden<span class="button-background left"></span><span class="button-background right"></span></a>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>' +
		'</div>' +
		'<div class="clear"></div>';

		var triggerLogin = function(event) {
			Event.stop(event);

			messageBox.display(content);
		};

		this.loginRequiredLinks.each(function(loginRequiredLink) {
			loginRequiredLink.on("click", triggerLogin);
		});

		this.loginLink.on("click", triggerLogin);

		var me = this;

		var observing = false;

		messageBox.getLightBox().afterChange.add(function() {
			if (observing === true)
				return;

			observing = true;

			var submitButton = messageBox.getLightBox().getLayout()._getContent().down("a.login-button");
			var usernameField = messageBox.getLightBox().getLayout()._getContent().down("input#username");
			var passwordField = messageBox.getLightBox().getLayout()._getContent().down("input#password");

			var submitCallback = function() {
				var credentials = {
					username: usernameField.value,
					password: passwordField.value
				};

				Weber.Utilities.getUserService().login(
					credentials,
					function() {
						var loginButtonRequest = new anyLib.Application.Controller.Request();
						loginButtonRequest.setModule("default");
						loginButtonRequest.setController("login");
						loginButtonRequest.setAction("after-login");
						loginButtonRequest.setNamespace(Weber.Application);

						loginButtonRequest.getParameters().set("loginLink", me.loginLink);

						Weber.application.dispatch(loginButtonRequest);

						messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Login erfolgreich</h3>' +
								'<p><a href="' + Weber.service.user.links.home + '">zu meiner Weber Community</a></p>' +
							'</div>'
						);
					},
					function(transport) {
						var messageElement = messageBox.getLightBox().getLayout()._getContent().down(".message");

						var message = "Die Anmeldedaten sind nicht korrekt.";

						if (transport.responseJSON.status == 2) {
							transport.responseJSON.ValidationItems.each(function(validationItem) {
								message = "Bitte überprüfen Sie die Angaben in den rot markierten Feldern.";

								if (validationItem.property == "password")
									passwordField.addClassName("error");

								if (validationItem.property == "username")
									usernameField.addClassName("error");
							});
						}

						if (messageElement != null) {
							messageElement.innerHTML = message;
							return;
						}

						var dimensions = messageBox.getLightBox().getLayout()._getContent().getDimensions();

						var errorHeight = 30;

						dimensions.height = dimensions.height + errorHeight;

						messageBox.getLightBox().getLayout()._getContent().down(".login-layer").insert({
							top: '<div class="message" style="height:0px;">' + message + '</div>'
						});

						messageElement = messageBox.getLightBox().getLayout()._getContent().down(".message");

						new Effect.Parallel([
							new Effect.Morph(messageBox.getLightBox().getLayout().getContainer(), {
								style: {
									height: dimensions.height + "px"
								},
								sync: true
							}),
							new Effect.Morph(messageBox.getLightBox().getLayout()._getContent(), {
								style: {
									height: dimensions.height + "px"
								},
								sync: true
							}),
							new Effect.Morph(messageElement, {
								style: {
									height: (errorHeight - 20) + "px"
								},
								sync: true
							})
						], {
							duration: 0.4
						});
					}
				);
			};

			var keyPressCallback = function(event) {
				if (event.keyCode == Event.KEY_RETURN)
					submitCallback(event);
			};

			usernameField.on("keydown", keyPressCallback);
			passwordField.on("keydown", keyPressCallback);
			submitButton.on("click", submitCallback);
		});
	}
});
