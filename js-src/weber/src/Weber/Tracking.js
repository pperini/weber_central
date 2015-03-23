/**
 * @package Weber.Tracking
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber");

Weber.Tracking = Class.create({
	initialize: function() {
		this.onTrigger = new anyLib.Event.Collection();
	},
	/**
	 * @param {Weber.Tracking.Data} data
	 */
	trigger: function(data) {
		this.onTrigger.fire(data);
	}
});
