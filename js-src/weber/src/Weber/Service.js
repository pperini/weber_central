/**
 * @package Weber.Service
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Ajax
 */
anyLib.registerNamespace("Weber");

Weber.Service = Class.create({
	_doRequest: function(api, parameters, successCallback, errorCallback) {
		var options = {
			method: api.method,
			onSuccess: function(transport) {
				if (transport.responseJSON.Status != 0)
					return errorCallback(transport);

				successCallback(transport);
			},
			onFailure: errorCallback
		};

		if (api.method != "get") {
			options["postBody"] = (typeof(parameters) == "object") ? Object.toJSON(parameters) : parameters;
		} else {
			options["parameters"] = parameters;
		}

		var url = api.url;

		if (url.indexOf("#") != -1 && typeof(parameters) == "object")
			url = (new Template(url)).evaluate(parameters);

		new Weber.Ajax.Request(url, options);
	}
});
