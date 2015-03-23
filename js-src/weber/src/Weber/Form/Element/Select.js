/**
 * @package Weber.Form
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage anyLib.UI.ScrollBar
 * @requiresPackage anyLib.Collection
 * @requiresPackage Weber
 * @requiresPackage Weber.Tool
 */
anyLib.registerNamespace("Weber.Form.Element");

Weber.Form.Element.Select = Class.create(Weber.Form.Element, {
	/**
	   * Gets the selectElement
	   * @returns {Element}
	   */
	getSelectElement: function () {
		if (typeof (this._selectElement) == "undefined")
			this.setSelectElement(null);

		return this._selectElement;
	},
	/**
	   * Sets the selectElement
	   * @param {Element} selectElement The selectElement
	   */
	setSelectElement: function (selectElement) {
		this._selectElement = selectElement;

		return this;
	},
	/**
	   * Gets the textElement
	   * @returns {Element}
	   */
	getTextElement: function () {
		if (typeof (this._textElement) == "undefined")
			this.setTextElement(null);

		return this._textElement;
	},
	/**
	   * Sets the textElement
	   * @param {Element} textElement The textElement
	   */
	setTextElement: function (textElement) {
		this._textElement = textElement;

		return this;
	},
	/**
	   * Gets the optionContainer
	   * @returns {Element}
	   */
	getOptionContainer: function () {
		if (typeof (this._optionContainer) == "undefined")
			this.setOptionContainer(null);

		return this._optionContainer;
	},
	/**
	   * Sets the optionContainer
	   * @param {Element} optionContainer The optionContainer
	   */
	setOptionContainer: function (optionContainer) {
		this._optionContainer = optionContainer;

		return this;
	},
	/**
	   * Gets the selectedOption
	   * @returns {Number}
	   */
	getSelectedOption: function () {
		if (typeof (this._selectedOption) == "undefined")
			this.setSelectedOption(0);

		return this._selectedOption;
	},
	/**
	   * Sets the selectedOption
	   * @param {Number} selectedOption The selectedOption
	   */
	setSelectedOption: function (selectedOption) {
		this._selectedOption = selectedOption;

		return this;
	},
	/**
	   * Gets the scrollBar
	   * @returns {anyLib.UI.ScrollBar}
	   */
	getScrollBar: function () {
		if (typeof (this._scrollBar) == "undefined")
			this.setScrollBar(null);

		return this._scrollBar;
	},
	/**
	   * Sets the scrollBar
	   * @param {anyLib.UI.ScrollBar} scrollBar The scrollBar
	   */
	setScrollBar: function (scrollBar) {
		this._scrollBar = scrollBar;

		return this;
	},
	/**
	   * Gets the options
	   * @returns {anyLib.Collection.KeyValue}
	   */
	getOptions: function () {
		if (typeof (this._options) == "undefined")
			this.setOptions(new anyLib.Collection.KeyValue());

		return this._options;
	},
	/**
	   * Sets the options
	   * @param {anyLib.Collection.KeyValue} options The options
	   */
	setOptions: function (options) {
		this._options = options;

		return this;
	},
	/**
	   * Gets the clickHandle
	   * @returns {Object}
	   * @private
	   */
	_getClickHandle: function () {
		if (typeof (this._clickHandle) == "undefined")
			this._setClickHandle(null);

		return this._clickHandle;
	},
	/**
	   * Sets the clickHandle
	   * @param {Object} clickHandle The clickHandle
	   * @private
	   */
	_setClickHandle: function (clickHandle) {
		this._clickHandle = clickHandle;

		return this;
	},
	/**
	   * Disables the element
	   */
	disable: function () {
		this._getClickHandle().stop();

		if (this.getOptionContainer().visible() === true)
			this.close();
	},
	/**
	   * Enables the element
	   */
	enable: function () {
		this._getClickHandle().start();
	},
	/**
	   * Handles the initialization
	   * @private
	   */
	_setup: function () {


		var me = this;

		this.setTextElement(this.getElement().down(".text"));
		this.setSelectElement(this.getElement().down("select"));
		this.setOptionContainer(this.getElement().down(".option-container"));

		var divOptions = this.getOptionContainer().select(".option");
		var selectOptions = this.getSelectElement().select("option");

		if (divOptions.length != selectOptions.length)
			throw new anyLib.Exception(this, this, "The number of options (" + divOptions.length + ") does not match the select element (" + selectOptions.length + ")");

		var maxOptionTextWidth = me.getTextElement().measure("width") - 40;

		var selectAfterInitializing = false;

		var longestEntry = 0;

		if (me.getOptionContainer().hasClassName("content-expandable")) {
			divOptions.each(function (divOption) {
				var measureEntry = Weber.tools.stringWidth.measureStringCharacters(
							divOption.innerHTML,
							divOption.getStyle("font-size"),
							divOption.getStyle("font-family")
						);

				if (measureEntry > longestEntry) {
					longestEntry = measureEntry;
				}
			});

			longestEntry = longestEntry + 40;

			divOptions.each(function (divOption) {
				divOption.setStyle({
					width: (longestEntry) + "px"
				});
			});

			me.getOptionContainer().setStyle({
				width: (longestEntry + 11) + "px"
			});
		}

		selectOptions.each(function (selectOption, index) {
			var option = new Weber.Form.Element.Select.Option();

			var optionElement = divOptions[index];

			option.setValue(selectOption.value);
			option.setLabel(optionElement.innerHTML);

			if (optionElement.hasClassName("selected"))
				selectAfterInitializing = index;

			optionElement.on("click", function (event) {
				if (optionElement.hasClassName("disabled")) {
					Event.stop(event);

					return;
				}

				me.select(index);
			});


			if (!me.getOptionContainer().hasClassName("content-expandable")) {
				if (typeof (optionElement.textShortened) == "undefined" || optionElement.textShortened != true) {
					optionElement.textShortened = true;

					if (maxOptionTextWidth > 0) {
						optionElement.innerHTML = Weber.tools.stringWidth.trimToFit(
										optionElement.innerHTML,
										optionElement.getStyle("font-size"),
										optionElement.getStyle("font-family"),
										maxOptionTextWidth,
										"..."
									);
					}
				}
			}

			option.setDivOption(optionElement);
			option.setSelectOption(selectOption);

			me.getOptions().add(index, option);
		});

		if (selectAfterInitializing !== false)
			this.select(selectAfterInitializing);

		var labelElements = $$("label[for=" + this.getSelectElement().id + "]");

		if (labelElements.length > 0) {
			labelElements.each(function (labelElement) {
				labelElement.on("click", function () {
					me.toggle();
				});
			});
		}

		var resetSelectionTrigger = this.getOptionContainer().down(".reset-selection");

		if (resetSelectionTrigger) {
			resetSelectionTrigger.on("click", function () {
				me.select(0);
			});
		}

		this._setClickHandle(this.getElement().on("click", function () {
			me.toggle();
		}));

		document.on("click", function (event) {
			if (Event.findElement(event).descendantOf(me.getElement()) === false)
				me.close();
		});

		var optionContainerHeight = this.getOptionContainer().measure("height");

		if (optionContainerHeight > 340) {
			this.getOptionContainer().setStyle({
				height: "340px"
			});

			this.getOptionContainer().addClassName("scrolling");

			this.setScrollBar(new anyLib.UI.ScrollBar.Vertical());
			this.getScrollBar().setContainer(this.getOptionContainer().down(".option-scrubber"));
			this.getScrollBar().setHandle(this.getOptionContainer().down(".option-scrubber-handle"));

			var maximumOffset = optionContainerHeight - 340;

			var optionList = this.getOptionContainer().down(".option-list");

			this.getScrollBar().onScroll.add(function (scrollBar) {
				var listStyle = ((maximumOffset / 100) * scrollBar.getValue());

				if (isNaN(listStyle))
					return;

				optionList.setStyle({
					top: "-" + listStyle + "px"
				});
			});

			if ('ontouchstart' in document.documentElement) {
				this.getScrollBar().getContainer().hide();

				this.getOptionContainer().setStyle("overflow-y: scroll;-webkit-overflow-scrolling: touch;");

				return;
			}

			document.on(anyLib.Event.getMouseScrollEvent(), function (event) {
				if (Event.findElement(event).descendantOf(me.getElement()) === false)
					return;

				Event.stop(event);

				var value = me.getScrollBar().getValue();

				if (isNaN(value))
					value = 0;

				if (anyLib.Event.getMouseScrollDelta(event) > 0) {
					value = value - 10;

					if (value < 0)
						value = 0;
				} else {
					value = value + 10;

					if (value > 100)
						value = 100;
				}

				me.getScrollBar().setToValue(value);
			});
		}
	},
	open: function () {
		this.getOptionContainer().show();

		return this;
	},
	close: function () {
		this.getOptionContainer().hide();

		if (this.getScrollBar() != null)
			this.getScrollBar().setToValue(0);

		return this;
	},
	toggle: function () {
		if (this.getOptionContainer().visible() === true)
			return this.close();

		return this.open();
	},
	select: function (optionIndex) {
		this.setSelectedOption(optionIndex);

		this.getSelectElement().selectedIndex = optionIndex;

		this.getTextElement().innerHTML = Weber.tools.stringWidth.trimToFit(
				this.getOptions().get(this.getSelectedOption()).getLabel(),
				this.getTextElement().getStyle("font-size"),
				this.getTextElement().getStyle("font-family"),
				this.getTextElement().measure("width") - 40,
				"..."
			);

		this.onValueChanged.fire(this);
	},
	getValue: function () {
		return this.getOptions().get(this.getSelectedOption()).getValue();
	}
});
