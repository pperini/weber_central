/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.WeberTv = Class.create(anyLib.Application.View, {
	selectElement: null,

	render: function() {
		var me = this;

		this.selectElement.instance.onValueChanged.add(function() {
			window.location = me.selectElement.instance.getValue();
		});
	}
});
