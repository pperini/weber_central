/**
 * @package Weber.Maps
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */

anyLib.registerNamespace("Weber.Maps");

Weber.Maps.CustomStyle = Class.create({
	map: null,
	options: {
		settings: null,
		mapContainer: null,
		startingPoint: null
	},

	initialize: function(options) {
		this.options = options;
	},

	getMap: function() {
		return this.map;
	},

	render: function() {
		var mapType = "custom";

		var mapStyles = [
			{
				"stylers": [
					{ "saturation": -100 }
				]
			}
		];

		var customMapType = new google.maps.StyledMapType(mapStyles, { name: 'custom' });

		this.map = new google.maps.Map(this.options.mapContainer, {
			center: this.options.startingPoint,
			zoom: this.options.settings.StartZoom,
			mapTypeId: mapType
		});

		this.map.mapTypes.set('custom', customMapType);
	},

	getIntroMarker: function(introMarkerOptions) {
		var customIcon = this.getCustomIcon();

		introMarkerOptions.icon = customIcon.icon;
		introMarkerOptions.shadow = customIcon.shadow;

		return new google.maps.Marker(introMarkerOptions);
	},

	getInfoBox: function(windowTemplate, content) {

		var classname = "weber-overlay";

		if (content["classname"]) {
			classname = classname + " " + content['classname']
		}

		return new InfoBox({
			content: windowTemplate.evaluate(content),
			alignBottom: true,
			boxClass: classname,
			closeBoxMargin: "10px",
			pixelOffset: new google.maps.Size(-142, -65),
			closeBoxURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMxMzA5QjI0RTdEODExRTI5N0MwQzE1Q0UyNzY4MUVCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMxMzA5QjI1RTdEODExRTI5N0MwQzE1Q0UyNzY4MUVCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzEzMDlCMjJFN0Q4MTFFMjk3QzBDMTVDRTI3NjgxRUIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzEzMDlCMjNFN0Q4MTFFMjk3QzBDMTVDRTI3NjgxRUIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6gw28/AAAAxklEQVR42lzQQQcCQRTA8WlFhw7RKZZOZYmIiNIhbZdOfYC+11677rVTpIgOe9pTXWJZIrpGHaLU//GGqeE3Zt+8mXn7ClEULYwxfcyRmt/RQSxxj6mHAFs9YEdXY7IXSOIUOSpYY6hJsq4iw6zIdMZAT7ewwQtlnBDi4ukzV4xwREmTcpskCd5f8R9nLbe+7YdNrGGHNp54oKkx3ybWsdf67phgjJvTDV9+ZoWGbkgHEn0ldNqzlBsPTuGJU2OqMdnLvgIMAC2OK96V/q0OAAAAAElFTkSuQmCC'
		});
	},

	getCustomIcon: function() {
		var shadow = {
			url: this.options.settings['customIcon'] + '_shadow.png',
			anchor: new google.maps.Point(6, 20)
		};

		return {
			icon: this.options.settings['customIcon'] + '.png',
			shadow: shadow
		};
	}
});

