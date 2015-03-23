/**
 * @package Weber.Tool
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Collection
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Tool");

Weber.Tool.StringWidth = Class.create({
	/**
	 * Gets the measureElement
	 * @returns {Element}
	 */
	getMeasureElement: function() {
		if (typeof(this._measureElement) == "undefined")
			this.setMeasureElement(null);

		return this._measureElement;
	},
	/**
	 * Sets the measureElement
	 * @param {Element} measureElement The measureElement
	 */
	setMeasureElement: function(measureElement) {
		this._measureElement = measureElement;

		return this;
	},
	/**
	 * Gets the memory
	 * @returns {anyLib.Collection.KeyValue}
	 */
	getMemory: function() {
		if (typeof(this._memory) == "undefined")
			this.setMemory(new anyLib.Collection.KeyValue());

		return this._memory;
	},
	/**
	 * Sets the memory
	 * @param {anyLib.Collection.KeyValue} memory The memory
	 */
	setMemory: function(memory) {
		this._memory = memory;

		return this;
	},

	/**
	 *
	 * @param {String} string
	 * @return {Number}
	 */
	_measureString: function(string) {
		this.getMeasureElement().innerHTML = string;

		return this.getMeasureElement().getWidth();
	},

	/**
	 *
	 * @param {String} input
	 * @param {String} fontSize
	 * @param {String} fontFamily
	 * @return {Number}
	 */
	measureStringCharacters: function(input, fontSize, fontFamily) {
		if (input.length <= 1)
			return this.measureChar(input, fontSize, fontFamily);

		var me = this;

		var width = 0;
		var characters = input.split("");

		characters.each(function(character) {
			width = width + me.measureChar(character, fontSize, fontFamily);
		});

		return width;
	},

	/**
	 *
	 * @param {String} character
	 * @param {String} fontSize
	 * @param {String} fontFamily
	 * @return {Number}
	 */
	measureChar: function(character, fontSize, fontFamily) {
		if (character.length == 0)
			return 0;

		if (character.length > 1)
			return this.measureStringCharacters(character, fontSize, fontFamily);

		if (!fontSize)
			fontSize = this.getMeasureElement().getStyle("font-size");

		if (!fontFamily)
			fontFamily = this.getMeasureElement().getStyle("font-family");

		this.getMeasureElement().setStyle({
			fontSize: fontSize,
			fontFamily: fontFamily
		});

		var key = fontSize + fontFamily;

		if (!this.getMemory().hasKey(key))
			this.getMemory().set(key, new anyLib.Collection.KeyValue());

		if (!this.getMemory().get(key).hasKey(character))
			this.getMemory().get(key).set(character, this._measureString(character));

		return this.getMemory().get(key).get(character);
	},

	/**
	 *
	 * @param {String} input
	 * @param {String} fontSize
	 * @param {String} fontFamily
	 * @param {Number} maxWidth
	 * @return {String}
	 */
	trimToFit: function(input, fontSize, fontFamily, maxWidth, ellipse) {
		var me = this;

		var inputWidth = this.measureStringCharacters(input, fontSize, fontFamily);

		if (inputWidth <= maxWidth)
			return input;

		if (!ellipse)
			ellipse = "";

		maxWidth = maxWidth - this.measureStringCharacters(ellipse, fontSize, fontFamily);

		var removedCharacters = 0;

		var done = false;

		input.split("").reverse().each(function(character) {
			if (done)
				return;

			var charWidth = me.measureChar(character, fontSize, fontFamily);

			inputWidth = inputWidth - charWidth;

			if (inputWidth <= maxWidth)
				done = true;

			removedCharacters++;
			input = input.substr(0, input.length - 1);
		});

		return input + ellipse;
	}
});
