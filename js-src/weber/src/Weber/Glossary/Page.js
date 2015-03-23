/**
 * @package Weber.Glossary
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Paging
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Glossary");

Weber.Glossary.Page = Class.create(anyLib.Paging.Page, {
	/**
	 * Gets the letter
	 * @returns {Element}
	 */
	getLetter: function() {
		if (typeof(this._letter) == "undefined")
			this.setLetter(null);

		return this._letter;
	},
	/**
	 * Sets the letter
	 * @param {Element} letter The letter
	 */
	setLetter: function(letter) {
		this._letter = letter;

		return this;
	},
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
	 * Cancels the animation
	 */
	cancelAnimation: function() {
		if (this.getAnimation() != null)
			this.getAnimation().cancel();

		this._setAnimation(null);

		return this;
	},

	enter: function() {
		this.beforeEnter.fire(this);

		this.getLetter().addClassName("active");

		this.cancelAnimation();

		var me = this;

		this._setAnimation(new Effect.Appear(this.getElement(), {
			to: 1,
			duration: 0.3,
			afterFinish: function() {
				me.afterEnter.fire(this);
			}
		}));

		return this;
	},

	exit: function() {
		this.beforeExit.fire(this);

		this.getLetter().removeClassName("active");

		this.cancelAnimation();

		var me = this;

		this._setAnimation(new Effect.Fade(this.getElement(), {
			to: 0,
			duration: 0.3,
			afterFinish: function() {
				me.afterExit.fire(this);
			}
		}));

		return this;
	}
});
