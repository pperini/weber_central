/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Event
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Concept");

Weber.Application.View.Concept.Default = Class.create(anyLib.Application.View, {
	panelItems: [],
	markerItems: [],
	navigationItems: [],
	navigationContainer: null,
	useFallback: false,

	panelPositions: [],
	navigationMaxOffset: 0,
	navigationDefaultPosition: 0,

	panelGroups: {},

	render: function() {
		var me = this;

		if (typeof(window.Concept) == "undefined") {
			window.Concept = new anyLib.Event.Collection();
		} else {
			var existingListeners = window.Concept.listeners;

			window.Concept = new anyLib.Event.Collection();

			existingListeners.each(function(listener) {
				window.Concept.add(listener);
			});
		}

		this.navigationItems.each(function(navigationItem, index) {
			var animation = null;

			var navigationItemText = navigationItem.down(".text");

			var cancelAnimation = function() {
				if (animation != null)
					animation.cancel();

				animation = null;
			};

			navigationItem.on("mouseenter", function() {
				cancelAnimation();

				animation = new Effect.Appear(navigationItemText, {
					to: 1,
					duration: 0.3
				});
			});

			navigationItem.on("mouseleave", function() {
				cancelAnimation();

				animation = new Effect.Fade(navigationItemText, {
					to: 0,
					duration: 0.3
				});
			});

			if (!me.useFallback)
				return;

			navigationItem.on("click", function(event) {
				Event.stop(event);

				cancelScrollAnimation();

				scrollAnimation = Effect.ScrollTo(me.markerItems[index], {
					duration: 0.8,
					offset: -12
				})
			});
		});

		if (!this.useFallback)
			return;

		var scrollAnimation = null;

		var cancelScrollAnimation = function() {
			if (scrollAnimation != null)
				scrollAnimation.cancel();

			scrollAnimation = null;
		};

		this.navigationDefaultPosition = this.navigationContainer.measure("top");
		this.navigationMaxOffset = this.navigationMaxOffset - this.navigationContainer.cumulativeOffset().top;

		var navigationContainerHeight = this.navigationContainer.measure("height");

		var panelHeight = 600;

		for (var i = 1; i <= 4; i++) {
			this.panelPositions.push({
				starting: this.navigationMaxOffset + this.navigationDefaultPosition + navigationContainerHeight,
				ending: this.navigationDefaultPosition + this.navigationMaxOffset + panelHeight + navigationContainerHeight
			});

			this.navigationMaxOffset = this.navigationMaxOffset + panelHeight;
		}

		Event.on(window, "hashchange", function(event) {
			Event.stop(event);
		});

		Event.on(window, "scroll", function() {
			me.onScroll();
		});

		this.onScroll();
	},

	onScroll: function() {
		window.Concept.fire(this.moveNavigation(document.viewport.getScrollOffsets().top));
	},

	moveNavigation: function(offset) {
		var me = this;

		var currentIndex = -1;

		this.panelPositions.each(function(panelPosition, index) {
			if (offset >= panelPosition.starting && offset < panelPosition.ending) {
				me.navigationItems[index].addClassName("active");

				currentIndex = index;

				return;
			}

			if (me.navigationItems[index].hasClassName("active"))
				me.navigationItems[index].removeClassName("active");
		});

		if (currentIndex == -1) {
			currentIndex = this.panelPositions.length - 1;

			this.navigationItems[currentIndex].addClassName("active");
		}

		offset = offset + this.navigationDefaultPosition;

		if (offset > this.navigationMaxOffset)
			offset = this.navigationMaxOffset;

		this.navigationContainer.setStyle({
			top: offset + "px"
		});
	}
});