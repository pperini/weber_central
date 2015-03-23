/**
 * @package Weber.Service
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Service");

Weber.Service.Recipe = Class.create(Weber.Service, {
	create: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.create, parameters, successCallback, errorCallback);
	},
	update: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.update, parameters, successCallback, errorCallback);
	},
	remove: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.remove, parameters, successCallback, errorCallback);
	},
	read: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.read, parameters, successCallback, errorCallback);
	},
	comment: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.comment, parameters, successCallback, errorCallback);
	},
	rate: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.rate, parameters, successCallback, errorCallback);
	},
	like: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.like, parameters, successCallback, errorCallback);
	},
	hate: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.hate, parameters, successCallback, errorCallback);
	},
	setPicture: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.setPicture, parameters, successCallback, errorCallback);
	},
	publish: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.publish, parameters, successCallback, errorCallback);
	},
	isLiked: function(parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.isLiked, parameters, successCallback, errorCallback);
	},
	isFavourite: function (parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.isFavourite, parameters, successCallback, errorCallback);
	},
	getComments: function (parameters, successCallback, errorCallback) {
		this._doRequest(Weber.service.recipe.api.getComments, parameters, successCallback, errorCallback);
	}
});
