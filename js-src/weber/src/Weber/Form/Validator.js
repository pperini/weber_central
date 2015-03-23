/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Form");

Weber.Form.Validator = Class.create({
	/**
	 * Gets the element
	 * @returns {Object}
	 */
	getElement: function() {
		if (typeof(this._element) == "undefined")
			this.setElement(null);

		return this._element;
	},
	/**
	 * Sets the element
	 * @param {Object} element The element
	 */
	setElement: function(element) {
		this._element = element;

		return this;
	},
	isValid: function(){}
});
