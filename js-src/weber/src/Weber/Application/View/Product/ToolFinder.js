/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Collection
 * @requiresPackage anyLib.Url
 * @requiresPackage anyLib.Paging
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 */
anyLib.registerNamespace("Weber.Application.View.Product");

Weber.Application.View.Product.ToolFinder = Class.create(anyLib.Application.View, {
	filterList: [],
	productList: [],
	featureList: [],
	pagesContainer: null,
	pagingContainer: null,
	resultContainer: null,
	filterContainer: null,
	grillTypeSelect: null,
	grillTypeOutput: null,
	comparisonTargetPage: null,
	grillTypeResetTrigger: null,
	selectionResultGrillOne: null,
	selectionResultGrillTwo: null,
	selectionResultResetTrigger: null,
	selectionResultComparisonTrigger: null,

	_ribbonTemplate: null,
	_filterTemplate: null,
	_productTemplate: null,
	_filterOptionDivTemplate: null,
	_filterOptionSelectOptionTemplate: null,

	_appliedFilters: null,
	_initializedFilters: null,
	_groupedProductStore: null,

	_grillOne: null,
	_grillTwo: null,

	_currentGroupID: -1,

	_selectZIndex: 90,

	render: function() {
		this._appliedFilters = new anyLib.Collection.List();
		this._initializedFilters = new anyLib.Collection.List();
		this._groupedProductStore = new anyLib.Collection.List();

		var me = this;

		this.grillTypeResetTrigger.on("click", function() {
			me.grillTypeSelect.show();

			me.grillTypeResetTrigger.hide();

			me.grillTypeOutput.innerHTML = "";
			me.resultContainer.innerHTML = "";

			me._resetProductSelection();

			me._changeFilterState(false);

			me._changeGroup(-1);
		});

		this.selectionResultResetTrigger.on("click", function() {
			me._resetProductSelection();
		});

		this.grillTypeSelect.instance.onValueChanged.add(function(instance) {
			if (instance.getValue() == -1) {
				me._changeGroup(-1);

				me._changeFilterState(false);

				return;
			}

			me._changeGroup(instance.getValue());

			me.grillTypeOutput.innerHTML = instance.getTextElement().innerHTML;

			me._filterChanged();

			me._changeFilterState(true);
		});

		this.selectionResultComparisonTrigger.on("click", function() {
			var url = new anyLib.Url(window.location.href.toString());
			url.setPath(me.comparisonTargetPage.innerHTML);

			url.getQueryString().getItems().clear();

			url.getQueryString().addItem("GrillOne", me._grillOne.ProductID);
			url.getQueryString().addItem("GrillTwo", me._grillTwo.ProductID);

			window.location.href = url.getParsed();
		});

		this.filterList.each(function(filter) {
			me._addFilter(filter);
		});

		this._changeGroup(-1);
	},

	_resetProductSelection: function() {
		if (this._grillOne != null) {
			this._grillOne.checkbox.instance.unCheck();
		}

		if (this._grillTwo != null) {
			this._grillTwo.checkbox.instance.unCheck();
		}

		this._grillOne = null;
		this.selectionResultGrillOne.innerHTML = "";

		this._grillTwo = null;
		this.selectionResultGrillTwo.innerHTML = "";

		if (this._currentGroupID != -1)
			this._changeFilterState(true);

		this._changeRemainingProductsEnabledState(true);

		this.selectionResultResetTrigger.hide();
		this.selectionResultComparisonTrigger.hide();

		this._initializedFilters.getAll().each(function(filter) {
			filter.domReference.instance.select(0);
		});

		this.grillTypeSelect.instance.select(0);
	},

	_deselectProduct: function(product) {
		if (this._grillTwo != null && this._grillTwo.ProductID == product.ProductID) {
			this._grillTwo = null;

			this.selectionResultGrillTwo.innerHTML = "";

			this._changeRemainingProductsEnabledState(true);
		}

		if (this._grillOne != null && this._grillOne.ProductID == product.ProductID) {
			this._grillOne = null;

			this.selectionResultGrillOne.innerHTML = "";

			this._changeRemainingProductsEnabledState(true);
		}

		var selectedProducts = 0;

		if (this._grillOne != null)
			selectedProducts++;

		if (this._grillTwo != null)
			selectedProducts++;

		if (selectedProducts < 2)
			this.selectionResultComparisonTrigger.hide();

		if (selectedProducts == 0) {
			this._changeFilterState(true);

			this.selectionResultResetTrigger.hide();
		}
	},

	_selectProduct: function(product) {
		this._changeFilterState(false);

		var productName = Weber.tools.stringWidth.trimToFit(
			product.PullDownText,
			this.selectionResultGrillOne.getStyle("font-size"),
			this.selectionResultGrillOne.getStyle("font-family"),
			this.selectionResultGrillOne.measure("width") - 50,
			"..."
		);

		var assigned = false;

		if (this._grillOne == null) {
			this._grillOne = product;
			this.selectionResultGrillOne.innerHTML = productName;

			assigned = true;
		}

		if (assigned == false && this._grillTwo == null) {
			this._grillTwo = product;
			this.selectionResultGrillTwo.innerHTML = productName;
		}

		var selectedProducts = 0;

		if (this._grillOne != null)
			selectedProducts++;

		if (this._grillTwo != null)
			selectedProducts++;

		if (selectedProducts == 1)
			this.selectionResultResetTrigger.show();

		if (selectedProducts == 2) {
			this.selectionResultResetTrigger.show();
			this.selectionResultComparisonTrigger.show();

			this._changeRemainingProductsEnabledState(false);
		}
	},

	_changeGroup: function(groupID) {
		var me = this;

		this._currentGroupID = groupID;

		if (this._currentGroupID != -1) {
			this.grillTypeSelect.hide();

			me._groupedProductStore.clear();

			this.grillTypeResetTrigger.show();
		}

		var list = (this._currentGroupID == -1) ? this.featureList : this.productList;

		var listToRender = [];

		list.each(function(product) {
			if (me._currentGroupID != -1 && product.GroupID != me._currentGroupID)
				return;

			me._groupedProductStore.add(product);

			listToRender.push(product);
		});

		this._renderProductList(listToRender);
	},

	_renderProductList: function(list) {
		var me = this;

		this.resultContainer.innerHTML = "";

		var itemLimit = 12;
		var itemsAdded = 0;

		var renderPages = list.length > itemLimit;

		this.pagesContainer.innerHTML = "";

		if (renderPages) {
			this.pagingContainer.show();
		} else {
			this.pagingContainer.hide();
		}

		var pageIndex = 1;
		var currentPage = null;
		var currentTrigger = null;

		var paging = new anyLib.Paging();

		var createNewPage = function() {
			currentPage = new anyLib.Paging.Page();
			currentPage.setElement(new Element("div", {
				"style": (pageIndex > 1) ? "display:none;" : "",
				"class": "paging-page page-" + pageIndex.toString()
			}));

			me.resultContainer.insert({
				bottom: currentPage.getElement()
			});

			if (renderPages) {
				var pageClasses = ["page"];

				if (pageIndex == 1)
					pageClasses.push("active");

				var trigger = new Element("a", {
					"href": "javascript:void(0);",
					"class": pageClasses.join(" ")
				});

				var triggerPageIndex = pageIndex.toString();

				trigger.on("click", function() {
					paging.enterPage(triggerPageIndex);
				});

				me.pagesContainer.insert({
					bottom: trigger
				});

				trigger.innerHTML = pageIndex.toString();

				currentPage.beforeExit.add(function() {
					trigger.removeClassName("active");
				});

				currentPage.beforeEnter.add(function() {
					trigger.addClassName("active");
				});

				currentTrigger = trigger;
			}

			paging.addPage(pageIndex.toString(), currentPage);

			pageIndex++;
		};

		if (renderPages) {
			this.pagingContainer.down(".next").on("click", function() {
				paging.next();
			});

			this.pagingContainer.down(".prev").on("click", function() {
				paging.prev();
			});
		}

		createNewPage();

		paging.enterPage("1");

		list.each(function(product) {
			if (typeof(product.domReference) != "undefined") {
				product.domReference = null;
				delete(product.domReference);
			}

			if (typeof(product.parsed) == "undefined") {
				product.identifier = "perfect-tool-finder-product-" + product.ProductID.toString();

				product.checkbox = {
					instance: null,
					domReference: null,
					name: product.identifier + "-checkbox"
				};

				product.parsed = me._parseProduct(product);
			}

			currentPage.getElement().insert({
				bottom: product.parsed
			});

			product.domReference = $(product.identifier);
			product.checkbox.domReference = product.domReference.down(".checkbox");

			var checkbox = new Weber.Form.Element.CheckBox();
			checkbox.setElement(product.checkbox.domReference);

			checkbox.onValueChanged.add(function() {
				if (checkbox.getIsChecked()) {
					me._selectProduct(product);
				} else {
					me._deselectProduct(product);
				}
			});

			product.checkbox.instance = checkbox;

			product.domReference.product = product;

			itemsAdded++;

			if (itemsAdded != itemLimit)
				return;

			itemsAdded = 0;

			createNewPage();
		});
	},

	_filterChanged: function() {
		var me = this;

		var enabledProducts = [];

		this._groupedProductStore.getAll().each(function(product) {
			var enabled = true;

			me._appliedFilters.getAll().each(function(filter) {
				filter = parseInt(filter);

				if (product.Filters.indexOf(filter) == -1)
					enabled = false;
			});

			me._changeProductVisibilityState(product, enabled);

			if (enabled)
				enabledProducts.push(product);
		});

		this._renderProductList(enabledProducts);

		this._initializedFilters.getAll().each(function(filter) {
			var keys = Object.keys(filter.domReference.instance.getOptions().getAll());

			keys.each(function(filterOptionKey) {
				var filterOption = filter.domReference.instance.getOptions().get(filterOptionKey);

				if (filterOption.getValue().toString() == "-1")
					return;

				var productsForFilter = 0;

				enabledProducts.each(function(product) {
					if (product.Filters.indexOf(parseInt(filterOption.getValue())) == -1)
						return;

					productsForFilter++;
				});

				if (productsForFilter > 0) {
					if (filterOption.getDivOption().hasClassName("disabled"))
						filterOption.getDivOption().removeClassName("disabled");

					return;
				}

				filterOption.getDivOption().addClassName("disabled");
			});
		});
	},

	_changeRemainingProductsEnabledState: function(enabled) {
		var me = this;

		this._groupedProductStore.getAll().each(function(product) {
			if (me._grillOne != null && product.ProductID == me._grillOne.ProductID)
				return;

			if (me._grillTwo != null && product.ProductID == me._grillTwo.ProductID)
				return;

			me._changeProductEnabledState(product, enabled);
		});
	},

	_changeProductEnabledState: function(product, enabled) {
		// TODO: Animationen als fallback einbauen

		if (enabled) {
			if (product.domReference.hasClassName("disabled"))
				product.domReference.removeClassName("disabled");

			product.checkbox.instance.enable();
		} else {
			if (!product.domReference.hasClassName("disabled"))
				product.domReference.addClassName("disabled");

			product.checkbox.instance.disable();
		}
	},

	_changeProductVisibilityState: function(product, enabled) {
		if (enabled) {
			if (product.domReference.hasClassName("hidden"))
				product.domReference.removeClassName("hidden");

			product.checkbox.instance.enable();
		} else {
			if (!product.domReference.hasClassName("hidden"))
				product.domReference.addClassName("hidden");

			product.checkbox.instance.disable();
		}
	},

	_changeFilterState: function(enabled) {
		this._initializedFilters.getAll().each(function(filter) {
			if (enabled) {
				if (filter.domReference.hasClassName("disabled"))
					filter.domReference.removeClassName("disabled");

				filter.domReference.instance.enable();
			} else {
				if (!filter.domReference.hasClassName("disabled"))
					filter.domReference.addClassName("disabled");

				filter.domReference.instance.disable();
			}
		});
	},

	_parseProduct: function(product) {
		return this._getProductTemplate().evaluate({
			product: product,
			newIcon: this._getNewIcon(product),
			ribbons: this._getRibbons(product)
		});
	},

	_getProductTemplate: function() {
		if (this._productTemplate == null)
			this._productTemplate = new Template(
				'<span class="columns-4 lft teaser-grid-item" id="#{product.identifier}">' +
					'<img class="image" src="#{product.TeaserImage}">' +
					'<span class="ribbons">' +
						'#{ribbons}' +
						'<span class="clear"></span>' +
					'</span>' +
					'#{newIcon}' +
					'<span class="info">' +
						'<span class="heading">#{product.Headline}</span>' +
						'<span class="sub-line">#{product.Subline}</span>' +
					'</span>' +
					'<span class="perfect-tool-finder-actions">' +
						'<span class="form-item item-checkbox">' +
							'<label for="#{product.checkbox.name}">' +
								'<span class="checkbox unchecked"><input type="checkbox" name="#{product.checkbox.name}" id="#{product.checkbox.name}"></span>' +
								'Grill vergleichen' +
							'</label>' +
						'</span>' +
						'<p><a href="#{product.Url}">Zu den Produktdetails</a></p>' +
					'</span>' +
				'</span>'
			);

		return this._productTemplate;
	},

	_getRibbonTemplate: function() {
		if (this._ribbonTemplate == null)
			this._ribbonTemplate = new Template(
				'<div class="ribbon ribbon-small-#{iconStyle}-#{iconType}"></div>'
			);

		return this._ribbonTemplate;
	},

	_getRibbons: function(product) {
		if (product.Flags.length == 0)
			return "";

		var me = this;

		var output = "";

		product.Flags.each(function(flag) {
			var iconType = "";

			switch (flag) {
				case "Aktionsprodukt":
					iconType = "offer";
					break;
				case "Color_Line":
					iconType = "color-line";
					break;
				case "Black_Line":
					iconType = "black-line";
					break;
				case "Weber_Style":
					iconType = "weber-style";
					break;
				case "Johann_Lafer_Edition":
					iconType = "lafer-edition";
					break;
				case "Fruehlingsprodukt":
					iconType = "spring";
					break;
				default:
					return;
			}

			output = output + me._getRibbonTemplate().evaluate({
				iconType: iconType,
				iconStyle: Weber.Settings.IconStyle
			});
		});

		return output;
	},

	_getNewIcon: function(product) {
		if (product.Flags.length == 0)
			return "";

		if (product.Flags.indexOf("NeuButton") == -1)
			return "";

		return '<span class="icon overlay-icon-new"></span>';
	},

	_getFilterTemplate: function() {
		if (this._filterTemplate == null) {
			this._filterTemplate = new Template(
				'<div class="select-background select disabled" id="#{filter.identifier}">' +
					'<div class="text">#{filter.Name}</div>' +
					'<div class="option-container" style="display:none;">' +
						'<div class="option-list">' +
							'#{filterOptions.divs}' +
							'<a class="reset-selection" href="javascript:void(0);"><span>' + t("reset-selection") + '</span></a>' +
						'</div>' +
						'<select name="#{filter.identifier}">' +
							'#{filterOptions.selectOptions}' +
						'</select>' +
						'<div class="option-scrubber disabled">' +
							'<div class="option-scrubber-handle" style="top:0;"></div>' +
						'</div>' +
					'</div>' +
					'<div class="select-background left"></div>' +
					'<div class="select-background right"></div>' +
				'</div>'
			);
		}

		return this._filterTemplate;
	},

	_getFilterOptionDivTemplate: function() {
		if (this._filterOptionDivTemplate == null) {
			this._filterOptionDivTemplate = new Template(
				'<div class="option">#{Value}</div>'
			);
		}

		return this._filterOptionDivTemplate;
	},

	_getFilterOptionSelectOptionTemplate: function() {
		if (this._filterOptionSelectOptionTemplate == null) {
			this._filterOptionSelectOptionTemplate = new Template(
				'<option value="#{Key}">#{Value}</option>'
			);
		}

		return this._filterOptionSelectOptionTemplate;
	},

	_addFilter: function(filter) {
		var me = this;

		filter.identifier = "perfect-tool-finder-filter-" + filter.ID.toString();

		var filterDivs = [];
		var filterSelectOptions = [];

		filter.Items.unshift({
			Key: -1,
			Value: filter.Name
		});

		filter.Items.each(function(filterItem) {
			filterDivs.push(me._getFilterOptionDivTemplate().evaluate(filterItem));
			filterSelectOptions.push(me._getFilterOptionSelectOptionTemplate().evaluate(filterItem));
		});

		this.filterContainer.insert({
			bottom: this._getFilterTemplate().evaluate({
				filter: filter,
				filterOptions: {
					divs: filterDivs.join(""),
					selectOptions: filterSelectOptions.join("")
				}
			})
		});

		filter.domReference = $(filter.identifier);

		var select = new Weber.Form.Element.Select();
		select.setElement(filter.domReference);

		filter.domReference.setStyle({
			zIndex: this._selectZIndex--
		});

		select.currentFilter = null;
		select.onValueChanged.add(function() {
			if (select.currentFilter != null) {
				if (me._appliedFilters.hasValue(select.currentFilter))
					me._appliedFilters.remove(select.currentFilter);
			}

			select.currentFilter = select.getValue();

			if (select.currentFilter == -1) {
				select.currentFilter = null;
			} else {
				me._appliedFilters.add(select.currentFilter);
			}

			me._filterChanged();
		});

		select.disable();

		filter.domReference.instance = select;

		filter.domReference.filter = filter;

		this._initializedFilters.add(filter);
	}
});
