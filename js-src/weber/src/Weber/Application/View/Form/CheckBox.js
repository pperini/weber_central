/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Form");

Weber.Application.View.Form.CheckBox = Class.create(anyLib.Application.View, {
	elements: [],

	render: function() {
		this.elements.each(function(element) {
			if (typeof(element.instance) == "object")
				return;

			var checkbox = new Weber.Form.Element.CheckBox();
			checkbox.setElement(element);

			element.instance = checkbox;
		});
	}
});