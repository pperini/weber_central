/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Forum");

Weber.Application.View.Forum.CreateThread = Class.create(anyLib.Application.View, {
	messageBox: null,
	threadID: 0,
	categoryID: 0,
	threadUrl: null,

	render: function() {
		var template = new Template(
			'<div class="columns-8">' +
				'<h3>Thema erstellen</h3>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="grid-8">' +
				'<div class="columns-8 lft form-item item-text required">' +
					'<label for="title">Titel *</label>' +
					'<input type="text" id="title" name="title" class="double" placeholder="Titel" value="#{title}">' +
				'</div>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="columns-8 form-item item-textarea required">' +
				'<label for="message">Nachricht *</label>' +
				'<textarea id="message" name="message" cols="52" rows="6" placeholder="Nachricht"></textarea>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="columns-8 submit-area">' +
				'<a class="button-background form-button red rgt send-post-submit" href="javascript:void(0);">' +
					'Thema erstellen' +
					'<span class="button-background left"></span><span class="button-background right"></span>' +
				'</a>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>'
		);

		var me = this;

		var handleChange = true;

		this.messageBox.getLightBox().afterClose.add(function() {
			// TODO: Auf den Thread weiterleiten
			Weber.Utilities.refreshWindow();
		});

		me.messageBox.getLightBox().afterChange.add(function() {
			if (handleChange == false)
				return;

			handleChange = false;

			var container = me.messageBox.getLightBox().getLayout().getContainer();

			var threadUrl = $('threadurl').innerHTML;

			container.down(".send-post-submit").on("click", function() {
				Weber.Utilities.getForumService().post(
					{
						ThreadId: 0,
						CategoryId: me.categoryID,
						Title: container.down("#title").value,
						Text: container.down("#message").value,
						UserToken: Weber.Utilities.getCommunity().getToken(),
						Url: threadUrl
					},
					function() {
						me.messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Senden erfolgreich!</h3>' +
							'</div>'
						);
					},
					function() {
						me.messageBox.display(
							'<div class="light-box-message">' +
								'<h3>Es ist ein Fehler aufgetreten</h3>' +
								'<p>Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.</p>' +
							'</div>'
						);
					}
				);
			});
		});

		this.messageBox.display(template.evaluate({
			title: this.title
		}));
	}
});
