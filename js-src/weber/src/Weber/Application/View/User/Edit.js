/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Service
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.Edit = Class.create(anyLib.Application.View, {
	submitButton: null,
	changePasswordButton: null,

	render: function() {
		this.changePasswordButton.on("click", function() {
			var changePasswordRequest = new anyLib.Application.Controller.Request();

			changePasswordRequest.setModule("default");
			changePasswordRequest.setController("User");
			changePasswordRequest.setAction("change-password");
			changePasswordRequest.setNamespace(Weber.Application);

			Weber.application.dispatch(changePasswordRequest);
		});

		this.submitButton.on("click", function() {
			var submitButtonRequest = new anyLib.Application.Controller.Request();

			submitButtonRequest.setModule("default");
			submitButtonRequest.setController("User");
			submitButtonRequest.setAction("edit-validate");
			submitButtonRequest.setNamespace(Weber.Application);

			Weber.application.dispatch(submitButtonRequest);
		});
	}
});
