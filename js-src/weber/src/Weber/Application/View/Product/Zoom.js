/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Counter
 * @requiresPackage Weber
 * @requiresPackage Weber.Product
 */
anyLib.registerNamespace("Weber.Application.View.Product");

Weber.Application.View.Product.Zoom = Class.create(anyLib.Application.View, {
	sliderItems: [],
	iconOverlay: null,
	regularImage: null,
	zoomIndicator: null,
	loadingOverlay: null,
	cancelInteraction: false,
	productDetailImage: null,

	currentSliderItem: 0,

	/**
	 * Gets the current
	 * @returns {String}
	 */
	getCurrent: function() {
		if (typeof(this._current) == "undefined")
			this.setCurrent(null);

		return this._current;
	},
	/**
	 * Sets the current
	 * @param {String} current The current
	 */
	setCurrent: function(current) {
		this._current = current;

		return this;
	},
	/**
	 * Gets the buffer
	 * @returns {Image}
	 */
	getBuffer: function() {
		if (typeof(this._buffer) == "undefined")
			this.setBuffer(null);

		return this._buffer;
	},
	/**
	 * Sets the buffer
	 * @param {Image} buffer The buffer
	 */
	setBuffer: function(buffer) {
		this._buffer = buffer;

		return this;
	},
	/**
	 * Gets the animation
	 * @returns {Null|Object}
	 */
	getAnimation: function() {
		if (typeof(this._animation) == "undefined")
			this._setAnimation(null);

		return this._animation;
	},
	/**
	 * Sets the animation
	 * @param {Null|Object} animation The animation
	 */
	_setAnimation: function(animation) {
		this._animation = animation;

		return this;
	},
	/**
	 * Cancels the current animation
	 */
	cancelAnimation: function() {
		if (this.getAnimation() != null)
			this.getAnimation().cancel();

		return this._setAnimation(null);
	},

	/**
	 * Gets the productZoom
	 * @returns {Weber.Product.Zoom}
	 */
	getProductZoom: function() {
		if (typeof(this._productZoom) == "undefined")
			this.setProductZoom(new Weber.Product.Zoom());

		return this._productZoom;
	},
	/**
	 * Sets the productZoom
	 * @param {Weber.Product.Zoom} productZoom The productZoom
	 */
	setProductZoom: function(productZoom) {
		this._productZoom = productZoom;

		return this;
	},

	render: function() {
		this.iconOverlay = this.productDetailImage.down(".icon");

		this.zoomIndicator = this.productDetailImage.down(".zoom");

		this.regularImage = this.productDetailImage.down(".regular-image");

		this.setBuffer(this.productDetailImage.down(".zoomed-image"));

		this.loadingOverlay = this.productDetailImage.down(".loading-overlay");

		this.getProductZoom().setFrame(this.getBuffer());
		this.getProductZoom().setViewPort(this.productDetailImage);

		var me = this;

		this.getBuffer().onload = function() {
			me.cancelInteraction = true;

			me.enterZoom();
		};

		this.regularImage.on("click", function() {
			if (me.cancelInteraction === true)
				return;

			if (me.zoomIndicator.hasClassName("zoomed") === true)
				return;

			me.cancelInteraction = true;

			me.enterZoom();
		});

		this.zoomIndicator.on("click", function() {
			if (me.cancelInteraction === true)
				return;

			if (me.zoomIndicator.hasClassName("zoomed") === false) {
				me.enterZoom();
			} else {
				me.exitZoom();
			}
		});

		var changePictureCounter = new anyLib.Counter();
		changePictureCounter.setLimit(2);

		changePictureCounter.onLimitReached.add(function() {
			me.cancelAnimation();

			me._setAnimation(new Effect.Parallel([
				new Effect.Appear(me.regularImage, {
					sync: true
				}),
				new Effect.Fade(me.loadingOverlay, {
					sync: true
				})
			], {
				duration: 0.4,
				afterFinish: function() {
					me.cancelInteraction = false;
				}
			}));
		});

		var preparePictureChange = function() {
			me.cancelAnimation();

			me._setAnimation(new Effect.Parallel([
				new Effect.Fade(me.regularImage, {
					sync: true
				}),
				new Effect.Appear(me.loadingOverlay, {
					sync: true
				})
			], {
				duration: 0.4,
				afterFinish: function() {
					var information = me.sliderItems[me.currentSliderItem].down(".zoom-info").innerHTML.evalJSON();

					me.regularImage.src = information.regular;
					me.productDetailImage.down(".zoom-info").innerHTML = me.sliderItems[me.currentSliderItem].down(".zoom-info").innerHTML;

					changePictureCounter.count();
				}
			}));
		};

		this.sliderItems.each(function(sliderItem, index) {
			sliderItem.on("click", function() {
				if (me.cancelInteraction === true)
					return;

				me.cancelInteraction = true;

				changePictureCounter.reset();

				me.regularImage.onload = function() {
					changePictureCounter.count();
				};

				var information = sliderItem.down(".zoom-info").innerHTML.evalJSON();

				if (me.currentSliderItem == index)
					return;

				sliderItem.addClassName("active");
				me.sliderItems[me.currentSliderItem].removeClassName("active");

				me.currentSliderItem = index;

				me.cancelAnimation();

				if (me.zoomIndicator.hasClassName("zoomed")) {
					me.exitZoom(function() {
						preparePictureChange(information);
					});

					return;
				}

				preparePictureChange(information);
			});
		});
	},

	getZoomInformation: function() {
		return this.productDetailImage.down(".zoom-info").innerHTML.evalJSON();
	},

	enterZoom: function() {
		var information = this.getZoomInformation();

		if (information.zoomed != this.getCurrent()) {
			this.loadingOverlay.show();
			this.getBuffer().hide();
			this.getBuffer().setStyle({
				top: "-100px",
				left: "-100px"
			});

			this.setCurrent(information.zoomed);

			this.getBuffer().src = information.zoomed;

			return;
		}

		this.zoomIndicator.addClassName("zoomed");

		this.getProductZoom().enable();

		var animations = [
			new Effect.Appear(this.getBuffer(), {
				sync: true
			}),
			new Effect.Morph(this.getBuffer(), {
				style: {
					top: (this.getProductZoom().getFrame().measure("height") / -5) + "px",
					left: (this.getProductZoom().getFrame().measure("width") / -3) + "px"
				},
				sync: true
			}),
			new Effect.Fade(this.loadingOverlay, {
				sync: true
			})
		];

		if (this.iconOverlay != null) {
			animations.push(new Effect.Fade(this.iconOverlay, {
				sync: true
			}));
		}

		this.cancelAnimation();

		var me = this;

		this._setAnimation(new Effect.Parallel(animations, {
			duration: 0.7,
			afterFinish: function() {
				me.cancelInteraction = false;
			}
		}));
	},

	exitZoom: function(callback) {
		if (typeof(callback) != "function")
			callback = Prototype.emptyFunction;

		this.zoomIndicator.removeClassName("zoomed");

		this.getProductZoom().disable();

		var framePosition = {
			top: this.getProductZoom().getFrame().measure("top") - 100,
			left: this.getProductZoom().getFrame().measure("left") - 100
		};

		if (Math.abs(framePosition.top) > this.getProductZoom().getMaximumOffset().top)
			framePosition.top = this.getProductZoom().getMaximumOffset().top * -1;

		if (Math.abs(framePosition.left) > this.getProductZoom().getMaximumOffset().left)
			framePosition.left = this.getProductZoom().getMaximumOffset().left * -1;

		var animations = [
			new Effect.Fade(this.getBuffer(), {
				sync: true
			}),
			new Effect.Morph(this.getBuffer(), {
				style: {
					top: framePosition.top + "px",
					left: framePosition.left + "px"
				},
				sync: true
			})
		];

		if (this.iconOverlay != null) {
			animations.push(new Effect.Appear(this.iconOverlay, {
				sync: true
			}));
		}

		this.cancelAnimation();

		var me = this;

		this._setAnimation(new Effect.Parallel(animations, {
			duration: 0.5,
			afterFinish: function() {
				me.cancelInteraction = false;

				callback();
			}
		}));
	}

});