/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Form
 * @requiresPackage Weber.Utilities
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.CookingTimeLightbox = Class.create(anyLib.Application.View, {
	showButton: null,
	messageBox: null,
	selectElement: null,
	
	render: function() {
		var instance = this.selectElement.instance;

		if (typeof(this.selectElement.instance) != "object") {
			instance = new Weber.Form.Element.Select();
			instance.setElement(this.selectElement);
		}
		
		var me = this;
		
		var addStyleFix = true;
		var lightBox = this.messageBox.getLightBox();
		
		lightBox.afterOpen.add(function() {
			if (!addStyleFix)
				return;
			
			addStyleFix = false;
			
			lightBox.getLayout().getContainer().setStyle({ position: "absolute" });
			lightBox.getLayout().getContainer().setStyle({ padding: "10px 0" });
		});
		
		this.showButton.on("click", function() {
			me.messageBox.display($("cooking-time-category-" + instance.getValue()).innerHTML);
		});
	}
});