/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Service
 */
anyLib.registerNamespace("Weber.Application.View.User");

Weber.Application.View.User.Registration = Class.create(anyLib.Application.View, {
	editForm: null,
	messageBox: null,
	submitButton: null,
	_requiredFields: [],
	changePasswordButton: null,

	render: function() {
		var me = this;

		var requiredFields = $$(".required");

		requiredFields.each(function(element) {
			var field = null;
			var label = null;

			if (element.hasClassName("item-text"))
				field = element.down("input");

			if (element.hasClassName("item-checkbox")) {
				field = element.down("input");

				if (field.id == "terms_and_conditions")
					label = t("Zustimmung_Datenschutzerklaerung");
			}

			if (element.hasClassName("item-textarea"))
				field = element.down("textarea");

			if (element.hasClassName("item-select"))
				field = element.down(".select");

			if (field == null)
				return;

			if (label == null)
				label = element.down("label").innerHTML;

			me._requiredFields.push({
				label: label,
				element: field,
				container: element
			})
		});

		this.submitButton.on("click", function() {
			if (me.validates() === true)
				me.submitRegistration();
		});
	},

	validates: function() {
		var errors = [];

		this._requiredFields.each(function(field) {
			field.container.removeClassName("error");

			if ((field.element.type == "text" || field.element.type == "password" || field.element.type == "email") && field.element.value == "") {
				field.container.addClassName("error");
				errors.push(field.label.gsub("*", ""));
			}

			if (field.element.type == "checkbox" && field.element.checked == false) {
				field.container.addClassName("error");
				errors.push(field.label.gsub("*", ""));
			}

			if (field.element.hasClassName("select") && field.element.instance.getSelectedOption() == "") {
				field.container.addClassName("error");
				errors.push(field.label.gsub("*", ""));
			}
		});

		if (errors.length == 0)
			return true;

		this.messageBox.display(
			'<div class="light-box-message">' +
				'<h3>+t("bitte_ueberpruefen")+</h3>' +
				'<p>+t("pflichtfelder_nicht_korrekt")+</p>' +
				'<ul><li>' + errors.join('</li><li>') + '</li></ul>' +
			'</div>'
		);

		return false;
	},

	submitRegistration: function() {
		var me = this;

		var profile = this.editForm.serialize(true);

		if (profile["Birthday"] != "") {
			var birthdayParts = profile["Birthday"].split(".");
			profile["Birthday"] = new Date(parseInt(birthdayParts[2]), (parseInt(birthdayParts[1]) - 1), (parseInt(birthdayParts[0]) + 1), 0, 0, 0, 0);
			profile["Birthday"] = profile["Birthday"].getTime();
		} else {
			delete(profile["Birthday"]);
		}

		var currentUrl = new anyLib.Url(window.location.toString());
		currentUrl.setPath(Weber.service.user.links.registerUrl);

		profile["RegisterUrl"] = currentUrl.getParsed() + "?moawt=";

		if (profile["GrillID"] == "")
			delete(profile["GrillID"]);

		profile["MandantID"] = Weber.Settings.MandantID;

		Weber.Utilities.getUserService().register(
			profile,
			function() {
				me.messageBox.getLightBox().afterClose.add(function() {
					window.location = "/";
				});

				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>Registration erfolgreich</h3>' +
						'<p>Sie erhalten in Kürze eine Aktivierungs-Email, mit der Sie ihre Mitgliedschaft in der Weber Community bestätigen können.</p>' +
						'<p><a href="/">Zurück zur Startseite</a></p>' +
					'</div>'
				);
			},
			function(transport) {
				var errors = [];

				transport.responseJSON.ErrorItems.each(function(error) {
					errors.push("<li>" + t(error.Message) + "</li>");
				});

				me.messageBox.display(
					'<div class="light-box-message">' +
						'<h3>+t("bitte_ueberpruefen")+</h3>' +
						'<p>Bitte kontrollieren Sie folgende Fehlder:</p>' +
						'<ul>' +
							errors.join("") +
						'</ul>' +
					'</div>'
				);
			}
		);
	}
});
