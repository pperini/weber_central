/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Sharefunction = Class.create(anyLib.Application.Controller, {
	defaultAction: function() {
	},

	printAction: function() {
		this.getView().assign("linkElements", this.getRequest().getParameters().get("linkElements"));

		if (this.getRequest().getParameters().hasKey("activeItem")) {
			this.getView().assign("activeItem", this.getRequest().getParameters().get("activeItem"));
		}

		if (this.getRequest().getParameters().hasKey("isUrlItem")) {
			this.getView().assign("isUrlItem", this.getRequest().getParameters().get("isUrlItem"));
		}
	},

	recommendAction: function() {
		this.getView().assign("linkElements", this.getRequest().getParameters().get("linkElements"));
		this.getView().assign("ajaxTarget", this.getRequest().getParameters().get("ajaxTarget").first().innerHTML);
	},

	fbshareAction: function() {
		this.getView().assign("linkElements", this.getRequest().getParameters().get("linkElements"));

		this.getView().assign("facebookId", this.getRequest().getParameters().get("facebookId"));

		if (this.getRequest().getParameters().hasKey("shareLink")) {
			this.getView().assign("shareLink", this.getRequest().getParameters().get("shareLink"));
		} else {
			this.getView().assign("shareLink", window.location.href.toString());
		}

		if (this.getRequest().getParameters().hasKey("name")) {
			this.getView().assign("name", this.getRequest().getParameters().get("name"));
		}

		if (this.getRequest().getParameters().hasKey("caption")) {
			this.getView().assign("caption", this.getRequest().getParameters().get("caption"));
		}

		if (this.getRequest().getParameters().hasKey("picture")) {
			this.getView().assign("picture", this.getRequest().getParameters().get("picture"));
		}

		if (this.getRequest().getParameters().hasKey("description")) {
			this.getView().assign("description", this.getRequest().getParameters().get("description"));
		}
	}
});
