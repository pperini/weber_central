/**
 * @package Weber.Maps
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */

anyLib.registerNamespace("Weber.Maps");

Weber.Maps.Default = Class.create({
	map: null,
	options: {
		settings: null,
		mapContainer: null,
		startingPoint: null
	},

	initialize: function(options) {
		this.options = options;

		return this;
	},

	getMap: function() {
		return this.map;
	},

	render: function() {
		var mapType = google.maps.MapTypeId.HYBRID;

		this.map = new google.maps.Map(this.options.mapContainer, {
			center: this.options.startingPoint,
			zoom: this.options.settings.StartZoom,
			mapTypeId: mapType
		});
	},

	getInfoBox: function(windowTemplate, content) {
		return new google.maps.InfoWindow({
			content: windowTemplate.evaluate(content)
		});
	},

	getIntroMarker: function(introMarkerOptions) {
		return new google.maps.Marker(introMarkerOptions);
	}
});
