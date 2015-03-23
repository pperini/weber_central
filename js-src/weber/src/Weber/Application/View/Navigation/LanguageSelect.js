/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Navigation");

Weber.Application.View.Navigation.LanguageSelect = Class.create(anyLib.Application.View, {
	languageSelectLink: null,

	render: function() {
		var open = false;
		var animation = null;

		var cancelAnimation = function() {
			if (animation != null)
				animation.cancel();

			animation = null;
		};

		var me = this;

		var toggle = function() {
			cancelAnimation();

			var height = "0px";

			if (open === false) {
				height = "460px";
			}

			open = !open;

			animation = new Effect.Parallel([
				new Effect.Morph(me.mainContainer, {
					style: {
						marginTop: height
					}
				}),
				new Effect.Morph(me.languageSelectContainer, {
					style: {
						height: height
					}
				})
			], {
				duration: 0.6
			});
		};

		this.languageSelectLink.on("click", toggle);

		this.languageSelectContainerCloseLink.on("click", function() {
			if (open === false)
				return;

			toggle();
		});
	}
});