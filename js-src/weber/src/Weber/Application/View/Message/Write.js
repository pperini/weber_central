/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Message");

Weber.Application.View.Message.Write = Class.create(anyLib.Application.View, {
	subject: null,
	messageBox: null,
	recipientID: null,
	recipientName: null,

	render: function() {
		if (this.recipientID != null)
			return this.renderMessageForm(
				'<input type="hidden" name="recipient" id="recipient" value="' + this.recipientID + '">' +
				'<div class="columns-8 form-item item-text required">' +
					'<label for="recipientName">Empfänger</label>' +
					'<input type="text" disabled="disabled" id="recipientName" class="double" name="recipientName" value="' + this.recipientName + '">' +
				'</div>'
			);

		var template = new Template('<div class="columns-8 space">' +
			'<div class="form-item item-select">' +
				'<label for="">Empfänger</label>' +
				'<div class="select-background select double">' +
					'<div class="text">Bitte wählen Sie</div>' +
					'<div class="option-container" style="display:none;">' +
						'<div class="option-list">' +
							'<div class="no-option">Bitte wählen Sie</div>' +
							'#{divOptionList}' +
						'</div>' +
						'<select name="recipient" id="recipient">' +
							'#{selectOptionList}' +
						'</select>' +
						'<div class="option-scrubber">' +
							'<div class="option-scrubber-handle" style="top:0;"></div>' +
						'</div>' +
					'</div>' +
					'<div class="select-background left"></div>' +
					'<div class="select-background right"></div>' +
				'</div>' +
			'</div>' +
			'<div class="clear"></div>' +
		'</div>');

		this.messageBox.display('<div class="loading-overlay" style="width:221px;height:80px;"><br><br></div>');

		var me = this;

		Weber.Utilities.getUserService().friends(
			{
				identifier: Weber.Utilities.getCommunity().getToken()
			},
			function(transport) {
				var divOptionList = '';
				var selectOptionList = '';

				transport.responseJSON.Items.each(function(userData) {
					var user = new Weber.Application.Model.User();
					user.readObject(userData);

					divOptionList += '<div class="option">' + user.getUsername() +'</div>';
					selectOptionList += '<option value="' + user.getUserID() + '">' + user.getUsername() + '</option>';
				});

				me.messageBox.getLightBox().afterChange.add(function() {
					var element = me.messageBox.getLightBox().getLayout().getContainer().down(".select");

					if (!element)
						return;

					var selectElement = new Weber.Form.Element.Select();
					selectElement.setElement(element);
				});

				me.renderMessageForm(template.evaluate({
					divOptionList: divOptionList,
					selectOptionList: selectOptionList
				}));
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
	},

	renderMessageForm: function(recipientTemplate) {
		var template = new Template(
			'<div class="columns-8">' +
				'<h3>Nachricht schreiben</h3>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="grid-8">' +
				'<div class="columns-8 lft form-item item-text required">' +
					'<label for="subject">Betreff</label>' +
					'<input type="text" id="subject" name="subject" class="double" placeholder="Betreff" value="#{subject}">' +
				'</div>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>' +
			'#{recipientTemplate}' +
			'<div class="columns-8 form-item item-textarea required">' +
				'<label for="message">Nachricht *</label>' +
				'<textarea id="message" name="message" cols="52" rows="6" placeholder="Nachricht"></textarea>' +
			'</div>' +
			'<div class="clear"></div>' +
			'<div class="columns-8 submit-area">' +
				'<a class="button-background form-button red rgt send-message-submit" href="javascript:void(0);">' +
					'Nachricht senden' +
					'<span class="button-background left"></span><span class="button-background right"></span>' +
				'</a>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>'
		);

		var me = this;

		var handleChange = true;

		me.messageBox.getLightBox().afterChange.add(function() {
			if (handleChange == false)
				return;

			handleChange = false;

			var container = me.messageBox.getLightBox().getLayout().getContainer();

			container.down(".send-message-submit").on("click", function() {
				Weber.Utilities.getMessageService().write(
					{
						Token: Weber.Utilities.getCommunity().getToken(),
						ReciverId: container.down("#recipient").value,
						Subject: container.down("#subject").value,
						Message: container.down("#message").value
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
			subject: this.subject,
			recipientTemplate: recipientTemplate
		}));
	}
});
