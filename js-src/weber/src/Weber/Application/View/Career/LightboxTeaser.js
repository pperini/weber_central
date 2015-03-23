/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Career");

Weber.Application.View.Career.LightboxTeaser = Class.create(anyLib.Application.View, {
	messageBox: null,
	lightboxTeasers: null,

	render: function() {
		var me = this;

		me.lightboxTeasers.each(function(lightboxTeaser) {
			lightboxTeaser.on("click", function(e) {
				e.stop();
				var contentHref = lightboxTeaser.href;
				var content = null;
				var template = new Template('<div class="lightbox-teaser-content grid-9"><h3>#{header}</h3>#{teaser}<div class="clear"></div><div class="text">#{text}</div></div>');
				var callback = function(object) {
					content = me.parseAjaxText(object.responseText);
					if (content != null) {
						me.messageBox.display(template.evaluate(content));

						me.messageBox.getLightBox().afterChange.add(function(){
							me.checkHeight(me.messageBox.getLightBox())
						});

						me.messageBox.getLightBox().afterClose.add(function(){
							me.resetCheckHeight(me.messageBox.getLightBox())
						});
					}
				};


				new Ajax.Request(contentHref, {
					method: "get",
					onSuccess: callback,
					onFailure: function() {
						return true;
					}

				});
			});
		});
	},

	parseAjaxText: function(ajaxreponsetext) {
		var start = ajaxreponsetext.indexOf('<body>') + 6;
		var end = ajaxreponsetext.indexOf("</body>");
		var ajaxresponse = ajaxreponsetext.substring(start, end);
		var element = new Element('body').update(ajaxresponse);

		return ajaxcontent = {
			header: element.down('.intro-heading').down('h1').innerHTML,
			teaser: element.down('#dwcontent-intro').innerHTML,
			text: element.down('#dwcontent-text').innerHTML
		};
	},

	checkHeight: function(lightbox) {
		var lightBoxContainer = lightbox.getLayout().getContainer();
		if (window.innerHeight <= lightBoxContainer.getHeight() + 200) {
			lightBoxContainer.setStyle({
				position: 'absolute'
			});
			window.scrollTo(0,0);
		}
	},

	resetCheckHeight: function(lightbox) {
		var lightBoxContainer = lightbox.getLayout().getContainer();
		if (window.innerHeight <= lightBoxContainer.getHeight() + 200) {
			lightBoxContainer.setStyle({
				position: 'fixed'
			});
		}

	}

});
