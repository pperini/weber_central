/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Collection
 * @requiresPackage Weber
 * @requiresPackage Weber.MainNavigation
 */
anyLib.registerNamespace("Weber.Application.View.Navigation");

Weber.Application.View.Navigation.MainNavigation = Class.create(anyLib.Application.View, {
	navigationItems: [],
	navigationContainer: null,

	render: function () {
		this._applyActiveStatus();

		this.navigationItems.each(function (element) {
			var dropDownElement = element.down("span.drop-down");

			if (dropDownElement == null) {
				return;
			}

			var dropDown = new Weber.MainNavigation.DropDown();
			dropDown.setElement(dropDownElement);

			var linkElement = element.down("a");

			// MS IE 10
			if (window.navigator.msPointerEnabled) {
				linkElement.originalHref = linkElement.href.toString();
				linkElement.href = "javascript:void(0);";

				dropDown.setDelay(0);

				var msPointerOut = element.on("MSPointerOut", function (event) {
					if (event.pointerType != event.MSPOINTER_TYPE_MOUSE)
						return;

					var targetElement = Event.findElement(event);

					if (targetElement != null && targetElement.hasClassName("main"))
						dropDown.setDelay(0);

					dropDown.exit();
				});

				msPointerOut.stop();

				element.on("MSPointerOver", function (event) {
					if (event.pointerType != event.MSPOINTER_TYPE_MOUSE)
						return;

					msPointerOut.start();

					dropDown.enter();

					dropDown.setDelay(0);
				});

				linkElement.on("MSPointerDown", function (event) {
					if (event.pointerType == event.MSPOINTER_TYPE_MOUSE) {
						window.location.href = linkElement.originalHref;

						return;
					}

					if (!event.isPrimary)
						return;

					msPointerOut.stop();

					if (dropDown.getIsOpened()) {
						if (target.hasClassName("main"))
							window.location.href = linkElement.originalHref;
					} else {
						element.addClassName("active");

						dropDown.enter();
					}
				});

				document.on("MSPointerDown", function (event) {
					if (event.pointerType == event.MSPOINTER_TYPE_MOUSE)
						return;

					if (!event.isPrimary)
						return;

					if (Event.findElement(event).descendantOf(element))
						return;

					dropDown.exit();

					element.removeClassName("active");
				});

				return;
			}

			if (typeof (window.ontouchstart) != "undefined") {
				linkElement.originalHref = linkElement.href.toString();
				linkElement.href = "javascript:void(0);";

				dropDown.setDelay(0);

				element.on("touchstart", function (event) {
					var target = Event.findElement(event);

					if (dropDown.getIsOpened()) {
						if (target.hasClassName("main"))
							window.location.href = linkElement.originalHref;
					} else {
						element.addClassName("active");

						dropDown.enter();
					}
				});

				document.on("touchstart", function (event) {
					if (Event.findElement(event).descendantOf(element))
						return;

					dropDown.exit();

					element.removeClassName("active");
				});

				return;
			}

			dropDown.getElement().on("mouseenter", function () {
				dropDown.setDelay(0.3);
			});

			element.on("mouseenter", function () {
				dropDown.enter();

				dropDown.setDelay(0);
			});

			element.on("mouseleave", function (event) {
				var targetElement = Event.findElement(event);

				if (targetElement != null && targetElement.hasClassName("main"))
					dropDown.setDelay(0);

				dropDown.exit();
			});
		});
	},

	_applyActiveStatus: function () {
		var currentUrl = new anyLib.Url(window.location.href.toString());

		var path = currentUrl.getPath().getToLevel(1).gsub(".aspx", "");

		var foundLinks = $$("ul#main-navigation a.main[href=" + decodeURIComponent(path) + ".aspx]");

		if (foundLinks.length != 1) {
			foundLinks = $$("ul#main-navigation a.main[href=" + path + ".aspx]");
		}

		if (foundLinks.length != 1) {
			foundLinks = $$("ul#main-navigation a.main[href=" + decodeURIComponent(currentUrl.getPath().getFullPath()) + "]");
		}

		if (foundLinks.length != 1) {
			foundLinks = $$("ul#main-navigation a.main[href=" + currentUrl.getPath().getFullPath() + "]");
		}

		if (foundLinks.length != 1) {
			return;
		}

		foundLinks.first().up("li").addClassName("active");
	}
});
