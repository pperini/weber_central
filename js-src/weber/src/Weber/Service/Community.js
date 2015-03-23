/**
 * @package Weber.Service
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Service");

Weber.Service.Community = Class.create(Weber.Service, {
	accept: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.community.api.accept, parameters, successCallback, errorCallback);
	},
	create: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.community.api.create, parameters, successCallback, errorCallback);
	},
	decline: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.community.api.quit, parameters, successCallback, errorCallback);
	},
	ignore: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.community.api.ignore, parameters, successCallback, errorCallback);
	},
	quit: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.community.api.quit, parameters, successCallback, errorCallback);
	}
});
