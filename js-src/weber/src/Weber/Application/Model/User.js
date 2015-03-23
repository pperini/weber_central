/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Model");

Weber.Application.Model.User = Class.create(Weber.Application.Model, {
	initialize: function() {
	},
	parseForm: function(form) {
		return this.readObject(form.serialize(true));
	},
	readObject: function(dataObject) {
		var me = this;

		Object.keys(dataObject).each(function(key) {
			if (typeof(me["set" + key]) != "function")
				return;

			me["set" + key](dataObject[key]);
		});

		return this;
	},
	/**
	 * Gets the username
	 * @returns {String}
	 */
	getUsername: function() {
		if (typeof(this._username) == "undefined")
			this.setUsername(null);

		return this._username;
	},
	/**
	 * Sets the username
	 * @param {String} username The username
	 */
	setUsername: function(username) {
		this._username = username;

		return this;
	},
	/**
	 * Gets the name
	 * @returns {String}
	 */
	getName: function() {
		if (typeof(this._name) == "undefined")
			this.setName(null);

		return this._name;
	},
	/**
	 * Sets the name
	 * @param {String} name The name
	 */
	setName: function(name) {
		this._name = name;

		return this;
	},
	/**
	 * Gets the city
	 * @returns {String}
	 */
	getCity: function() {
		if (typeof(this._city) == "undefined")
			this.setCity(null);

		return this._city;
	},
	/**
	 * Sets the city
	 * @param {String} city The city
	 */
	setCity: function(city) {
		this._city = city;

		return this;
	},
	/**
	 * Gets the gender
	 * @returns {Object}
	 */
	getGender: function() {
		if (typeof(this._gender) == "undefined")
			this.setGender(null);

		return this._gender;
	},
	/**
	 * Sets the gender
	 * @param {Object} gender The gender
	 */
	setGender: function(gender) {
		this._gender = gender;

		return this;
	},
	/**
	 * Gets the grillID
	 * @returns {Number}
	 */
	getGrillID: function() {
		if (typeof(this._grillID) == "undefined")
			this.setGrillID(null);

		return this._grillID;
	},
	/**
	 * Sets the grillID
	 * @param {Number} grillID The grillID
	 */
	setGrillID: function(grillID) {
		this._grillID = grillID;

		return this;
	},
	/**
	 * Gets the grillName
	 * @returns {String}
	 */
	getGrillName: function() {
		if (typeof(this._grillName) == "undefined")
			this.setGrillName(null);

		return this._grillName;
	},
	/**
	 * Sets the grillName
	 * @param {String} grillName The grillName
	 */
	setGrillName: function(grillName) {
		this._grillName = grillName;

		return this;
	},
	/**
	 * Gets the favoriteRecipeTitle
	 * @returns {String}
	 */
	getFavoriteRecipeTitle: function() {
		if (typeof(this._favoriteRecipeTitle) == "undefined")
			this.setFavoriteRecipeTitle(null);

		return this._favoriteRecipeTitle;
	},
	/**
	 * Sets the favoriteRecipeTitle
	 * @param {String} favoriteRecipeTitle The favoriteRecipeTitle
	 */
	setFavoriteRecipeTitle: function(favoriteRecipeTitle) {
		this._favoriteRecipeTitle = favoriteRecipeTitle;

		return this;
	},
	/**
	 * Gets the slogan
	 * @returns {String}
	 */
	getSlogan: function() {
		if (typeof(this._slogan) == "undefined")
			this.setSlogan(null);

		return this._slogan;
	},
	/**
	 * Sets the slogan
	 * @param {String} slogan The slogan
	 */
	setSlogan: function(slogan) {
		this._slogan = slogan;

		return this;
	},
	/**
	 * Gets the registered
	 * @returns {Date}
	 */
	getRegistered: function() {
		if (typeof(this._registered) == "undefined")
			this.setRegistered(null);

		return this._registered;
	},
	/**
	 * Sets the registered
	 * @param {Date} registered The registered
	 */
	setRegistered: function(registered) {
		if ((registered instanceof Date) === false)
			registered = new Date(registered);

		this._registered = registered;

		return this;
	},
	/**
	 * Gets the surname
	 * @returns {String}
	 */
	getSurname: function() {
		if (typeof(this._surname) == "undefined")
			this.setSurname(null);

		return this._surname;
	},
	/**
	 * Sets the surname
	 * @param {String} surname The surname
	 */
	setSurname: function(surname) {
		this._surname = surname;

		return this;
	},
	/**
	 * Gets the userID
	 * @returns {Number}
	 */
	getUserID: function() {
		if (typeof(this._userID) == "undefined")
			this.setUserID(null);

		return this._userID;
	},
	/**
	 * Sets the userID
	 * @param {Number} userID The userID
	 */
	setUserID: function(userID) {
		this._userID = userID;

		return this;
	}
});
