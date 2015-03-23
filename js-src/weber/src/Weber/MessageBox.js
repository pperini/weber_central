/**
 * @package Weber.MessageBox
 * @requiresPackage anyLib
 * @requiresPackage anyLib.UI.LightBox
 * @requiresPackage Weber
 * @requiresPackage Weber.LightBox
 */
anyLib.registerNamespace("Weber");

Weber.MessageBox = Class.create({
	/**
	 * Gets the lightBox
	 * @returns {anyLib.UI.LightBox}
	 */
	getLightBox: function() {
		if (typeof(this._lightBox) == "undefined")
			this._setUpLightBox();

		return this._lightBox;
	},
	/**
	 * Sets the lightBox
	 * @param {anyLib.UI.LightBox} lightBox The lightBox
	 */
	setLightBox: function(lightBox) {
		this._lightBox = lightBox;

		return this;
	},
	_setUpLightBox: function() {
		this.setLightBox(new anyLib.UI.LightBox());
		this.getLightBox().setLayout(new Weber.LightBox.Layout.Message());
	},
	/**
	 * Gets the content
	 * @returns {anyLib.UI.LightBox.Content}
	 */
	_getContent: function() {
		if (typeof(this._content) == "undefined")
			this._setContent(null);

		return this._content;
	},
	/**
	 * Sets the content
	 * @param {anyLib.UI.LightBox.Content} content The content
	 */
	_setContent: function(content) {
		this._content = content;

		return this;
	},
	display: function(message) {
		var content = new anyLib.UI.LightBox.Content();
		content.setKey(Weber.Utilities.getDateNow());
		content._setContent(message);

		this._setContent(content.getKey());

		this.getLightBox().addContent(content);

		this.getLightBox().change(this._getContent());
	},
	confirm: function(text, buttonText, confirmCallback, cancelCallback) {
		var react = true;

		this.getLightBox().afterChange.add(function() {
			if (react === false)
				return;

			react = false;

			$$(".form-button.confirm-no").first().on("click", cancelCallback);
			$$(".form-button.confirm-yes").first().on("click", confirmCallback);
		});

		this.display(
			'<div class="grid-8">' +
				'<div class="columns-8">' +
					'<h3>' + text + '</h3>' +
				'</div>' +
				'<div class="columns-8 submit-area">' +
					'<div class="button-action rgt">' +
						'<a class="button-background form-button red confirm-yes" href="javascript:void(0);">' +
							buttonText +
							'<span class="button-background left"></span><span class="button-background right"></span>' +
						'</a>' +
					'</div>' +
					'<div class="button-action rgt">' +
						'<a class="button-background form-button confirm-no" href="javascript:void(0);">' +
							t("confirm_cancel") +
							'<span class="button-background left"></span><span class="button-background right"></span>' +
						'</a>' +
					'</div>' +
					'<div class="clear"></div>' +
				'</div>' +
				'<div class="clear"></div>' +
			'</div>'
		);
	}
});
