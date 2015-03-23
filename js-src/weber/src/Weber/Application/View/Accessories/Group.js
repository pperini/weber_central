/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Accessories");

Weber.Application.View.Accessories.Group = Class.create(anyLib.Application.View, {
	grillSelectionSelect: null,

	render: function() {
		var instance = this.grillSelectionSelect.instance;

		if (typeof(instance) != "object") {
			instance = new Weber.Form.Element.Select();
			instance.setElement(this.grillSelectionSelect);
		}

		instance.onValueChanged.add(function() {
			window.location = instance.getValue();
		});
	}
});
