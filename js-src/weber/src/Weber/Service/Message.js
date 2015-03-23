/**
 * @package Weber.Service
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Service");

Weber.Service.Message = Class.create(Weber.Service, {
	read: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.message.api.read, parameters, successCallback, errorCallback)
	},
	write: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.message.api.write, parameters, successCallback, errorCallback)
	},
	remove: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.message.api.remove, parameters, successCallback, errorCallback)
	}
});
