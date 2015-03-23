/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application");

Weber.Application.Model = Class.create({
	initialize: function(data) {
		if (data)
			this.fromData(data);
	},
	fromData: function(data) {
		var me = this;

		Object.keys(data).each(function(key) {
			var setter = "set" + key.substr(0, 1).toUpperCase() + key.substr(1);

			if (typeof(me[setter]) == "function")
				me[setter](data[key]);
		});
	},
	getData: function() {
		var data = {};

		var me = this;

		Object.keys(this).each(function(key) {
			if (typeof(key) == "undefined")
				return;

			var getter = "get" + key.substr(1, 1).toUpperCase() + key.substr(2);

			if (typeof(me[getter]) != "function")
				return;

			data[key.substr(1)] = me[getter]();
		});

		return data;
	}
});
