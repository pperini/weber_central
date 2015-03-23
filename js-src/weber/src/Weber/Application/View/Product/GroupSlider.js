/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Collection
 * @requiresPackage anyLib.UI.ScrollBar
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Product");

Weber.Application.View.Product.GroupSlider = Class.create(anyLib.Application.View, {
	scrollBar: null,
	arrowLeft: null,
	arrowRight: null,
	sliderFrame: null,

	maximumOffset: 0,
	sliderItemWidth: 0,
	sliderContainer: null,
	animationDuration: 0.3,

	/**
	 * Gets the arrowAnimation
	 * @returns {anyLib.Collection.KeyValue}
	 */
	getArrowAnimations: function() {
		if (typeof(this._arrowAnimations) == "undefined")
			this.setArrowAnimations(new anyLib.Collection.KeyValue());

		return this._arrowAnimations;
	},
	/**
	 * Sets the arrowAnimation
	 * @param {anyLib.Collection.KeyValue} arrowAnimations The arrowAnimation
	 */
	setArrowAnimations: function(arrowAnimations) {
		this._arrowAnimations = arrowAnimations;

		return this;
	},
	cancelArrowAnimation: function(key) {
		if (this.getArrowAnimations().hasKey(key) === true && this.getArrowAnimations().getValue(key) != null)
			this.getArrowAnimations().getValue(key).cancel();

		this.getArrowAnimations().set(key, null);

		return this;
	},

	/**
	 * Gets the ignoreScrollUpdate
	 * @returns {Boolean}
	 */
	getIgnoreScrollUpdate: function() {
		if (typeof(this._ignoreScrollUpdate) == "undefined")
			this.setIgnoreScrollUpdate(false);

		return this._ignoreScrollUpdate;
	},
	/**
	 * Sets the ignoreScrollUpdate
	 * @param {Boolean} ignoreScrollUpdate The ignoreScrollUpdate
	 */
	setIgnoreScrollUpdate: function(ignoreScrollUpdate) {
		this._ignoreScrollUpdate = ignoreScrollUpdate;

		return this;
	},

	render: function() {
		this.scrollBar = new anyLib.UI.ScrollBar.Horizontal();

		this.scrollBar.setContainer(this.sliderContainer.down(".slider-scrubber"));
		this.scrollBar.setHandle(this.sliderContainer.down(".slider-scrubber-handle"));

		this.sliderFrame = this.sliderContainer.down(".slider-frame");

		var sliderItems = this.sliderFrame.select(".slider-item");

		this.sliderItemWidth = sliderItems.first().measure("width") + sliderItems.first().measure("padding-left") + sliderItems.first().measure("padding-right") + sliderItems.first().measure("margin-left") + sliderItems.first().measure("margin-right");

		sliderItems.last().setStyle({
			marginRight: "0px"
		});

		var sliderFrameWidth = (this.sliderItemWidth * sliderItems.length) - sliderItems.first().measure("margin-right");

		this.sliderFrame.setStyle({
			width: sliderFrameWidth + "px"
		});

		this.maximumOffset = sliderFrameWidth - this.sliderContainer.down(".slider-viewport").measure("width");

		this.arrowLeft = this.sliderContainer.down(".arrow.left");
		this.arrowRight = this.sliderContainer.down(".arrow.right");

		var me = this;

		this.arrowLeft.on("click", function(event) {
			Event.stop(event);

			me.prev();
		});

		this.arrowRight.on("click", function(event) {
			Event.stop(event);

			me.next();
		});

		var opacity = 0.2;

		this.scrollBar.onScrollStart.add(function() {
			me.setIgnoreScrollUpdate(false);
		});

		this.scrollBar.onScroll.add(function() {
			var value = me.scrollBar.getValue();

			if (value == 0) {
				me.cancelArrowAnimation("arrowLeft");

				me.getArrowAnimations().set("arrowLeft", new Effect.Fade(me.arrowLeft, {
					to: opacity,
					duration: me.animationDuration
				}));

				me.arrowLeft.removeClassName("active");
			} else {
				if (!me.arrowLeft.hasClassName("active"))
					me.arrowLeft.addClassName("active");
			}

			if (value == 100) {
				me.cancelArrowAnimation("arrowRight");

				me.getArrowAnimations().set("arrowRight", new Effect.Fade(me.arrowRight, {
					to: opacity,
					duration: me.animationDuration
				}));

				me.arrowRight.removeClassName("active");
			} else {
				if (!me.arrowRight.hasClassName("active"))
					me.arrowRight.addClassName("active");
			}

			if (value > 0 && me.arrowLeft.getOpacity() == opacity) {
				me.cancelArrowAnimation("arrowLeft");

				me.getArrowAnimations().set("arrowLeft", new Effect.Appear(me.arrowLeft, {
					to: 1,
					duration: me.animationDuration
				}));
			}

			if (value < 100 && me.arrowRight.getOpacity() == opacity) {
				me.cancelArrowAnimation("arrowRight");

				me.getArrowAnimations().set("arrowRight", new Effect.Appear(me.arrowRight, {
					to: 1,
					duration: me.animationDuration
				}));
			}

			if (me.getIgnoreScrollUpdate() === true)
				return;

			me.cancelArrowAnimation("frame");

			me.sliderFrame.setStyle({
				left: "-" + ((me.maximumOffset / 100) * me.scrollBar.getValue()) + "px"
			});
		});

		document.on(anyLib.Event.getMouseScrollEvent(), function(event) {
			if (Event.findElement(event).descendantOf(me.sliderContainer) === false)
				return;

			Event.stop(event);

			me.setIgnoreScrollUpdate(false);

			var value = me.scrollBar.getValue();

			if (anyLib.Event.getMouseScrollDelta(event) === 1) {
				value = value - 10;

				if (value < 0)
					value = 0;
			} else {
				value = value + 10;

				if (value > 100)
					value = 100;
			}

			me.scrollBar.setToValue(value);
		});

		this.scrollBar.setToValue(0);
	},

	prev: function() {
		var currentItem = Math.ceil(Math.abs(this.sliderFrame.measure("left")) / this.sliderItemWidth);

		if (currentItem == 0)
			return;

		this.setIgnoreScrollUpdate(true);

		var me = this;

		this.getArrowAnimations().set("frame", new Effect.Morph(this.sliderFrame, {
			style: {
				left: "-" + this.sliderItemWidth * (currentItem - 1) + "px"
			},
			duration: 0.4,
			afterUpdate: function() {
				var value = (100 / me.maximumOffset) * me.sliderFrame.measure("left") * -1;

				if (value < 0)
					value = 0;

				me.scrollBar.setToValue(value);
			},
			afterFinish: function() {
				me.setIgnoreScrollUpdate(false);
			}
		}));
	},

	next: function() {
		var left = Math.abs(this.sliderFrame.measure("left"));

		if (left >= this.maximumOffset)
			return;

		var currentItem = Math.round(left / this.sliderItemWidth);

		this.setIgnoreScrollUpdate(true);

		var me = this;

		this.getArrowAnimations().set("frame", new Effect.Morph(this.sliderFrame, {
			style: {
				left: "-" + this.sliderItemWidth * (currentItem + 1) + "px"
			},
			duration: 0.4,
			afterUpdate: function() {
				var value = (100 / me.maximumOffset) * me.sliderFrame.measure("left") * -1;

				if (value > 100)
					value = 100;

				me.scrollBar.setToValue(value);
			},
			afterFinish: function() {
				me.setIgnoreScrollUpdate(false);
			}
		}));
	}
});
