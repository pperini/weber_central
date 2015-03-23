/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage Weber
 * @requiresPackage Weber.Tool
 */
anyLib.registerNamespace("Weber.Form.Element.Select");

Weber.Form.Element.Select.Option = Class.create({
	/**
	 * Gets the selectOption
	 * @returns {Element}
	 */
	getSelectOption: function() {
		if (typeof(this._selectOption) == "undefined")
			this.setSelectOption(null);

		return this._selectOption;
	},
	/**
	 * Sets the selectOption
	 * @param {Element} selectOption The selectOption
	 */
	setSelectOption: function(selectOption) {
		this._selectOption = selectOption;

		return this;
	},
	/**
	 * Gets the divOption
	 * @returns {Element}
	 */
	getDivOption: function() {
		if (typeof(this._divOption) == "undefined")
			this.setDivOption(null);

		return this._divOption;
	},
	/**
	 * Sets the divOption
	 * @param {Element} divOption The divOption
	 */
	setDivOption: function(divOption) {
		this._divOption = divOption;

		return this;
	},
	/**
	 * Gets the value
	 * @returns {Object}
	 */
	getValue: function() {
		if (typeof(this._value) == "undefined")
			this.setValue(null);

		return this._value;
	},
	/**
	 * Sets the value
	 * @param {Object} value The value
	 */
	setValue: function(value) {
		this._value = value;

		return this;
	},
	/**
	 * Gets the label
	 * @returns {String}
	 */
	getLabel: function() {
		if (typeof(this._label) == "undefined")
			this.setLabel("");

		return this._label;
	},
	/**
	 * Sets the label
	 * @param {String} label The label
	 */
	setLabel: function(label) {
		this._label = label;

		return this;
	}
});
