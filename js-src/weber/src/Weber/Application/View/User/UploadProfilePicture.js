/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.UploadProfilePicture = Class.create(anyLib.Application.View, {
	messageBox: null,
	formElement: null,
	submitButton: null,
	deleteButton: null,
	_uploadFrame: null,
	_imageElement: null,

	render: function() {
		var me = this;

		this._imageElement = this.formElement.down("#image");
		this._uploadFrame = this.formElement.down("#upload-frame");

		this.submitButton.on("click", function() {
			if (me._imageElement.value == "") {
				me._imageElement.up(".form-item").addClassName("error");

				return;
			} else {
				me._imageElement.up(".form-item").removeClassName("error");
			}

			var successCallback = function() {
				me.messageBox.getLightBox().afterClose.add(function() {
					window.location = Weber.service.user.links.home;
				});

				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Ihr Profilbild wurde erfolgreich hochgeladen</h3>' +
						'<p><a href="' + Weber.service.user.links.home + '">zurück zu meiner Weber Community</a></p>' +
					'</div>'
				);
			};

			var errorCallback = function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Ihr Profilbild konnt nicht hochgeladen werden</h3>' +
						'<p>Versuchen Sie es bitte später erneut</p>' +
						'<p><a href="' + Weber.service.user.links.home + '">zurück zu meiner Weber Community</a></p>' +
					'</div>'
				);
			};

			me._uploadFrame.on("load", function() {
				var uploadResponseJSON = me._uploadFrame.contentWindow.document.getElementById("ResponseText").innerHTML.evalJSON();

				if (uploadResponseJSON.Success !== true)
					return errorCallback();

				Weber.Utilities.getUserService().updateProfilePicture(
					{
						token: Weber.Utilities.getCommunity().getToken(),
						userPicture: uploadResponseJSON.Files["default"]
					},
					successCallback,
					errorCallback
				);
			});

			me.formElement.submit();
		});

		this.deleteButton.on("click", function() {
			var callback = function() {
				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Ihr Profilbild wurde erfolgreich gelöscht</h3>' +
						'<p><a href="' + Weber.service.user.links.home + '">zurück zu meiner Weber Community</a></p>' +
					'</div>'
				);
			};

			me.messageBox.getLightBox().afterClose.add(function() {
				window.location = Weber.service.user.links.home;
			});

			Weber.Utilities.getUserService().deleteProfilePicture({}, callback, callback)
		});
	}
});
