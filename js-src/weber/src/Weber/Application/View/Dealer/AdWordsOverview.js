/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Collection
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Dealer");

Weber.Application.View.Dealer.AdWordsOverview = Class.create(anyLib.Application.View, {
	search: "",
	information: {},
	moreTrigger: null,
	containerList: [],
	targetElement: null,

	render: function() {
		if (this.containerList.length == 0)
			return;

		var me = this;

		var buffer = new Element("div", {
			className: "hidden"
		});

		var notWorldPartnerBuffer = new Element("div", {
			className: "dealer-search-not-world-partners"
		});

		this.containerList.each(function(container) {
			var bannerDataContainer = container.select(".dealer-search-item-aw-tracking-information");

			var template = new Template(container.down(".dealer-search-item-render-template").innerHTML);

			var bannerDataCollection = new anyLib.Collection.List();

			bannerDataContainer.each(function(dataContainer) {
				bannerDataCollection.add(dataContainer.innerHTML.evalJSON());
			});

			if (container.hasClassName("dealer-type-world-partner")) {
				var date = new Date();

				var shift = Math.floor((date.getMinutes() / (60 / bannerDataCollection.getCount())) % bannerDataCollection.getCount());

				if (shift > 0) {
					for (var i = 0; i < shift; i++) {
						var removed = bannerDataCollection.getValue(0);

						bannerDataCollection.removeKey(0);

						bannerDataCollection.add(removed);
					}
				}

				bannerDataCollection.getAll().last().classes.push("last");
				bannerDataCollection.getAll().first().classes.push("first");
			} else {
				bannerDataCollection.getAll().sort(function() {
					return Math.round(Math.random()) - 0.5;
				});
			}

			container.innerHTML = "";

			bannerDataCollection.getAll().each(function(bannerData) {
				bannerData.classes = bannerData.classes.join(" ");

				bannerData.url = (new Template(bannerData.url)).evaluate({
					search: me.information.ean
				});

				container.insert({
					bottom: template.evaluate(bannerData)
				});

				container.immediateDescendants().last().on("click", function() {
					me.triggerClick(bannerData);
				});
			});

			container.show();

			if (container.hasClassName("dealer-type-world-partner")) {
				buffer.insert({
					bottom: container
				});

				buffer.insert({
					bottom: '<div class="clear"></div>'
				});

				buffer.insert({
					bottom: me.moreTrigger.remove()
				});
			} else {
				notWorldPartnerBuffer.insert({
					bottom: container
				});
			}
		});

		this.moreTrigger.show();

		// TODO: Animation oder nicht?

		var triggerLink = this.moreTrigger.down("a");

		triggerLink.on("click", function() {
			if (notWorldPartnerBuffer.visible()) {
				notWorldPartnerBuffer.hide();
				triggerLink.removeClassName("opened");

				return;
			}

			notWorldPartnerBuffer.show();
			triggerLink.addClassName("opened");
		});

		notWorldPartnerBuffer.hide();

		buffer.insert({
			bottom: notWorldPartnerBuffer
		});

		this.targetElement.insert({
			after: buffer
		});

		this.targetElement.remove();

		buffer.removeClassName("hidden");
	},

	triggerClick: function(bannerData) {
		document.fire(Weber.Tracking.Events.AdWords.ClickBanner, bannerData);

		var bannerTrackingData = new Weber.Tracking.Data();

		bannerTrackingData.setAction("aw-out");
		bannerTrackingData.setLabel(bannerData.name);
		bannerTrackingData.setValue(this.information.articleName + " | " + this.search);

		Weber.tracking.trigger(bannerTrackingData);
	}
});
