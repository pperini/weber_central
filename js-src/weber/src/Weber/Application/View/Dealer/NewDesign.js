/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Collection
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Maps
 */
anyLib.registerNamespace("Weber.Application.View.Dealer");

Weber.Application.View.Dealer.NewDesign = Class.create(anyLib.Application.View, {
	columns: [],
	
	render: function() {
		this.columns.each(function(column) {
			var itemContainer = column.down(".dealer-search-legend-category-item");
			var descriptionContainer = column.down(".dealer-search-legend-category-description");
			
			var heightNeeded = descriptionContainer.down("p").measure("height");
			
			descriptionContainer.setStyle({
				height: "0px"
			});
			
			var animation = null;
			
			var cancelAnimation = function() {
				if (animation != null) {
					animation.cancel();
					animation = null;
				}
			};
			
			itemContainer.on("mouseenter", function() {
				cancelAnimation();
				
				animation = new Effect.Morph(descriptionContainer, {
					style: {
						height: heightNeeded + "px"
					},
					duration: .5,
					afterFinish: function() {
						animation = null;
					}
				});
			});
			
			itemContainer.on("mouseleave", function() {
				cancelAnimation();
				
				animation = new Effect.Morph(descriptionContainer, {
					style: {
						height: "0px"
					},
					duration: .5,
					afterFinish: function() {
						animation = null;
					}
				});
			});
		});
	}
});
