/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Home = Class.create(anyLib.Application.Controller, {
	defaultAction: function() {
		this.getView().assign("visual", $("home-visual-viewport"));

		this.getView().assign("teaser", $$(".home-teaser"));
	},

	videoAction: function() {
		this.getView().assign("element", this.getRequest().getParameters().get("element"));
		this.getView().assign("videoUrl", this.getRequest().getParameters().get("videoUrl"));
	}
});
