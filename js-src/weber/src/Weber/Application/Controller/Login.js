/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Login = Class.create(anyLib.Application.Controller, {
	initializeAction: function() {
		var community = Weber.Utilities.getCommunity();

		var loginButtonRequest = new anyLib.Application.Controller.Request();
		loginButtonRequest.setModule("default");
		loginButtonRequest.setController("login");
		loginButtonRequest.setNamespace(Weber.Application);

		if (community.hasToken()) {
			loginButtonRequest.setAction("after-login");
		} else {
			loginButtonRequest.setAction("before-login");
		}

		loginButtonRequest.getParameters().set("loginLink", $$("#head-meta a.community-login").first());

		Weber.application.dispatch(loginButtonRequest);
	},

	beforeLoginAction: function() {
		this.getView().assign("loginRequiredLinks", $$(".require-login"));
		this.getView().assign("loginLink", this.getRequest().getParameters().get("loginLink"));
	},

	afterLoginAction: function() {
		this.getView().assign("loginLink", this.getRequest().getParameters().get("loginLink"));
	}
});
