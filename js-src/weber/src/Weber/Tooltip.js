/**
 * @package Weber.Tooltip
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber");

Weber.Tooltip = Class.create({
	/**
	 * Gets the positioningMode
	 * @returns {String}
	 */
	getPositioningMode: function() {
		if (typeof(this._positioningMode) == "undefined")
			this.setPositioningMode("fixed-top");

		return this._positioningMode;
	},
	/**
	 * Sets the positioningMode
	 * @param {String} positioningMode The positioningMode
	 */
	setPositioningMode: function(positioningMode) {
		this._positioningMode = positioningMode;

		return this;
	},
	/**
	 * Gets the parentElement
	 * @returns {Element}
	 */
	getParentElement: function() {
		if (typeof(this._parentElement) == "undefined")
			this.setParentElement(null);

		return this._parentElement;
	},
	/**
	 * Sets the parentElement
	 * @param {Element} parentElement The parentElement
	 */
	setParentElement: function(parentElement) {
		this._parentElement = parentElement;

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
	/**
	 * Gets the fadeTimeout
	 * @returns {Object|Number|Null}
	 */
	_getFadeTimeout: function() {
		if (typeof(this._fadeTimeout) == "undefined")
			this._setFadeTimeout(null);

		return this._fadeTimeout;
	},
	/**
	 * Sets the fadeTimeout
	 * @param {Object|Number|Null} fadeTimeout The fadeTimeout
	 */
	_setFadeTimeout: function(fadeTimeout) {
		this._fadeTimeout = fadeTimeout;

		return this;
	},
	_cancelFadeTimeout: function() {
		if (this._getFadeTimeout() != null)
			clearTimeout(this._getFadeTimeout());

		this._setFadeTimeout(null);
	},
	/**
	 * Gets the mouseMoveHandle
	 * @returns {Object}
	 */
	_getMouseMoveHandle: function() {
		if (typeof(this._mouseMoveHandle) == "undefined")
			this._setMouseMoveHandle(null);

		return this._mouseMoveHandle;
	},
	/**
	 * Sets the mouseMoveHandle
	 * @param {Object} mouseMoveHandle The mouseMoveHandle
	 */
	_setMouseMoveHandle: function(mouseMoveHandle) {
		this._mouseMoveHandle = mouseMoveHandle;

		return this;
	},
	/**
	 * Gets the animation
	 * @returns {Object}
	 */
	_getAnimation: function() {
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
	_cancelAnimation: function() {
		if (this._getAnimation() != null)
			this._getAnimation().cancel();

		this._setAnimation(null);
	},

	// TODO: Offset einbauen

	_updatePosition: function(event) {
		var mousePosition = anyLib.Event.getMousePosition(event);

		this.getElement().setStyle({
			position: "fixed",
			top: (mousePosition.top + (this.getElement().measure("height") * -1)) + "px",
			left: (mousePosition.left - 15 + (this.getElement().measure("width") * -1)) + "px"
		});
	},

	_setup: function() {
		var me = this;

		if (this.getPositioningMode() == Weber.Tooltip.PositioningModes.follow_user) {
			this._setMouseMoveHandle(document.on("mousemove", function(event) {
				me._updatePosition(event);
			}));

			this._getMouseMoveHandle().stop();

			return;
		}

		var style = {
		};

		if (this.getPositioningMode() == Weber.Tooltip.PositioningModes.fixed_top) {
			style = {
				left: "-" + ((this.getElement().measure("width") - this.getParentElement().measure("width")) / 2) + "px",
				top: "-" + (this.getElement().measure("height")) + "px"
			}
		}

		if (this.getPositioningMode() == Weber.Tooltip.PositioningModes.fixed_bottom) {
			style = {
				left: "-" + ((this.getElement().measure("width") - this.getParentElement().measure("width")) / 2) + "px",
				top: (this.getParentElement().measure("height")) + "px"
			}
		}

		if (this.getPositioningMode() == Weber.Tooltip.PositioningModes.fixed_left) {
			style = {
				left: "-" + (this.getElement().measure("width")) + "px",
				top: ((this.getElement().measure("height") - this.getParentElement().measure("height")) / 2) + "px"
			}
		}

		if (this.getPositioningMode() == Weber.Tooltip.PositioningModes.fixed_right) {
			style = {
				left: (this.getParentElement().measure("width")) + "px",
				top: ((this.getElement().measure("height") - this.getParentElement().measure("height")) / 2) + "px"
			}
		}

		style.position = "absolute";

		this.getElement().setStyle(style);
	},

	show: function() {
		this._cancelAnimation();

		this._setAnimation(new Effect.Appear(this.getElement(), {
			duration: 0.3
		}));

		if (this.getPositioningMode() != Weber.Tooltip.PositioningModes.follow_user)
			return;

		this._getMouseMoveHandle().start();
	},
	hide: function() {
		var me = this;

		this._cancelAnimation();

		this._setAnimation(new Effect.Fade(this.getElement(), {
			duration: 0.3,
			afterFinish: function() {
				if (me.getPositioningMode() != Weber.Tooltip.PositioningModes.follow_user)
					return;

				me._getMouseMoveHandle().stop();
			}
		}));
	},

	activate: function() {
		var me = this;

		this._setup();

		this.getParentElement().on("mouseenter", function() {
			me._cancelFadeTimeout();

			me.show();
		});

		this.getParentElement().on("mouseleave", function() {
			me._cancelFadeTimeout();

			me._setFadeTimeout(setTimeout(function() {
				me.hide();
			}, 100));
		});
	}
	// TODO: deactivate
});

Weber.Tooltip.PositioningModes = {
	"fixed_top": "fixed-top",
	"fixed_right": "fixed-right",
	"fixed_bottom": "fixed-bottom",
	"fixed_left": "fixed-left",
	"follow_user": "follow-user"
};
