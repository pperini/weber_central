/**
 * @package Weber.Community
 * @requiresPackage anyLib
 * @requiresPackage anyLib.CookieJar
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber");

Weber.Community = Class.create({
	_token: null,

	initialize: function() {
	},

	/**
	 * Gets the token
	 * @returns {String}
	 */
	getToken: function() {
		if (this._token == null && this._getCookieJar().has("MOAWC"))
			this.setToken(this._getCookieJar().get("MOAWC"));

		return this._token;
	},
	/**
	 * Sets the token
	 * @param {String} token The token
	 */
	setToken: function(token) {
		this._token = token;

		this._getCookieJar().set("MOAWC", token, 1);

		return this;
	},
	/**
	 * Gets the cookieJar
	 * @returns {anyLib.CookieJar}
	 */
	_getCookieJar: function() {
		if (typeof(this._cookieJar) == "undefined")
			this._setCookieJar(new anyLib.CookieJar());

		return this._cookieJar;
	},
	/**
	 * Sets the cookieJar
	 * @param {anyLib.CookieJar} cookieJar The cookieJar
	 */
	_setCookieJar: function(cookieJar) {
		this._cookieJar = cookieJar;

		return this;
	},

	hasToken: function() {
		return (this.getToken() != null && this.getToken() != "");
	}
});