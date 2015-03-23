/**
 * @package Weber.MainNavigation
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.MainNavigation");

Weber.MainNavigation.DropDown = Class.create({
	/**
	 * Gets the animation
	 * @returns {Object|Null}
	 */
	getAnimation: function() {
		if (typeof(this._animation) == "undefined")
			this._setAnimation(null);

		return this._animation;
	},
	/**
	 * Sets the animation
	 * @param {Object|Null} animation The animation
	 */
	_setAnimation: function(animation) {
		this._animation = animation;
		return this;
	},
	/**
	 * Gets the element
	 * @returns {Element}
	 */
	getElement: function() {
		if (typeof(this._element) == "undefined")
			this.setElement(null);

		return this._element;
	},
	/**
	 * Sets the element
	 * @param {Element} element The element
	 */
	setElement: function(element) {
		this._element = element;
		return this;
	},

	cancelAnimation: function() {
		if (this.getAnimation() != null) {
			this.getAnimation().cancel();

			this._setAnimation(null);
		}

		return this;
	},
	/**
	 * Gets the delay
	 * @returns {Number}
	 */
	getDelay: function() {
		if (typeof(this._delay) == "undefined")
			this.setDelay(0);

		return this._delay;
	},
	/**
	 * Sets the delay
	 * @param {Number} delay The delay
	 */
	setDelay: function(delay) {
		this._delay = delay;
		return this;
	},
	/**
	 * Gets the isOpened
	 * @returns {Boolean}
	 */
	getIsOpened: function() {
		if (typeof(this._isOpened) == "undefined")
			this.setIsOpened(false);

		return this._isOpened;
	},
	/**
	 * Sets the isOpened
	 * @param {Boolean} isOpened The isOpened
	 */
	setIsOpened: function(isOpened) {
		this._isOpened = isOpened;

		return this;
	},
	/**
	 * Enters the page and invokes the beforeEnter and afterEnter events
	 */
	enter: function() {
		this.cancelAnimation();

		var me = this;

		this._setAnimation(new Effect.Appear(this.getElement(), {
			duration: 0.2,
			afterFinish: function() {
				me.setIsOpened(true);
			}
		}));
	},
	/**
	 * Exits the page and invokes the beforeExit and afterExit events
	 */
	exit: function() {
		this.cancelAnimation();

		var me = this;

		this._setAnimation(new Effect.Fade(this.getElement(), {
			duration: 0.2,
			delay: this.getDelay(),
			afterFinish: function() {
				me.setIsOpened(false);
			}
		}));
	}
});
