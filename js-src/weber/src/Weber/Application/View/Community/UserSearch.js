/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Community");

Weber.Application.View.Community.UserSearch = Class.create(anyLib.Application.View, {
	formElement: null,
	submitButton: null,

	render: function() {
		var me = this;

		this.submitButton.on("click", function() {
			me.formElement.submit();
		})
	}
});