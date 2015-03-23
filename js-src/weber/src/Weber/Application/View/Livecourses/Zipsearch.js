/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Collection
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Maps
 */
anyLib.registerNamespace("Weber.Application.View.Livecourses");

Weber.Application.View.Livecourses.Zipsearch = Class.create(anyLib.Application.View, {
	map: null,
	maps: null,
	year: null,
	month: null,
	settings: {},
	mapStyle: null,
	selectedYear: 0,
	selectedMonth: 0,
	courseMore: null,
	dealerMore: null,
	messageBox: null,
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

		this.distanceSelect.instance.onValueChanged.add(function(select) {
			me.selectedDistance = select.getValue();
		});

		this.month.instance.onValueChanged.add(function(select) {
			me.selectedMonth = select.getValue();
		});

		this.year.instance.onValueChanged.add(function(select) {
			me.selectedYear = select.getValue();
		});


		this.submitButton.on("click", function() {
			me.startNewSearch();
		});
		this.formElement.on("submit", function(event) {
			event.preventDefault();
			me.startNewSearch();
		});

		this.renderDealerView();
		this.renderCourseView();

		var currentUrl = new anyLib.Url(window.location.href.toString());

		if (currentUrl.getQueryString().getItems().hasKey('distance')) {
			this.selectedDistance = currentUrl.getQueryString().getItems().get('distance');
		}

		if (currentUrl.getQueryString().getItems().hasKey('month')) {
			this.selectedMonth = currentUrl.getQueryString().getItems().get('month');
		}

		if (currentUrl.getQueryString().getItems().hasKey('year')) {
			this.selectedYear = currentUrl.getQueryString().getItems().get('year');
		}

		if (currentUrl.getQueryString().getItems().hasKey('livecourseID')) {
			this._courseViewLightbox(me._getAjaxUrl(currentUrl.getQueryString().getItems().get('livecourseID')));
		}
		if (currentUrl.getQueryString().getItems().hasKey('academyID')) {
			this._courseViewLightbox(me._getAjaxUrl(currentUrl.getQueryString().getItems().get('academyID'), true), true);
		}

		this._setFilterValues();
	},
	startNewSearch: function() {
		var currentUrl = new anyLib.Url(window.location.href.toString());

		currentUrl.getQueryString().getItems().clear();

		var searchQuery = $F(this.searchField);

		this._setFilterValues();

		currentUrl.getQueryString().getItems().set("search", searchQuery);
		currentUrl.getQueryString().getItems().set("distance", this.selectedDistance);
		currentUrl.getQueryString().getItems().set("month", this.selectedMonth);
		currentUrl.getQueryString().getItems().set("year", this.selectedYear);

		document.fire(Weber.Tracking.Events.Livecourses.StartSearch, {
			search: searchQuery,
			distance: this.selectedDistance,
			month: this.selectedMonth,
			year: this.selectedYear
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

		this.maps = new Weber.Maps.CustomStyle(options);

		this.maps.render();

		this.map = this.maps.getMap();

		if (this.searchResultItems.length == 0) {
			this.setIntroMarker();
		} else {
			this.setResults();
		}
	},
	setResults: function() {
		var me = this;
		this.resultCenterPosition = new google.maps.LatLng(this.settings.ResultLatitude, this.settings.ResultLongitude);

		var infoWindowTemplate = new Template('<div class="livecourses-map-info-window"><div class="lft"><p><strong>#{name}</strong><br>#{address}</p></div><div class="clear"></div><div class="livecourses-dealer-infos"><span class="livecourses">#{livecourses} ' + t('anstehende Livekurse') + '</span><a class="dealer-more" href="javascript:void(0)" data-id="#{Id}">' + t('Mehr erfahren') + '</a></div></div>');
		this.searchResultItems.each(function(result) {
			result.data = result.down(".result-data").innerHTML.evalJSON();

			result.markerPosition = new google.maps.LatLng(result.data.Latitude, result.data.Longitude);

			var markerOptions = {
				map: me.map,
				position: result.markerPosition,
				title: result.data.name.gsub("&amp;", "&")
			};

			result.data["classname"] = "livecourses";

			result.marker = me.maps.getIntroMarker(markerOptions);

			result.infoWindow = me.maps.getInfoBox(infoWindowTemplate, result.data);

			var openInfoWindow = function() {
				document.fire(Weber.Tracking.Events.Livecourses.ClickMarker, {
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
			google.maps.event.addListener(result.infoWindow, 'domready', function() {
				me.dealerMore = $$('.dealer-more');
				me.renderDealerView();
			});
		});

		this.selectedDistance = this.distanceSelect.instance.getValue();
		this.selectedMonth = this.month.instance.getValue();
		this.selectedYear = this.year.instance.getValue();

		this.distanceSelect.instance.onValueChanged.add(function(select) {
			me.selectedDistance = select.getValue();

			me._changeFilterValues();
			me.filterResults();
		});

		this.month.instance.onValueChanged.add(function(select) {
			me.selectedMonth = select.getValue();

			me._changeFilterValues();
			me.filterResults();
		});

		this.year.instance.onValueChanged.add(function(select) {
			me.selectedYear = select.getValue();

			me._changeFilterValues();
			me.filterResults();
		});

		me._setFilterValues();
	},

	_setFilterValues: function() {
		var currentUrl = new anyLib.Url(window.location.href.toString());

		var year;
		var month;
		var distance;
		
		try {
			if (this.selectedDistance != 200) {
				distance = this.selectedDistance > 0 ? ((this.selectedDistance / 10) - 1) : (parseInt(currentUrl.getQueryString().getItems().get("distance")) / 10) - 1;
			}
		} catch (e) {
		}

		try {
			month = this.selectedMonth;
		} catch (e) {
		}

		try {
			year = this.selectedYear > 0 ? this.selectedYear : (parseInt(currentUrl.getQueryString().getItems().get("year")));
		} catch (e) {
		}
		
		if (typeof distance == 'undefined' || distance <= 0) {
			distance = this.distanceSelect.instance.getOptions().getCount() - 1
		}

		if (typeof month == 'undefined' || month < 0) {
			month = new Date(Weber.Utilities.getDateNow()).getMonth() + 1;
		}

		if (typeof year == 'undefined' || year <= 0) {
			year = new Date(Weber.Utilities.getDateNow()).getFullYear();
		}

		this.distanceSelect.instance.select(distance);
		this.month.instance.select(month);


		var years = this.year.select('option');
		var indexYear = 0;
		var i = 0;

		years.each(function(element) {
			if (year == element.value) {
				indexYear = i;
			}
			
			i++;
		});
		
		this.year.instance.select(indexYear);
	},

	_changeFilterValues: function() {
		document.fire(Weber.Tracking.Events.Livecourses.FilterDistance, {
			search: $F(this.searchField),
			distance: this.selectedDistance,
			month: this.selectedMonth,
			year: this.selectedYear
		});
	},

	renderDealerView: function() {
		var me = this;
		
		this.dealerMore.each(function(element) {
			element.on('click', function(e, elem) {
				e.stopPropagation();
				e.preventDefault();

				var contentHref = me._getAjaxUrl(elem.readAttribute('data-id'), true);
				me._courseViewLightbox(contentHref, true);
			});
		});
	},
	renderCourseView: function() {
		var me = this;
		this.courseMore.each(function(element) {
			element.on('click', function(e, elem) {
				e.stopPropagation();
				e.preventDefault();

				var contentHref = me._getAjaxUrl(elem.readAttribute('data-course-id'));
				me._courseViewLightbox(contentHref);
			});
		});
	},
	_getAjaxUrl: function(id, isDealer) {
		if(typeof isDealer == "undefined") {
			isDealer = false;
		}
		if (isDealer) {
			return window.location.href.substr(0, window.location.href.indexOf("?")) + "?academyID=" + id;
		}
		return window.location.href.substr(0, window.location.href.indexOf("?")) + "?livecourseID=" + id;
	},
	_courseViewLightbox: function(ajaxUrl, isDealer) {
		if (typeof isDealer == "undefined") {
			isDealer = false;
		}
		var me = this;
		var content = null;
		var template = new Template('<div class="dealer-lightbox" id="livecourse_#{Id}"><h3>#{name}</h3><div class="address">#{address}</div><div class="dealer-lightbox-infos"><div class="phone"><p class="title">' + t('Terminanmeldung') + ':</p><p>' + t('Telefon') + ': #{phone}</p></div><div class="social">#{facebook}<a class="dont-print print button-background form-button black" href = "javascript:void(0)" >' + t('Drucken') + '</a></div><div class="clear"></div></div><div class="clear"></div><div class="text"><div class="livecourses"><div class="legend"><div class="date">' + t('Datum') + '</div><div class="description">' + t('Beschreibung') + '</div><div class="clear"></div></div><div class="clear"></div>#{livecourses} #{livecourse}</div><div class="clear"></div></div></div></div>');

		var liveCourseTemplate = new Template('<div class="date">#{date}</div><div class="description"><h4>#{title}</h4><p>#{description}</p></div>');

		var callback = function(object) {
			content = object.responseText.substr(0, object.responseText.indexOf("}<")) + "}";

			if (content != null) {
				content = content.evalJSON();
				var fbDescription = '';
				var fbTitle = '';

				if (isDealer) {
					var livecourses = '';
					content["livecourses"].each(function(elem) {
						var description = elem["description"];
						if (description.length > 285) {
							description = description.substr(0, 285) + "..." + '<a class="course-more" data-course-id="' + elem['id'] + '" href="javascript:void(0)">Mehr erfahren</a>';
						}
						elem["description"] = description;
						livecourses += liveCourseTemplate.evaluate(elem);
					});
					content["livecourses"] = livecourses;
				} else {
					fbTitle = content["livecourse"]["title"] + ' | ';
					fbDescription = content["livecourse"]["description"].substr(0, 300);
					content["livecourse"] = liveCourseTemplate.evaluate(content["livecourse"]);
				}

				if ($('facebookID') != null) {
					content["facebook"] = '<a class="dont-print facebook button-background form-button black" href="javascript:void(0)"><span class="icon">' + t('Auf Facebook teilen') + '</span></a>';
				}

				me.messageBox.display(template.evaluate(content));

				me.messageBox.getLightBox().afterChange.add(function() {
					var fbShareLink = window.location.href + "&livecourseID=" + content["Id"];
					var fbName = fbTitle + content["name"];

					if (isDealer) {
						fbShareLink = window.location.href + "&academyID=" + content["Id"];
						fbName = content["name"];
						fbDescription = content["description"].substr(0, 300);

						me.courseMore = $$('.course-more');
						me.renderCourseView();
					}
					me.printLightbox($$('.dealer-lightbox'));
					if ($('facebookID') != null) {
						me.shareLightbox(fbName, fbDescription, fbShareLink);
					}
					me.checkLightboxHeight(me.messageBox.getLightBox())
				});

				me.messageBox.getLightBox().afterClose.add(function() {
					me.resetCheckHeight(me.messageBox.getLightBox());
					var currentUrl = new anyLib.Url(window.location.href.toString());

					if (currentUrl.getQueryString().getItems().hasKey('livecourseID')) {
						currentUrl.getQueryString().getItems().removeKey('livecourseID');
						window.location.href = currentUrl.getParsed();
					}
					if (currentUrl.getQueryString().getItems().hasKey('academyID')) {
						currentUrl.getQueryString().getItems().removeKey('academyID');
						window.location.href = currentUrl.getParsed();
					}
				});
			}
		};

		new Ajax.Request(ajaxUrl, {
			method: "get",
			onSuccess: callback,
			onFailure: function() {
				return true;
			}

		});
	},
	checkLightboxHeight: function(lightbox) {
		var lightBoxContainer = lightbox.getLayout().getContainer();
		if (window.innerHeight <= lightBoxContainer.getHeight() + 200) {
			lightBoxContainer.setStyle({
				position: 'absolute'
			});
			window.scrollTo(0, 0);
		}
	},
	resetCheckHeight: function(lightbox) {
		var lightBoxContainer = lightbox.getLayout().getContainer();
		if (window.innerHeight <= lightBoxContainer.getHeight() + 200) {
			lightBoxContainer.setStyle({
				position: 'fixed'
			});
		}

	},
	printLightbox: function(activeItem) {
		var actionRequest = new anyLib.Application.Controller.Request();
		actionRequest.setAction("print");
		actionRequest.setModule("default");
		actionRequest.setController("sharefunction");
		actionRequest.setNamespace(Weber.Application);
		actionRequest.getParameters().set("activeItem", activeItem);
		actionRequest.getParameters().set("linkElements", $$('.form-button.print'));
		Weber.application.dispatch(actionRequest);
	},

	shareLightbox: function(name, description, shareLink) {
		var facebookId = $("facebookID").innerHTML;

		var actionRequest = new anyLib.Application.Controller.Request();

		actionRequest.setAction("fbshare");
		actionRequest.setModule("default");
		actionRequest.setController("sharefunction");
		actionRequest.setNamespace(Weber.Application);

		actionRequest.getParameters().set("name", name);
		actionRequest.getParameters().set("facebookId", facebookId);
		actionRequest.getParameters().set("shareLink", shareLink);
		actionRequest.getParameters().set("description", description);
		actionRequest.getParameters().set("linkElements", $$('.form-button.facebook'));

		Weber.application.dispatch(actionRequest);
	}
});
