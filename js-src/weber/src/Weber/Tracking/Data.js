/**
 * @package Weber.Tracking
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Tracking");

Weber.Tracking.Data = Class.create({
	/**
	 * Gets the sourceElement
	 * @returns {Element}
	 */
	getSourceElement: function() {
		if (typeof(this._sourceElement) == "undefined")
			this.setSourceElement(null);

		return this._sourceElement;
	},
	/**
	 * Sets the sourceElement
	 * @param {Element} sourceElement The sourceElement
	 */
	setSourceElement: function(sourceElement) {
		this._sourceElement = sourceElement;

		return this;
	},
	/**
	 * Gets the group
	 * @returns {String}
	 */
	getGroup: function() {
		if (typeof(this._group) == "undefined")
			this.setGroup("default");

		return this._group;
	},
	/**
	 * Sets the group
	 * @param {String} group The group
	 */
	setGroup: function(group) {
		this._group = group;

		return this;
	},
	/**
	 * Gets the action
	 * @returns {String}
	 */
	getAction: function() {
		if (typeof(this._action) == "undefined")
			this.setAction(null);

		return this._action;
	},
	/**
	 * Sets the action
	 * @param {String} action The action
	 */
	setAction: function(action) {
		this._action = action;

		return this;
	},
	/**
	 * Gets the label
	 * @returns {String}
	 */
	getLabel: function() {
		if (typeof(this._label) == "undefined")
			this.setLabel(null);

		return this._label;
	},
	/**
	 * Sets the label
	 * @param {String} label The label
	 */
	setLabel: function(label) {
		this._label = label;

		return this;
	},
	/**
	 * Gets the value
	 * @returns {String}
	 */
	getValue: function() {
		if (typeof(this._value) == "undefined")
			this.setValue(null);

		return this._value;
	},
	/**
	 * Sets the value
	 * @param {String} value The value
	 */
	setValue: function(value) {
		this._value = value;

		return this;
	}
});
