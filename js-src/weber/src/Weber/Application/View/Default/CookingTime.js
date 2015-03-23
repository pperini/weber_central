/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.CookingTime = Class.create(anyLib.Application.View, {
	selectElement: null,

	render: function() {
		var instance = this.selectElement.instance;

		if (typeof(this.selectElement.instance) != "object") {
			instance = new Weber.Form.Element.Select();
			instance.setElement(this.selectElement);
		}

		instance.onValueChanged.add(function() {
			window.location.href = instance.getValue();
		});
	}
});