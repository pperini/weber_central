/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.Gallery = Class.create(anyLib.Application.View, {
	isLoggedIn: false,
	formElement: null,
	submitButton: null,

	render: function() {
		if (this.isLoggedIn)
			return;

		var me = this;

		this.submitButton.on("click", function() {
			me.formElement.submit();
		})
	}
});
