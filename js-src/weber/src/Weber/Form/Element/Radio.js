/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage anyLib.UI.ScrollBar
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Form.Element");

Weber.Form.Element.Radio = Class.create(Weber.Form.Element, {
	/**
	 * Gets the isChecked
	 * @returns {Boolean}
	 */
	getIsChecked: function() {
		return this.getRadioElement().checked;
	},
	/**
	 * Gets the RadioElement Group
	 * @returns {Element}
	 */
	getRadioGroupElements: function() {
		if (typeof(this._RadioGroupElements) == "undefined")
			this.setRadioGroupElements(null);

		return this._RadioGroupElements;
	},
	/**
	 * Sets the RadioElement Group
	 * @param {Element} RadioElement Group The RadioElement Group
	 */
	setRadioGroupElements: function(RadioGroupElements) {
		this._RadioGroupElements = RadioGroupElements;

		return this;
	},
	/**
	 * Gets the RadioElement
	 * @returns {Element}
	 */
	getRadioElement: function() {
		if (typeof(this._RadioElement) == "undefined")
			this.setRadioElement(null);

		return this._RadioElement;
	},
	/**
	 * Sets the RadioElement
	 * @param {Element} RadioElement The RadioElement
	 */
	setRadioElement: function(RadioElement) {
		this._RadioElement = RadioElement;

		return this;
	},
	/**
	 * Disables the element
	 */
	disable: function() {
		this.getRadioElement().disabled = true;
	},
	/**
	 * Enables the element
	 */
	enable: function() {
		this.getRadioElement().disabled = false;
	},
	_setup: function() {
		var me = this;

		this.setRadioElement(this.getElement().down("input"));

		if (this.getRadioElement().checked == true)
			this.check();

		var label = this.getRadioElement().up("label");

		label.on("click", function() {
			try {
				label.blur();
				me.getRadioElement().blur();
			} catch (e) {
				console.log(e);
			}
		});

		this.getRadioElement().on("change", function() {
			me._setCheckedStyles(me.getRadioGroupElements(), this);

			me.onValueChanged.fire(this);
		});
	},
	_setCheckedStyles: function(groupElements, checkedElement) {
		if (groupElements == null) {
			checkedElement.getElement().addClassName("checked");
			checkedElement.getElement().removeClassName("unchecked");
			return this;
		}

		groupElements.each(function(radioElement) {
			var inputElement = radioElement.select('input').first();
			if (radioElement.select('input').first() == checkedElement) {
				radioElement.addClassName("checked");
				radioElement.removeClassName("unchecked");
				return this;
			}

			radioElement.addClassName("unchecked");
			radioElement.removeClassName("checked");
			return this;
		})
	},
	check: function() {
		this._setCheckedStyles(this.getRadioGroupElements(), this);

		this.getRadioElement().checked = true;

		this.onValueChanged.fire(this);

		return this;
	},
	unCheck: function() {
		this._setCheckedStyles(this.getRadioGroupElements(), this);

		this.getRadioElement().checked = false;

		this.onValueChanged.fire(this);

		return this;
	},
	toggle: function() {
		if (this.getIsChecked() === true)
			return this.unCheck();

		return this.check();
	},
	getValue: function() {
		return this.getIsChecked();
	}
});
