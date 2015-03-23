/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Form");

Weber.Application.View.Form.Select = Class.create(anyLib.Application.View, {
	elements: [],

	render: function() {
		var zIndex = 100;

		this.elements.each(function(element) {
			if (typeof(element.instance) == "object")
				return;

			var select = new Weber.Form.Element.Select();
			select.setElement(element);

			element.setStyle({
				zIndex: zIndex--
			});

			element.instance = select;
		});
	}
});
