/**
 * @package Weber.Service
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Service");

Weber.Service.Forum = Class.create(Weber.Service, {
	post: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.forum.api.post, parameters, successCallback, errorCallback)
	}
});
