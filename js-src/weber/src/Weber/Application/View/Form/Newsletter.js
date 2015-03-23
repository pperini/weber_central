/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Form");

Weber.Application.View.Form.Newsletter = Class.create(anyLib.Application.View, {
	form: null,
	isSend: false,
	submitButton: null,
	_requiredFields: [],

	render: function () {
		var me = this;

		var requiredFields = $$(".required");

		requiredFields.each(function (element) {
			var field = null;
			var label = null;

			if (element.hasClassName("item-text"))
				field = element.down("input");

			if (element.hasClassName("item-checkbox")) {
				field = element.down("input");

				if (field.id == "dsb")
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

		this.submitButton.on("click", function () {
			if (me.validates() === true && me.isSend == false) {
				me.isSend = true;
				me.messageBox.display('<div class="loading-overlay" style="width:221px;height:80px;"><br><br></div>');
				me.form.submit();
			}
		});
	},

	validates: function () {
		var errors = [];

		this._requiredFields.each(function (field) {
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

		if (errors.length == 0)
			return true;

		this.messageBox.display(
			'<div class="light-box-message">' +
				'<h3>' + t("bitte_ueberpruefen") + '</h3>' +
				'<p>' + t("pflichtfelder_nicht_korrekt") + ':</p>' +
				'<ul><li>' + errors.join('</li><li>') + '</li></ul>' +
			'</div>'
		);

		return false;
	},
});
