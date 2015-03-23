/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Message");

Weber.Application.View.Message.Outbox = Class.create(anyLib.Application.View, {
	messageItems: [],
	markAllCheckbox: null,
	messageCheckboxes: [],
	actionSelectElement: null,

	render: function() {
		this.messageItems.each(function(messageItem) {
			messageItem.down(".subject").on("click", function() {
				messageItem.down(".message").toggle();
			});
		});

		if (!this.actionSelectElement)
			return;

		var me = this;

		if (typeof(this.markAllCheckbox.instance) != "object") {
			this.markAllCheckbox.instance = new Weber.Form.Element.CheckBox();
			this.markAllCheckbox.instance.setElement(this.markAllCheckbox);
		}

		this.messageCheckboxes.each(function(messageCheckbox) {
			if (typeof(messageCheckbox.instance) != "object") {
				messageCheckbox.instance = new Weber.Form.Element.CheckBox();
				messageCheckbox.instance.setElement(messageCheckbox);
			}

			messageCheckbox.instance.onValueChanged.add(function() {
				if (messageCheckbox.instance.getIsChecked() == false)
					me.markAllCheckbox.instance.unCheck();
			});
		});

		this.markAllCheckbox.instance.onValueChanged.add(function() {
			me.messageCheckboxes.each(function(messageCheckbox) {
				if (me.markAllCheckbox.instance.getIsChecked() == false)
					return;

				messageCheckbox.instance.check();
			});
		});

		this.actionSelectElement.instance.onValueChanged.add(function() {
			var messageIds = [];

			me.messageCheckboxes.each(function(messageCheckbox, index) {
				if (messageCheckbox.instance.getIsChecked() == true)
					messageIds.push(messageCheckbox.up(".community-message-item").down(".delete-message .hidden").innerHTML);
			});

			var readRequest = new anyLib.Application.Controller.Request();

			 readRequest.setModule("default");
			 readRequest.setController("message");
			 readRequest.setNamespace(Weber.Application);
			 readRequest.setAction(me.actionSelectElement.instance.getValue());

			 readRequest.getParameters().add("messageIDs", messageIds);

			 Weber.application.dispatch(readRequest);
		});
	}
});
