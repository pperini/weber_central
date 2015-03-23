/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Career");

Weber.Application.View.Career.LocationMap = Class.create(anyLib.Application.View, {
	locationItems: null,
	currentItem: null,

	render: function() {
		var me = this;

		me.locationItems.each(function(locationItem) {
			if (locationItem.hasClassName("ignore-trigger") === true)
				return;

			locationItem.on("click", function() {
				var open = locationItem.hasClassName("active");

				if (me.currentItem != null) {
					me.currentItem.removeClassName("active");

					me.currentItem = null;
				}

				if (open === false) {
					locationItem.addClassName("active");

					me.currentItem = locationItem;
				}
			});
		});
	}
});
