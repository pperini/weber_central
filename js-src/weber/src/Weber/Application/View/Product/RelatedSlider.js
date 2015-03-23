/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Collection
 * @requiresPackage anyLib.UI.ScrollBar
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Product");

Weber.Application.View.Product.RelatedSlider = Class.create(anyLib.Application.View, {
	arrowLeft: null,
	sliderItems: [],
	arrowRight: null,
	sliderFrame: null,
	sliderContainer: null,

	current: 0,
	maximumOffset: 0,
	arrowOpacity: 0.25,
	sliderItemWidth: 0,
	sliderFrameWidth: 0,
	animationDuration: 0.6,

	/**
	 * Gets the animation
	 * @returns {Object}
	 */
	getAnimation: function() {
		if (typeof(this._animation) == "undefined")
			this._setAnimation(null);

		return this._animation;
	},
	/**
	 * Sets the animation
	 * @param {Object} animation The animation
	 */
	_setAnimation: function(animation) {
		this._animation = animation;

		return this;
	},

	cancelAnimation: function() {
		if (this.getAnimation() != null)
			this.getAnimation().cancel();

		return this._setAnimation(null);
	},

	render: function() {
		this.sliderFrame = this.sliderContainer.down(".related-slider-frame");

		this.sliderItems = this.sliderFrame.select(".related-slider-item");

		this.sliderItemWidth = this.sliderItems.first().measure("width") + this.sliderItems.first().measure("padding-left") + this.sliderItems.first().measure("padding-right") + this.sliderItems.first().measure("margin-left") + this.sliderItems.first().measure("margin-right");

		this.sliderItems.last().setStyle({
			marginRight: "0px"
		});

		this.sliderFrameWidth = (this.sliderItemWidth * this.sliderItems.length) - this.sliderItems.first().measure("margin-right");

		this.sliderFrame.setStyle({
			width: this.sliderFrameWidth + "px"
		});

		this.maximumOffset = this.sliderFrameWidth - this.sliderContainer.down(".related-slider-viewport").measure("width");

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

		new Effect.Fade(this.arrowLeft, {
			to: this.arrowOpacity,
			duration: this.animationDuration
		});
	},

	prev: function() {
		if (this.current === 0)
			return this;

		this.cancelAnimation();

		var animations = [];

		this.current--;

		if (this.current < (this.sliderItems.length - 1)) {
			animations.push(new Effect.Appear(this.arrowRight, {
				to: 1,
				sync: true
			}));
		}

		if (this.current == 0) {
			animations.push(new Effect.Fade(this.arrowLeft, {
				sync: true,
				to: this.arrowOpacity
			}));
		}

		this.move(animations);
	},

	next: function() {
		if (this.current === (this.sliderItems.length - 1))
			return this;

		this.cancelAnimation();

		var animations = [];

		this.current++;

		if (this.current > 0) {
			animations.push(new Effect.Appear(this.arrowLeft, {
				to: 1,
				sync: true
			}));
		}

		if (this.current == (this.sliderItems.length - 1)) {
			animations.push(new Effect.Fade(this.arrowRight, {
				sync: true,
				to: this.arrowOpacity
			}));
		}

		this.move(animations);
	},
	move: function(animations) {
		animations.push(new Effect.Morph(this.sliderFrame, {
			style: {
				left: ((this.sliderItemWidth * this.current) * -1) + "px"
			},
			sync: true
		}));

		this._setAnimation(new Effect.Parallel(animations, {
			duration: this.animationDuration
		}));
	}
});