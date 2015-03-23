/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Form = Class.create(anyLib.Application.Controller, {
	assignFormElements: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());

		this.getView().assign("form", $$("form").first());
		this.getView().assign("submitButton", $$(".submit-area .form-button").first());
	},

	grillRegistrationAction: function() {
		this.assignFormElements();
	},

	contactAction: function() {
		this.assignFormElements();
	},

	newsletterAction: function() {
		this.assignFormElements();
	},

	selectAction: function() {
		this.getView().assign("elements", this.getRequest().getParameters().get("elements"));
	},

	checkBoxAction: function() {
		this.getView().assign("elements", this.getRequest().getParameters().get("elements"));
	},

	radioAction: function() {
		this.getView().assign("elements", this.getRequest().getParameters().get("elements"));
	}
});
