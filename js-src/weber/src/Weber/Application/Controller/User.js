/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Url
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 * @requiresPackage Weber.MessageBox
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.User = Class.create(anyLib.Application.Controller, {
	editAction: function() {
		this.getView().assign("submitButton", $$(".edit-profile .save-profile").first());
		this.getView().assign("changePasswordButton", $$(".edit-profile .change-password").first());
	},

	editValidateAction: function() {
		var updateValidationRequest = new anyLib.Application.Controller.Request();

		updateValidationRequest.setModule("default");
		updateValidationRequest.setController("User");
		updateValidationRequest.setNamespace(Weber.Application);

		var editForm = $$(".edit-profile").first();

		var profile = editForm.serialize(true);

		if (profile["Birthday"] != "") {
			var birthdayParts = profile["Birthday"].split(".");
			profile["Birthday"] = new Date(parseInt(birthdayParts[2]), (parseInt(birthdayParts[1]) - 1), (parseInt(birthdayParts[0]) + 1), 0, 0, 0, 0);
			profile["Birthday"] = profile["Birthday"].getTime();
		} else {
			delete(profile["Birthday"]);
		}

		if (profile["GrillID"] == "")
			delete(profile["GrillID"]);

		Weber.Utilities.getUserService().editProfile(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				newProfile: profile
			},
			function() {
				updateValidationRequest.setAction("edit-valid");

				Weber.application.dispatch(updateValidationRequest);
			},
			function(transport) {
				updateValidationRequest.getParameters().set("editForm", editForm);
				updateValidationRequest.getParameters().set("validationItems", transport);

				updateValidationRequest.setAction("edit-invalid");

				Weber.application.dispatch(updateValidationRequest);
			}
		);
	},

	editValidAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
	},

	editInvalidAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("editForm", this.getRequest().getParameters().get("editForm"));
		this.getView().assign("validationItems", this.getRequest().getParameters().get("validationItems"));
	},

	changePasswordAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
	},

	registrationAction: function() {
		var form = $$(".edit-profile").first();

		this.getView().assign("editForm", form);
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("submitButton", form.down(".save-profile"));
	},

	uploadProfilePictureAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("formElement", $$(".edit-picture").first());
		this.getView().assign("submitButton", $$(".upload-picture").first());
		this.getView().assign("deleteButton", $$(".delete-current-profile").first());
	},

	recoverPasswordAction: function() {
		this.getView().assign("submitButton", $$(".recover-password").first());
		this.getView().assign("formElement", $$(".recover-password-form").first());
	}
});
