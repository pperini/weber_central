/**
 * @package Weber.LightBox
 * @requiresPackage anyLib
 * @requiresPackage anyLib.UI.LightBox
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.LightBox.Layout");

Weber.LightBox.Layout.Message = Class.create(anyLib.UI.LightBox.Layout, {
	getTemplate: function() {
		if (typeof(this._template) == "undefined") {
			this.setTemplate(
				new Template(
					'<div id="#{backgroundId}" class="light-box-background" style="display:none;"></div>' +
					'<div id="#{containerId}" class="light-box-layer image-layer" style="display:none;width:100px;left:-50px;">' +
						'<a class="close ribbon ribbon-small-' + Weber.Settings.IconStyle + '-close" href="javascript:void(0);">' + t("schliessen") + '</a>' +
						'<div id="#{contentId}" class="image">#{content}</div>' +
						'<div class="clear"></div>' +
					'</div>'
				)
			);
		}

		return this._template;
	},

	_contentId: "message-light-box-video",
	_containerId: "message-light-box-layer",
	_backgroundId: "message-light-box-background",

	registerControls: function(lightBox) {
		var closeCallback = function() {
			lightBox.close();
		};

		this.getBackground().on("click", closeCallback);
		this.getContainer().down(".close").on("click", closeCallback);
	}
});
