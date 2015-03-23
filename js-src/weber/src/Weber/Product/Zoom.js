/**
 * @package Weber.Product
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Event
 * @requiresPackage anyLib.Collection
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Product");

Weber.Product.Zoom = Class.create({
	/**
	 * Gets the viewPort
	 * @returns {Element}
	 */
	getViewPort: function() {
		if (typeof(this._viewPort) == "undefined")
			this.setViewPort(null);

		return this._viewPort;
	},
	/**
	 * Sets the viewPort
	 * @param {Element} viewPort The viewPort
	 */
	setViewPort: function(viewPort) {
		this._viewPort = viewPort;

		return this;
	},
	/**
	 * Gets the frame
	 * @returns {Element}
	 */
	getFrame: function() {
		if (typeof(this._frame) == "undefined")
			this.setFrame(null);

		return this._frame;
	},
	/**
	 * Sets the frame
	 * @param {Element} frame The frame
	 */
	setFrame: function(frame) {
		this._frame = frame;

		return this;
	},
	/**
	 * Gets the eventHandles
	 * @returns {anyLib.Collection.KeyValue}
	 */
	getEventHandles: function() {
		if (typeof(this._eventHandles) == "undefined")
			this.setEventHandles(new anyLib.Collection.KeyValue());

		return this._eventHandles;
	},
	/**
	 * Sets the eventHandles
	 * @param {anyLib.Collection.KeyValue} eventHandles The eventHandles
	 */
	setEventHandles: function(eventHandles) {
		this._eventHandles = eventHandles;

		return this;
	},
	/**
	 * Gets the maximumOffset
	 * @returns {Object}
	 */
	getMaximumOffset: function() {
		if (typeof(this._maximumOffset) == "undefined")
			this.setMaximumOffset({
				top: this.getFrame().measure("height") - this.getViewPort().measure("height"),
				left: this.getFrame().measure("width") - this.getViewPort().measure("width")
			});

		return this._maximumOffset;
	},
	/**
	 * Sets the maximumOffset
	 * @param {Object} maximumOffset The maximumOffset
	 */
	setMaximumOffset: function(maximumOffset) {
		this._maximumOffset = maximumOffset;

		return this;
	},
	/**
	 * Gets the position
	 * @returns {Object}
	 */
	getPosition: function() {
		if (typeof(this._position) == "undefined")
			this.setPosition({ frame: { top: 0, left: 0 }, mouse: { top: 0, left: 0 } });

		return this._position;
	},
	/**
	 * Sets the position
	 * @param {Object} position The position
	 */
	setPosition: function(position) {
		this._position = position;

		return this;
	},

	enable: function() {
		if (this.getEventHandles().hasKey("zoomStart") === false) {
			var me = this;

			this.getEventHandles().set("zoomStart", this.getViewPort().on("mousedown", function(event) {
				Event.stop(event);

				me._start(event);
			}));

			this.getEventHandles().set("zoomMove", this.getViewPort().on("mousemove", function(event) {
				Event.stop(event);

				me._move(event);
			}));

			this.getEventHandles().set("zoomStop", document.on("mouseup", function() {
				me.getEventHandles().get("zoomMove").stop();
				me.getEventHandles().get("zoomStop").stop();
				me.getEventHandles().get("zoomStart").start();
			}));
		}

		this.getEventHandles().get("zoomMove").stop();
		this.getEventHandles().get("zoomStop").stop();
		this.getEventHandles().get("zoomStart").start();
	},

	disable: function() {
		this.getEventHandles().get("zoomMove").stop();
		this.getEventHandles().get("zoomStop").stop();
		this.getEventHandles().get("zoomStart").stop();
	},

	_start: function(event) {
		this.getEventHandles().get("zoomMove").start();
		this.getEventHandles().get("zoomStop").start();
		this.getEventHandles().get("zoomStart").stop();

		this.setPosition({
			frame: {
				top: this.getFrame().measure("top"),
				left: this.getFrame().measure("left")
			},
			mouse: anyLib.Event.getMousePosition(event)
		});

		this._move(event);
	},

	_move: function(event) {
		var mousePosition = anyLib.Event.getMousePosition(event);

		var offset = {
			top: ((this.getPosition().mouse.top - mousePosition.top) - this.getPosition().frame.top),
			left: ((this.getPosition().mouse.left - mousePosition.left) - this.getPosition().frame.left)
		};

		if (offset.left > 0 && offset.left < this.getMaximumOffset().left) {
			offset.left = offset.left * -1;
		} else if (offset.left >= this.getMaximumOffset().left) {
			offset.left = this.getMaximumOffset().left * -1;
		} else if (offset.left < this.getMaximumOffset().left) {
			offset.left = 0;
		}

		if (offset.top > 0 && offset.top < this.getMaximumOffset().top) {
			offset.top = offset.top * -1;
		} else if (offset.top >= this.getMaximumOffset().top) {
			offset.top = this.getMaximumOffset().top * -1;
		} else if (offset.top < this.getMaximumOffset().top) {
			offset.top = 0;
		}

		this.getFrame().setStyle({
			top: offset.top + "px",
			left: offset.left + "px"
		});
	}
});
