/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Form");

Weber.Application.View.Form.Radio = Class.create(anyLib.Application.View, {
	elements: [],

	render: function() {
		this.elements.each(function(element) {
			if (typeof(element.instance) == "object") {
				return;
			}

			var radio = new Weber.Form.Element.Radio();
			radio.setElement(element);
			radio.setRadioGroupElements(element.up(".item-radio-group").select('.radio'));

			element.instance = radio;
		});
	}
});
