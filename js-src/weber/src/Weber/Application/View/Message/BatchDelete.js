/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Message");

Weber.Application.View.Message.BatchDelete = Class.create(anyLib.Application.View, {
	messageBox: null,
	messageIDs: [],

	render: function() {
		if (this.messageIDs.length == 0)
			return;

		var me = this;

		var counter = new anyLib.Counter();
		counter.setCount(0);
		counter.setLimit(this.messageIDs.length);

		var deleteCallback = function() {
			counter.count();
		};

		this.messageBox.display('<div class="loading-overlay" style="width:221px;height:80px;"><br><br></div>');

		counter.onLimitReached.add(function() {
			me.messageBox.getLightBox().afterClose.add(function() {
				Weber.Utilities.refreshWindow();
			});

			me.messageBox.display('<div class="light-box-message">' + '<h3>Löschen erfolgreich</h3>' + '<p>Es wurde(n) ' + me.messageIDs.length + ' Nachricht(en) erfolgreich gelöscht.</p>' + '</div>');
		});

		var handleChange = true;

		this.messageBox.getLightBox().afterChange.add(function() {
			if (handleChange === false)
				return;

			handleChange = false;

			me.messageIDs.each(function(messageID) {
				Weber.Utilities.getMessageService().remove({
						token: Weber.Utilities.getCommunity().getToken(),
						id: messageID
					},
					deleteCallback,
					deleteCallback
				)
			});
		});
	}
});
