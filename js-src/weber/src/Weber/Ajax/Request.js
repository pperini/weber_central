/**
 * @package Weber.Ajax
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Ajax");

Weber.Ajax.Request = Class.create(Ajax.Request, {
	request: function(url) {
		this.url = url;
		this.method = this.options.method;
		var params = Object.isString(this.options.parameters) ? this.options.parameters : Object.toQueryString(this.options.parameters);

		if (params && this.method === 'get') {
			this.url += (this.url.include('?') ? '&' : '?') + params;
		}

		this.parameters = params.toQueryParams();

		try {
			var response = new Ajax.Response(this);
			if (this.options.onCreate) this.options.onCreate(response);
			Ajax.Responders.dispatch('onCreate', this, response);

			this.transport.open(this.method.toUpperCase(), this.url, this.options.asynchronous);

			if (this.options.asynchronous) this.respondToReadyState.bind(this).defer(1);

			this.transport.onreadystatechange = this.onStateChange.bind(this);

			if (this.method != "get") {
				var realMethod = this.method;
				this.method = "post";

				this.setRequestHeaders();

				this.method = realMethod;
			} else {
				this.setRequestHeaders();
			}

			this.body = this.method != 'get' ? (this.options.postBody || params) : null;
			this.transport.send(this.body);

			/* Force Firefox to handle ready state 4 for synchronous requests */
			if (!this.options.asynchronous && this.transport.overrideMimeType)
				this.onStateChange();

		} catch (e) {
			this.dispatchException(e);
		}
	},

	setRequestHeaders: function($super) {
		this.options.contentType = "application/json";

		if (typeof(this.options["requestHeaders"]) != "object")
			this.options.requestHeaders = {};

		this.options.requestHeaders["Accept"] = "application/json, text/javascript, */*; q=0.01";

		$super();
	}
});
