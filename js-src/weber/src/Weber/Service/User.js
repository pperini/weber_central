/**
 * @package Weber.Service
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Service");

Weber.Service.User = Class.create(Weber.Service, {
	login: function(parameter, successCallback, errorCallback) {
		var onSuccess = function(transport) {
			if (transport.responseJSON.Status == 0) {
				var community = Weber.Utilities.getCommunity();

				community.setToken(transport.responseJSON.Token);

				successCallback(transport);

				return;
			}

			errorCallback(transport);
		};

		this._doRequest(Weber.service.user.api.login, parameter, onSuccess, errorCallback);

		return this;
	},
	updateProfilePicture: function(parameter, successCallback, errorCallback) {
		this._doRequest(Weber.service.user.api.picture, parameter, successCallback, errorCallback);

		return this;
	},
	deleteProfilePicture: function(parameter, successCallback, errorCallback) {
		this.updateProfilePicture(
			Object.extend({
				token: Weber.Utilities.getCommunity().getToken(),
				userPicture: "default.jpg"
			}, parameter),
			successCallback,
			errorCallback
		);

		return this;
	},
	editProfile: function(parameter, successCallback, errorCallback) {
		this._doRequest(Weber.service.user.api.edit, parameter, successCallback, errorCallback);

		return this;
	},
	register: function(parameter, successCallback, errorCallback) {
		this._doRequest(Weber.service.user.api.registration, parameter, successCallback, errorCallback);

		return this;
	},
	changePassword: function(parameter, successCallback, errorCallback) {
		this._doRequest(Weber.service.user.api.changePassword, parameter, successCallback, errorCallback);

		return this;
	},
	friends: function(parameter, successCallback, errorCallback) {
		this._doRequest(Weber.service.user.api.friends, parameter, successCallback, errorCallback);

		return this;
	}
});
