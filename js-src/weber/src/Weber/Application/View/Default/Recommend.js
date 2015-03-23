/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.MessageBox
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.Recommend = Class.create(anyLib.Application.View, {
	ajaxTarget: null,
	linkElements: [],

	render: function() {
		if (this.ajaxTarget == null || !this.linkElements)
			return;

		var messageBox = new Weber.MessageBox();

		var content = '<form onsubmit="return false;" class="grid-8 content-grid">' +
			'<div class="columns-8">' +
				'<div class="form-info">' + t("required_field_notice") + '</div>' +
			'</div>' +
			'<input type="hidden" name="page" value="#{page}">' +
			'<div class="columns-8 form-item item-text required">' +
				'<label for="email">' + t("recommend_your_email") + ' *</label>' +
				'<input type="text" id="email" class="double" name="email" placeholder="' + t("recommend_your_email") + '">' +
			'</div>' +
			'<div class="columns-8 form-item item-text required">' +
				'<label for="recipient-email">' + t("recommend_recipient_email") + ' *</label>' +
				'<input type="text" id="recipient-email" class="double" name="recipient-email" placeholder="' + t("recommend_recipient_email") + '">' +
			'</div>' +
			'<div class="columns-8 form-item item-textarea space">' +
				'<label for="message">' + t("recommend_message") + '</label>' +
				'<textarea id="message" name="message" cols="52" rows="6" placeholder="' + t("recommend_message") + '"></textarea>' +
			'</div>' +
			'<div class="columns-8 submit-area">' +
				'<a class="button-background form-button red rgt submit-button" href="javascript:void(0);">' +
					t("recommend_send") +
					'<span class="button-background left"></span>' +
					'<span class="button-background right"></span>' +
				'</a>' +
				'<div class="clear"></div>' +
			'</div>' +
			'<div class="clear"></div>' +
		'</form>' +
		'<div class="clear"></div>';

		this.linkElements.each(function(linkElement) {
			linkElement.on("click", function(event) {
				Event.stop(event);

				messageBox.display(content);
			});
		});

		var me = this;

		var observing = false;

		messageBox.getLightBox().afterChange.add(function() {
			if (observing === true)
				return;

			observing = true;

			var submitButton = messageBox.getLightBox().getLayout()._getContent().down("a.submit-button");

			var emailField = messageBox.getLightBox().getLayout()._getContent().down("#email");
			var messageField = messageBox.getLightBox().getLayout()._getContent().down("#message");
			var recipientEmailField = messageBox.getLightBox().getLayout()._getContent().down("#recipient-email");

			submitButton.on("click", function() {
				var callback = function() {
					messageBox.getLightBox().close();

					observing = false;
				};

				var hasErrors = false;

				if (emailField.value == "") {
					emailField.addClassName("error");
					hasErrors = true;
				} else {
					emailField.removeClassName("error");
				}

				if (recipientEmailField.value == "") {
					recipientEmailField.addClassName("error");
					hasErrors = true;
				} else {
					recipientEmailField.removeClassName("error");
				}

				if (hasErrors)
					return;

				new Ajax.Request(me.ajaxTarget, {
					parameters: {
						email: emailField.value,
						message: messageField.value,
						page: window.location.href.toString(),
						recipientEmail: recipientEmailField.value
					},
					onSuccess: callback,
					onFailure: callback
				});
			});
		});
	}
});
