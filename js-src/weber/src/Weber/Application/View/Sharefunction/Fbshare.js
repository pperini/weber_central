/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Sharefunction");

Weber.Application.View.Sharefunction.Fbshare = Class.create(anyLib.Application.View, {
	name: null,
	caption: null,
	picture: null,
	shareLink: null,
	facebookId: null,
	linkElements: [],
	description: null,

	render: function() {
		if (this.facebookId == null || this.shareLink == null) {
			return;
		}

		var link = "http://www.facebook.com/dialog/feed?app_id=" + this.facebookId + "&link=" + encodeURIComponent(this.shareLink) + "&redirect_uri=" + encodeURIComponent(this.shareLink);

		if (this.picture != null) {
			link += "&picture=" + this.picture;
		}

		if (this.name != null) {
			link += "&name=" + this.name;
		}

		if (this.caption != null) {
			link += "&caption=" + this.caption;
		}

		if (this.description != null) {
			link += "&description=" + this.description;
		}

		this.linkElements.each(function(linkElement) {
			linkElement.on("click", function() {
				window.location.href = link;
			})
		})
	}
});
