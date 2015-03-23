/**
 * @package Weber.Home
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Home");

Weber.Home.SliderPanel = Class.create({
	/**
	 * Gets the cards
	 * @returns {Element[]}
	 */
	getCards: function() {
		if (typeof(this._cards) == "undefined")
			this.setCards([]);

		return this._cards;
	},
	/**
	 * Sets the cards
	 * @param {Element[]} cards The cards
	 */
	setCards: function(cards) {
		this._cards = cards;
		return this;
	},
	/**
	 * Gets the panel
	 * @returns {Element}
	 */
	getPanel: function() {
		if (typeof(this._panel) == "undefined")
			this.setPanel(null);

		return this._panel;
	},
	/**
	 * Sets the panel
	 * @param {Element} panel The panel
	 */
	setPanel: function(panel) {
		this._panel = panel;
		return this;
	},
	/**
	 * Gets the panelIndex
	 * @returns {Number}
	 */
	getPanelIndex: function() {
		if (typeof(this._panelIndex) == "undefined")
			this.setPanelIndex(0);

		return this._panelIndex;
	},
	/**
	 * Sets the panelIndex
	 * @param {Number} panelIndex The panelIndex
	 */
	setPanelIndex: function(panelIndex) {
		this._panelIndex = panelIndex;
		return this;
	},
	/**
	 * Gets the cardAnimation
	 * @returns {Object}
	 */
	getCardAnimation: function() {
		if (typeof(this._cardAnimation) == "undefined")
			this.setCardAnimation(null);

		return this._cardAnimation;
	},
	/**
	 * Sets the cardAnimation
	 * @param {Object} cardAnimation The cardAnimation
	 */
	setCardAnimation: function(cardAnimation) {
		this._cardAnimation = cardAnimation;
		return this;
	},
	/**
	 * Gets the panelAnimation
	 * @returns {Object}
	 */
	getPanelAnimation: function() {
		if (typeof(this._panelAnimation) == "undefined")
			this.setPanelAnimation(null);

		return this._panelAnimation;
	},
	/**
	 * Sets the panelAnimation
	 * @param {Object} panelAnimation The panelAnimation
	 */
	setPanelAnimation: function(panelAnimation) {
		this._panelAnimation = panelAnimation;
		return this;
	},
	run: function() {
		var me = this;

		if (this.getPanelIndex() != 0) {
			this.getCards()[0].setStyle({
				left: 0
			});
			this.getCards()[1].setStyle({
				left: "678px"
			});
		}
		this.getCards()[2].setStyle({
			left: "1565px"
		});
		this.getPanel().setStyle({
			left: (this.getPanelIndex() * 2321) + "px"
		});

		var transition = function(pos) {
			if (me.getPanelIndex() == 1)
				console.log(me.getPanel().measure("left"));

			return pos;
		};

		this.setCardAnimation(new Effect.Parallel([
			new Effect.Morph(this.getCards()[0], {
				style: {
					left: "-470px"
				},
				sync: true,
				transition: transition
			}),
			new Effect.Morph(this.getCards()[1], {
				style: {
					left: "538px"
				},
				sync: true,
				transition: transition
			}),
			new Effect.Morph(this.getCards()[2], {
				style: {
					left: "1495px"
				},
				sync: true,
				transition: transition
			}),
			new Effect.Morph(this.getPanel(), {
				style: {
					left: -(2321 - (this.getPanelIndex() * 2321)) + "px"
				},
				sync: true,
				transition: Effect.Transitions.linear
			})
		], {
			duration: 12,
			transition: Effect.Transitions.linear,
			afterFinish: function() {
				me.run();
			}
		}));
	},
	slowDown: function() {
	},
	speedUp: function() {
	}
});
