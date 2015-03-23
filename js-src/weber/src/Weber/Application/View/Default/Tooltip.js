/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Tooltip
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.Tooltip = Class.create(anyLib.Application.View, {
	tooltipCollection: [],

	render: function() {
		this.tooltipCollection.each(function(tooltipElement) {
			var tooltip = new Weber.Tooltip();

			Object.values(Weber.Tooltip.PositioningModes).each(function(mode) {
				if (tooltipElement.hasClassName(mode) == false)
					return;

				tooltip.setPositioningMode(mode);
			});

			tooltip.setParentElement(tooltipElement);
			tooltip.setElement(tooltipElement.down(".tooltip-item"));

			tooltip.activate();

			tooltipElement.tooltipInstance = tooltip;
		});
	}
});
