/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Counter
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Message = Class.create(anyLib.Application.Controller, {
	inboxAction: function() {
		this.getView().assign("messageItems", $$(".community-message-item"));
		this.getView().assign("messageCheckboxes", $$(".community-message-item .checkbox"));
		this.getView().assign("actionSelectElement", $$(".select.message-action-select").first());
		this.getView().assign("markAllCheckbox", $$(".item-checkbox .checkbox.mark-all-checkbox").first());
	},
	outboxAction: function() {
		this.getView().assign("messageItems", $$(".community-message-item"));
		this.getView().assign("messageCheckboxes", $$(".community-message-item .checkbox"));
		this.getView().assign("actionSelectElement", $$(".select.message-action-select").first());
		this.getView().assign("markAllCheckbox", $$(".item-checkbox .checkbox.mark-all-checkbox").first());
	},
	writeAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());

		var messageOptions = this.getRequest().getParameters().get("messageOptions");

		if (messageOptions != null) {
			if (messageOptions.subject != null)
				this.getView().assign("subject", "AW: " + messageOptions.subject);

			this.getView().assign("recipientID", messageOptions.recipientID);
			this.getView().assign("recipientName", messageOptions.recipientName);
		}
	},
	deleteAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("messageID", this.getRequest().getParameters().get("messageID"));

		Weber.Utilities.getMessageService().remove(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				id: this.getRequest().getParameters().get("messageID")
			},
			Prototype.emptyFunction,
			Prototype.emptyFunction
		)
	},
	readAction: function() {
		this.getView().assign("messageID", this.getRequest().getParameters().get("messageID"));

		Weber.Utilities.getMessageService().read(
			{
				token: Weber.Utilities.getCommunity().getToken(),
				id: this.getRequest().getParameters().get("messageID")
			},
			Prototype.emptyFunction,
			Prototype.emptyFunction
		)
	},
	batchDeleteAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("messageIDs", this.getRequest().getParameters().get("messageIDs"));
	}
});
