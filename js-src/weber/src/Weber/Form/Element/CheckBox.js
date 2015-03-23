/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage anyLib.UI.ScrollBar
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Form.Element");

Weber.Form.Element.CheckBox = Class.create(Weber.Form.Element, {
	/**
	 * Gets the isChecked
	 * @returns {Boolean}
	 */
	getIsChecked: function() {
		return this.getCheckBoxElement().checked;
	},
	/**
	 * Gets the checkBoxElement
	 * @returns {Element}
	 */
	getCheckBoxElement: function() {
		if (typeof(this._checkBoxElement) == "undefined")
			this.setCheckBoxElement(null);

		return this._checkBoxElement;
	},
	/**
	 * Sets the checkBoxElement
	 * @param {Element} checkBoxElement The checkBoxElement
	 */
	setCheckBoxElement: function(checkBoxElement) {
		this._checkBoxElement = checkBoxElement;

		return this;
	},
	/**
	 * Disables the element
	 */
	disable: function() {
		this.getCheckBoxElement().disabled = true;
	},
	/**
	 * Enables the element
	 */
	enable: function() {
		this.getCheckBoxElement().disabled = false;
	},
	_setup: function() {
		var me = this;

		this.setCheckBoxElement(this.getElement().down("input"));

		if (this.getCheckBoxElement().checked == true)
			this.check();

		var label = this.getCheckBoxElement().up("label");

		label.on("click", function() {
			try {
				label.blur();
				me.getCheckBoxElement().blur();
			} catch (e) {
				console.log(e);
			}
		});

		this.getCheckBoxElement().on("change", function() {
			me._setCheckedStyles(me.getIsChecked());

			me.onValueChanged.fire(this);
		});
	},
	_setCheckedStyles: function(checked) {
		if (checked === true) {
			this.getElement().addClassName("checked");
			this.getElement().removeClassName("unchecked");

			return this;
		}

		this.getElement().addClassName("unchecked");
		this.getElement().removeClassName("checked");

		return this;
	},
	check: function() {
		this._setCheckedStyles(true);

		this.getCheckBoxElement().checked = true;

		this.onValueChanged.fire(this);

		return this;
	},
	unCheck: function() {
		this._setCheckedStyles(false);

		this.getCheckBoxElement().checked = false;

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
