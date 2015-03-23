/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Home
 */
anyLib.registerNamespace("Weber.Application.View.Home");

Weber.Application.View.Home.Default = Class.create(anyLib.Application.View, {
	visual: null,
	teaser: [],

	render: function() {
		if (swfobject.hasFlashPlayerVersion("8.0.0")) {
			swfobject.embedSWF(
				"/Files/Images/startseite/animation/animation.swf",
				"home-visual-stage",
				this.visual.measure("width"),
				this.visual.measure("height"),
				"8.0.0",
				null,
				{
					"link": this.visual.down(".teaser-item").readAttribute("href"),
					"target": this.visual.down(".teaser-item").readAttribute("target")
				},
				{
					wmode: "opaque"
				}
			);
		} else {
			this.teaser.push(this.visual);
		}

		this.renderTeasers();
	},

	renderTeasers: function() {
		var me = this;

		this.teaser.each(function(teaserElement) {
			var heading;
			var pagingItems;

			var currentTeaser = 0;

			var teaserItems = teaserElement.select(".teaser-item");

			var animating = false;

			var switchToTeaser = function(index) {
				if (index == currentTeaser)
					return;

				try {
					pagingItems[currentTeaser].removeClassName("active");
					pagingItems[index].addClassName("active");
				} catch (e) {
				}

				teaserItems[currentTeaser].setStyle({
					zIndex: 20
				});

				teaserItems[index].setStyle({
					zIndex: 21
				});

				try {
					var headingElement = teaserItems[index].down(".heading");

					if (headingElement != null)
						heading.innerHTML = headingElement.innerHTML;
				} catch (e) {
				}

				animating = true;

				new Effect.Appear(teaserItems[index], {
					duration: 1.4,
					afterFinish: function() {
						teaserItems[currentTeaser].hide();

						currentTeaser = index;

						animating = false;
					}
				});
			};

			var switchTeaser = function() {
				if ((currentTeaser + 1) >= teaserItems.length) {
					switchToTeaser(0);

					return;
				}

				switchToTeaser(currentTeaser + 1);
			};

			var teaserInterval = null;

			var startInterval = function() {
				if (teaserItems.length < 2)
					return;

				teaserInterval = setInterval(switchTeaser, 5000);
			};

			var stopInterval = function() {
				if (teaserInterval == null)
					return;

				clearInterval(teaserInterval);
				teaserInterval = null
			};

			if (teaserItems.length > 1) {
				try {
					heading = teaserElement.down("h3");

					pagingItems = teaserElement.select(".paging .page");

					pagingItems.each(function(pagingItem, index) {
						pagingItem.on("click", function() {
							if (animating == true)
								return;

							stopInterval();

							switchToTeaser(index);

							startInterval();
						});
					});
				} catch (e) {
				}

				startInterval();
			}

			teaserItems.each(function(teaserItem) {
				var hoverImage = teaserItem.down(".hover");
				var regularImage = teaserItem.down(".regular");

				teaserItem.on("mouseenter", function() {
					regularImage.hide();

					hoverImage.show();

					stopInterval();
				});

				teaserItem.on("mouseleave", function() {
					hoverImage.hide();

					regularImage.show();

					startInterval();
				});

				var videoUrl = teaserItem.down(".video-url");

				if (videoUrl)
					me.handleVideoTeaser(teaserItem, videoUrl);
			});
		});
	},

	handleVideoTeaser: function(element, videoUrl) {
		var request = new anyLib.Application.Controller.Request();

		request.setAction("video");
		request.setModule("default");
		request.setController("home");
		request.setNamespace(Weber.Application);

		request.getParameters().set("element", element);
		request.getParameters().set("videoUrl", videoUrl.innerHTML);

		Weber.application.dispatch(request);
	}
});
