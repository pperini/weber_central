/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Collection
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Maps
 */
anyLib.registerNamespace("Weber.Application.View.Dealer");

Weber.Application.View.Dealer.Default = Class.create(anyLib.Application.View, {
	map: null,
	maps: null,
	settings: {},
	mapStyle: null,
	goToLegend: null,
	formElement: null,
	searchField: null,
	specialFilter: [],
	submitButton: null,
	mapContainer: null,
	categoryFilter: [],
	startingPoint: null,
	searchAktive: false,
	selectedDistance: 0,
	distanceSelect: null,
	searchResultItems: [],
	currentInfoWindow: null,
	specialFilterList: null,
	categoryFilterList: null,
	resultCenterPosition: null,
	searchResultContainer: null,

	render: function() {
		var me = this;

		if (this.mapContainer.hasClassName('custommap')) {
			this.mapStyle = 'custom';
		}
		if (this.searchAktive) {
			Weber.googleMap.loadCallback = function() {
				me.mapContainer.addClassName('active');
				if (me.mapStyle != null) {
					var infoBoxScript = new Element("script", {
						type: "text/javascript",
						src: Weber.googleMap.customInfoBox
					});

					$$("head").first().insert({
						bottom: infoBoxScript
					});


					function renderWhenInfoboxIsReady() {
						if (typeof window["InfoBox"] == "undefined") {
							setTimeout(function() {
								renderWhenInfoboxIsReady();
							}, 50);
						} else {
							me.renderMap();
						}
					}

					renderWhenInfoboxIsReady();

				} else {
					me.renderMap();
				}
			};
		} else {
			this.mapContainer.hide();
		}

		var scriptTemplate = new Template(Weber.googleMap.scriptSrc);

		var scriptTag = new Element("script", {
			type: "text/javascript",
			src: scriptTemplate.evaluate({
				key: Weber.googleMap.key,
				callback: "Weber.googleMap.loadCallback"
			})
		});

		$$("head").first().insert({
			bottom: scriptTag
		});

		if (this.goToLegend != null) {
			this.goToLegend.on("click", function(event) {
				me.gotoLegend(this);
				event.preventDefault();
			});
		}

		this.submitButton.on("click", function() {
			me.startNewSearch();
		});

		this.formElement.on("submit", function(event) {
			Event.stop(event);

			me.startNewSearch();
		});

		if (this.mapStyle != null) {
			this.distanceSelect.instance.onValueChanged.add(function(select) {
				me.selectedDistance = select.getValue();
			});
		}
	},

	gotoLegend: function(element) {
		var legend = $(element.readAttribute('data-legend-id'));
		var header = legend.down('.heading');
		var foldoutItem = legend.down('.foldout-item');
		var foldoutItemContent = foldoutItem.down(".content");

		window.scrollTo(0, legend.offsetTop);

		foldoutItem.addClassName("opened automate-open");
		foldoutItemContent.show();

		var textClose = header.readAttribute('data-close');
		var textDestination = header.down('.open-close');
		textDestination.update(textClose);
	},

	startNewSearch: function() {
		var currentUrl = new anyLib.Url(window.location.href.toString());

		currentUrl.getQueryString().getItems().clear();

		var searchQuery = $F(this.searchField);


		currentUrl.getQueryString().getItems().set("search", searchQuery);
		currentUrl.getQueryString().getItems().set("distance", this.selectedDistance);

		document.fire(Weber.Tracking.Events.DealerSearch.StartSearch, {
			search: searchQuery,
			distance: this.selectedDistance
		});

		window.location.href = currentUrl.getParsed();
	},

	filterResults: function() {
		var me = this;

		if (this.currentInfoWindow != null)
			this.currentInfoWindow.close();

		this.currentInfoWindow = null;

		var bounds = new google.maps.LatLngBounds();

		this.searchResultItems.each(function(result) {
			var visible = (result.data.distance <= me.selectedDistance);

			if (visible && me.categoryFilterList.getCount() > 0)
				visible = me.categoryFilterList.hasValue(result.data.categoryID);

			if (visible && me.specialFilterList.getCount() > 0) {
				var matches = 0;
				var matchesNeeded = me.specialFilterList.getCount();

				result.data.specials.each(function(specialID) {
					if (matches == matchesNeeded)
						return;

					if (me.specialFilterList.hasValue(specialID))
						matches++;
				});

				visible = (matches == matchesNeeded);
			}

			if (!visible) {
				if (!result.visible())
					return;

				result.hide();
				result.marker.setMap(null);

				return;
			}

			bounds.extend(result.markerPosition);

			if (result.visible())
				return;

			result.show();
			result.marker.setMap(me.map);
		});

		if (bounds.isEmpty() && this.selectedDistance < 200) {
			this.selectedDistance = 200;

			this.filterResults();
		}

		if (!bounds.isEmpty()) {
			this.map.fitBounds(bounds);

			return;
		}

		this.map.panTo(this.resultCenterPosition);

		this.map.setZoom(this.settings.StartZoom);
	},

	renderMap: function() {
		var me = this;
		this.startingPoint = new google.maps.LatLng(me.settings.StartLatitude, me.settings.StartLongitude);

		var options = {
			settings: this.settings,
			mapContainer: this.mapContainer,
			startingPoint: this.startingPoint
		};

		if (this.mapStyle != null) {
			this.maps = new Weber.Maps.CustomStyle(options)
		} else {
			this.maps = new Weber.Maps.Default(options);
		}

		this.maps.render();

		this.map = this.maps.getMap();

		if (this.searchResultItems.length == 0) {
			this.setIntroMarker();
		} else {
			this.setResults();
		}
	},

	setIntroMarker: function() {
		var me = this;

		var categoryIcon = new Template('<img src="#{src}" class="dealer-category-icon">');

		var introData = {
			text: this.settings.Intro,
			categories: ""
		};

		$$(".dealer-search-legend-category-item img.dealer-category-icon").each(function(image) {
			introData.categories = introData.categories + categoryIcon.evaluate({ src: image.src })
		});

		var introInfoWindowTemplate = new Template('<div class="dealer-search-map-info-window dealer-search-map-info-window-intro">' + '<div class="lft">' + '#{categories}' + '</div>' + '<div class="lft">' + '<p>#{text}</p>' + '</div>' + '<div class="clear"></div>' + '</div>');

		var introMarkerOptions = {
			map: this.map,
			position: this.startingPoint
		};

		var introMarker = me.maps.getIntroMarker(introMarkerOptions);

		var introInfoWindow = me.maps.getInfoBox(introInfoWindowTemplate, introData);

		google.maps.event.addListener(introMarker, "click", function() {
			introInfoWindow.open(me.map, introMarker);
		});

		setTimeout(function() {
			introInfoWindow.open(me.map, introMarker);
		}, 420);
	},

	setResults: function() {
		var me = this;
		this.resultCenterPosition = new google.maps.LatLng(this.settings.ResultLatitude, this.settings.ResultLongitude);

		var iconTemplate = '<img src="#{categoryIcon}" class="dealer-category-icon lft">';
		
		if ($$(".dealer-search-legend-category-item-new-design-2014").length > 0) {
			iconTemplate = '<img src="#{categoryMapIcon}" class="dealer-category-icon lft">';
		}
		
		var infoWindowTemplate = new Template('<div class="dealer-search-map-info-window">' + iconTemplate + '<div class="lft">' + '<p><strong>#{name}</strong><br>#{address}</p>' + '</div>' + '<div class="clear"></div>' + '</div>');
		
		this.searchResultItems.each(function(result) {
			result.data = result.down(".result-data").innerHTML.evalJSON();
			result.data.specials = result.data.specials.without(null);

			result.markerPosition = new google.maps.LatLng(result.data.Latitude, result.data.Longitude);

			var markerOptions = {
				map: me.map,
				position: result.markerPosition,
				title: result.data.name.gsub("&amp;", "&")
			};

			result.marker = me.maps.getIntroMarker(markerOptions);

			result.infoWindow = me.maps.getInfoBox(infoWindowTemplate, result.data);

			var openInfoWindow = function() {
				document.fire(Weber.Tracking.Events.DealerSearch.ClickMarker, {
					search: $F(me.searchField),
					distance: me.selectedDistance,
					dealerData: result.data
				});

				if (me.currentInfoWindow != null)
					me.currentInfoWindow.close();

				result.infoWindow.open(me.map, result.marker);

				me.currentInfoWindow = result.infoWindow;
			};

			result.on("click", openInfoWindow);

			google.maps.event.addListener(result.marker, "click", openInfoWindow);
		});

		this.selectedDistance = this.distanceSelect.instance.getValue();

		this.distanceSelect.instance.onValueChanged.add(function(select) {
			me.selectedDistance = select.getValue();

			document.fire(Weber.Tracking.Events.DealerSearch.FilterDistance, {
				search: $F(me.searchField),
				distance: me.selectedDistance
			});

			me.filterResults();
		});

		this.specialFilterList = new anyLib.Collection.List();
		this.categoryFilterList = new anyLib.Collection.List();

		this.categoryFilter.each(function(filter) {
			filter.categoryID = parseInt(filter.next(".hidden").innerHTML);

			filter.instance.onValueChanged.add(function() {
				if (filter.instance.getIsChecked()) {
					if (!me.categoryFilterList.hasValue(filter.categoryID))
						me.categoryFilterList.add(filter.categoryID);
				} else {
					if (me.categoryFilterList.hasValue(filter.categoryID))
						me.categoryFilterList.remove(filter.categoryID);
				}

				me.filterResults();
			});
		});

		this.specialFilter.each(function(filter) {
			filter.specialID = parseInt(filter.next(".hidden").innerHTML);

			filter.instance.onValueChanged.add(function() {
				if (filter.instance.getIsChecked()) {
					if (!me.specialFilterList.hasValue(filter.specialID))
						me.specialFilterList.add(filter.specialID);
				} else {
					if (me.specialFilterList.hasValue(filter.specialID))
						me.specialFilterList.remove(filter.specialID);
				}

				me.filterResults();
			});
		});

		var currentUrl = new anyLib.Url(window.location.href.toString());

		if (!currentUrl.getQueryString().getItems().hasKey("distance")) {
			this.filterResults();

			return;
		}

		try {
			var distance = (parseInt(currentUrl.getQueryString().getItems().get("distance")) / 10) - 1;

			this.distanceSelect.instance.select(distance);
		} catch (e) {
			this.filterResults();
		}
	}
});
