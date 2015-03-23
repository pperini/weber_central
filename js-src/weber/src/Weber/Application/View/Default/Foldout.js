/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.Foldout = Class.create(anyLib.Application.View, {
	foldoutItems: [],

	currentItem: null,

	activeItem: null,

	render: function() {
		var me = this;

		this.foldoutItems.each(function(foldoutItem) {
			if (foldoutItem.hasClassName("ignore-trigger") === true)
				return;

			var foldoutItemContent = foldoutItem.down(".content");


			if (foldoutItem === me.activeItem) {
				foldoutItem.addClassName("opened");
				foldoutItemContent.show();

				me.currentItem = foldoutItem;
			}

			foldoutItem.down(".heading").on("click", function(event) {
				var open = foldoutItem.hasClassName("opened");
				var closeable = foldoutItem.hasClassName('closeable');
				var hash = foldoutItem.id;

				if (me.currentItem != null) {
					me.currentItem.removeClassName("opened");
					me.currentItem.down(".content").hide();

					me.currentItem = null;
				}

				if (open === true && foldoutItem.hasClassName('automate-open')) {
					foldoutItem.removeClassName("opened");
					foldoutItem.removeClassName('automate-open');

					foldoutItem.down(".content").hide();

					me.currentItem = null;
				}

				if (open === false) {
					foldoutItem.addClassName("opened");
					foldoutItemContent.show();

					if (hash != null && hash != "") {
						document.location.hash = hash;
					}

					me.currentItem = foldoutItem;
				}

				if (this.hasClassName('change-title')) {
					me.changeTitle(this, open);
				}

				if (closeable === true) {
					me.currentItem = foldoutItem;

					me.currentItem.removeClassName("opened");
					me.currentItem.removeClassName("closeable");
					me.currentItem.down(".content").hide();

					me.currentItem = null;
				}

				event.preventDefault();
			});
		});
	},

	changeTitle: function(header, open) {
		var textOpen = header.readAttribute('data-open');
		var textClose = header.readAttribute('data-close');
		var textDestination = header.down('.open-close');
		textDestination.update(textClose);

		if (open === true) {
			textDestination.update(textOpen);
		}
		if (open === false) {
			textDestination.update(textClose);
		}
	},
});
