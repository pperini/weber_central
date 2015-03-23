/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Sharefunction");

Weber.Application.View.Sharefunction.Print = Class.create(anyLib.Application.View, {
	isUrlItem: false,
	activeItem: null,
	linkElements: null,

	render: function() {
		var me = this;

		this.linkElements.each(function(linkElement) {
			linkElement.on("click", function() {
				if (me.activeItem == null || me.isUrlItem) {
					me.activeItem = $(window.location.hash.substr(1));
				}
				if (me.activeItem != null){
					if (me.activeItem instanceof Array) {
						me.activeItem = me.activeItem.first();
					}
					var printWindow = window.open(window.location.href, "Print", "width=1024,height=800,menubar=no,status=no,toolbar=no,titlebar=no");
					new PeriodicalExecuter(function(pe) {
						var success = false;

						try {
							setTimeout(function() {
								var success = me._manipulatePrintDom(printWindow, me.activeItem.outerHTML);

								if (!success)
									return;

								pe.stop();
								printWindow.print();
							}, 170);
						} catch (e) {
						}
					});
				}
			})
		});
	},

	_manipulatePrintDom: function(printWindow, newMarkup) {
		try {
			Element.select(printWindow.document, 'link[media="print"]').first().writeAttribute("media", "all");

			Element.select(printWindow.document, '#content').first().innerHTML = newMarkup;
		} catch (e) {
			return false;
		}

		return true;
	}
});
