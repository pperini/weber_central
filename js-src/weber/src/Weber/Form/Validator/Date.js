/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */

anyLib.registerNamespace("Weber.Form.Validator");

Weber.Form.Validator.Date = Class.create(Weber.Form.Validator, {

	isValid: function() {
		var validation = true;
		var elements = this.getElement();
		var validElements = elements.length;
		var isRequired = elements.first().up('.form-item').hasClassName('required');

		elements.each(function(select) {
			if (select.value == "") {
				if (isRequired) {
					validation = false;
				}
				validElements--;
			}
		})

		if (!isRequired) {
			if (0 < validElements && validElements < 3) {
				validation = false;
			}
		}

		return validation;
	}

});
