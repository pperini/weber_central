/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Service
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.RecoverPassword = Class.create(anyLib.Application.View, {
	formElement: null,
	submitButton: null,

	render: function() {
		if (this.submitButton == null)
			return;

		var me = this;

		this.submitButton.on("click", function() {
			me.formElement.submit();
		});
	}
});
