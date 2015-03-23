/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Dealer");

Weber.Application.View.Dealer.Online = Class.create(anyLib.Application.View, {
	bannerElements: [],

	render: function() {
		if (this.bannerElements.length == 0)
			return;

		var me = this;

		this.bannerElements.each(function(element) {
			var children = element.select(".dealer-search-item");

			children.each(function(child) {
				var targetLink = child.down("a");

				var targetUrl = "-";

				if (targetLink != null)
					targetUrl = targetLink.readAttribute("href");

				var trackingValue = child.down(".information strong").innerHTML;

				var trackingData = new Weber.Tracking.Data();

				trackingData.setValue(targetUrl);
				trackingData.setLabel(trackingValue);
				trackingData.setAction("online-dealer-click");

				child.on("click", function() {
					Weber.tracking.trigger(trackingData);

					document.fire(Weber.Tracking.Events.OnlineDealer.ClickBanner, {
						targetUrl: targetUrl,
						dealer: trackingValue,
						origin: "online-dealer-page"
					});
				});
			});

			if (element.hasClassName("dealer-type-world-partner")) {
				me.shuffleHourly(element, children);
				me.selectFirstAndLast(element.select(".dealer-search-item"));
				return;
			}

			me.shuffle(element, children);
			me.selectFirstAndLast(element.select(".dealer-search-item"))
		});
	},

	shuffle: function(containerElement, children) {
		children.sort(function() { return Math.round(Math.random()) - 0.5; });

		children.each(function(child) {
			containerElement.insert({
				bottom: child.remove()
			});
		});
	},

	shuffleHourly: function(containerElement, children) {
		var date = new Date();

		var shift = Math.floor((date.getMinutes() / (60 / children.length)) % children.length);

		if (shift == 0)
			return;

		for (var i = 0; i < shift; i++) {
			containerElement.insert({
				bottom: children[i].remove()
			});
		}
	},

	selectFirstAndLast: function(elements) {
		elements.first().addClassName('first');
		elements.last().addClassName('last');
	}
});
