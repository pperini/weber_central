/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */

anyLib.registerNamespace("Weber.Form.Validator");

Weber.Form.Validator.Money = Class.create(Weber.Form.Validator, {

isValid: function() {
		//replace all numbers, comma and points
		var value = this.getElement().value.replace(/[0-9\,\.]+/g, '');

		// check if value is empty
		return value.length == 0;
	}

});
