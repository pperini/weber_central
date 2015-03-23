/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Login");

Weber.Application.View.Login.AfterLogin = Class.create(anyLib.Application.View, {
	loginLink: null,

	render: function() {
		var linkTemplate = new Template('<li><a class="#{className}" href="#{href}" title="#{text}">#{text}</a></li>');

		var loginElement = this.loginLink.up("li");

		loginElement.insert({
			after: linkTemplate.evaluate({
				text: t("login-link-logged-in"),
				href: Weber.service.user.links.home,
				className: "my-community community-login"
			}) +
			linkTemplate.evaluate({
				text: t("login-link-log-out"),
				href: Weber.service.user.links.logout
			})
		});

		loginElement.remove();
	}
});