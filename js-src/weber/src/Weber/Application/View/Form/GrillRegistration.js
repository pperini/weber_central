/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Form");

Weber.Application.View.Form.GrillRegistration = Class.create(anyLib.Application.View, {
	form: null,
	isSend: false,
	messageBox: null,
	submitButton: null,
	_requiredFields: [],
	_typedFields: [],

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
			});
		});

		var checkTypes = $$(".check-type");

		checkTypes.each(function(element) {
			var field = null;
			var label = null;
			var validator = null;

			if (element.hasClassName("type-money")) {
				field = element.down("input");
				validator = new Weber.Form.Validator.Money();
			}

			if (element.hasClassName("type-date")) {
				field = element.select("select");
				validator = new Weber.Form.Validator.Date();
			}

			if (field == null)
				return;

			if (label == null)
				label = element.down("label").innerHTML;

			if (validator != null) {
				validator.setElement( field );
			}

			me._typedFields.push({
				label: label,
				element: field,
				container: element,
				validator: validator
			});

		});

		this.submitButton.on("click", function() {
			if (me.validates() === true && me.isSend == false) {
				me.isSend = true;
				me.messageBox.display('<div class="loading-overlay" style="width:221px;height:80px;"><br><br></div>');
				me.form.submit();
			}
		});
	},

	validates: function() {
		var errors = [];
		var typeErrors = [];

		this._requiredFields.each(function(field) {
			field.container.removeClassName("error");

			if (field.element.type == "text" && field.element.value == "") {
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


		this._typedFields.each( function(field) {
			field.container.removeClassName("error");

			if (field.element.value == "") {
				return;
			}

			if (field.validator != null && !field.validator.isValid()) {
				field.container.addClassName("error");

				typeErrors.push(field.label.gsub("*", ""));
			}
		});


		if (errors.length == 0 && typeErrors.length == 0)
			return true;

		var errorMessage = '<div class="light-box-message">' +
			'<h3>' + t("bitte_ueberpruefen") + '</h3>' +
			'<p>' + t("pflichtfelder_nicht_korrekt") + ':</p>' +
			'<ul><li>' + errors.join('</li><li>') + '</li></ul>';

		if (typeErrors.length > 0) {
			errorMessage = errorMessage +
				'<p>' + t("optionale_felder_ungueltig") + ':</p>' +
				'<ul><li>' + typeErrors.join('</li><li>') + '</li></ul>';
		}

		this.messageBox.display(
			errorMessage + '</div>'
		);

		this.isSend = false;
		return false;
	}
});
