/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Url
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Recipe");

Weber.Application.View.Recipe.Search = Class.create(anyLib.Application.View, {
	_timeout: null,
	template: null,
	inputField: null,
	searchForm: null,
	resultList: null,
	searchTarget: null,
	_blurTimeout: null,
	searchButton: null,
	maximumNameLength: 50,

	render: function() {
		if (this.searchForm == null)
			return;

		this.resultList = this.searchForm.down(".recipe-search-result-list");

		this.searchTarget = new anyLib.Url(this.searchForm.action.toString());
		this.searchTarget.getQueryString().getItems().clear();
		this.searchTarget = this.searchTarget.getParsed();

		this.inputField = this.searchForm.down("#q");

		this.searchButton = this.searchForm.down(".recipe-search-run");

		this.template = new Template(
			'<a class="recipe-search-result-item" href="#{Link}">' +
				'<img class="image lft" src="#{Thumbnail}" width="56" height="42">' +
				'<span class="title">#{NameShortened}</span>' +
				'<span class="type">#{GroupName} ' + t("recipe") + '</span>' +
				'<span class="clear"></span>' +
			'</a>'
		);

		var me = this;

		this.inputField.on("keyup", function() {
			me.setTypeTimeout();
		});

		this.searchButton.on("click", function() {
			me.searchForm.submit();
		});

		this.inputField.on("keypress", function(event) {
			if (event.keyCode == Event.KEY_RETURN)
				me.searchForm.submit();
		});

		this.inputField.on("focus", function() {
			me.resultList.show();

			if (me.inputField.value != "" && me.resultList.innerHTML == "")
				me.search();
		});

		this.inputField.on("blur", function() {
			me.setBlurTimeout();
		});
	},

	blur: function() {
		this.resultList.hide();
	},

	search: function() {
		var me = this;

		new Ajax.Request(this.searchTarget, {
			parameters: {
				moawr: Math.random(),
				q: this.inputField.value
			},
			method: "get",
			onSuccess: function(transport) {
				me.renderResults(transport.responseJSON.Items);
			}
		});
	},

	renderResults: function(items) {
		var markup = "";

		var me = this;

		items.each(function(result) {
			result["NameShortened"] = result["Name"];

			if (result.NameShortened.length > this.maximumNameLength)
				result.NameShortened = result.NameShortened.substr(0, this.maximumNameLength - 4) + " ...";

			markup = markup + me.template.evaluate(result);
		});

		if (markup != "") {
			markup = markup + '<a class="show-all" href="' + this.searchTarget + "?q=" + this.inputField.value + '"><span>' + t("recipe-show-all-search-results") + '</span></a>';
		} else {
			markup = markup + '<a class="show-all" href="javascript:void(0);"><span>' + t("recipe-no-search-results") + '</span></a>';
		}

		this.resultList.innerHTML = markup;
	},

	setTypeTimeout: function() {
		if (this._timeout != null)
			clearTimeout(this._timeout);

		this._timeout = setTimeout(this.search.bind(this), 200);
	},

	setBlurTimeout: function() {
		if (this._blurTimeout != null)
			clearTimeout(this._blurTimeout);

		this._blurTimeout = setTimeout(this.blur.bind(this), 300);
	}
});
