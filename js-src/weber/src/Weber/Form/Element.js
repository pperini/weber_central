/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage anyLib.Exception
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Form");

Weber.Form.Element = Class.create({
	initialize: function() {
		this.onValueChanged = new anyLib.Event.Collection();
	},
	/**
	 * Gets the element
	 * @returns {Element}
	 */
	getElement: function() {
		if (typeof(this._element) == "undefined")
			this.setElement(null);

		return this._element;
	},
	/**
	 * Sets the element
	 * @param {Element} element The element
	 */
	setElement: function(element) {
		this._element = element;

		this._setup();

		return this;
	},
	/**
	 * Gets the enabled
	 * @returns {Boolean}
	 * @private
	 */
	_getEnabled: function() {
		if (typeof(this._enabled) == "undefined")
			this._setEnabled(true);

		return this._enabled;
	},
	/**
	 * Sets the enabled
	 * @param {Boolean} enabled The enabled
	 * @private
	 */
	_setEnabled: function(enabled) {
		this._enabled = enabled;

		return this;
	},
	/**
	 * Checks if the element is enabled
	 * @return {Boolean}
	 */
	isEnabled: function() {
		return this._getEnabled();
	},
	/**
	 * Enables the element
	 */
	enable: Prototype.emptyFunction,
	/**
	 * Disables the element
	 */
	disable: Prototype.emptyFunction,
	/**
	 * Handles the initialization
	 * @private
	 */
	_setup: Prototype.emptyFunction,
	/**
	 * Returns the value for the form submission
	 */
	getValue: function() {
		throw new anyLib.Exception.NotImplemented(this, "getValue");
	}
});
