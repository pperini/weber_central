/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Utilities
 * @requiresPackage Weber.Service
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Community = Class.create(anyLib.Application.Controller, {
	initializeAction: function() {
		var me = this;

		var availableActions = [
			"forum-quote",
			"forum-reply",
			"forum-create-thread",

			"ignore-user",
			"write-message",
			"delete-message",
			"quit-friendship",
			"write-message-to",
			"reply-to-message",
			"create-friendship",
			"accept-friendship",
			"decline-friendship",
			"delete-recipe",
			"publish-recipe",
			"un-publish-recipe",
			"remove-favourite-recipe"
		];

		availableActions.each(function(actionName) {
			var actionLinks = $$(".user-action." + actionName);

			if (actionLinks.length == 0)
				return;

			actionLinks.each(function(actionLink) {
				me._callUserAction(actionName, actionLink);
			});
		});
	},

	_callUserAction: function(action, element) {
		var actionRequest = new anyLib.Application.Controller.Request();

		actionRequest.setAction(action);
		actionRequest.setModule("default");
		actionRequest.setController("community");
		actionRequest.setNamespace(Weber.Application);

		actionRequest.getParameters().set("action-link", element);

		element.on("click", function() {
			Weber.application.dispatch(actionRequest);
		});
	},

	_basicFriendshipAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		this.getView().assign("actionLink", actionLink);
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("userID", actionLink.down(".hidden").innerHTML);
	},

	_basicRecipeAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		this.getView().assign("actionLink", actionLink);
		this.getView().assign("messageBox", new Weber.MessageBox());
		this.getView().assign("recipeID", actionLink.down(".hidden").innerHTML);
	},

	_triggerMessageAction: function(messageOptions) {
		var actionRequest = new anyLib.Application.Controller.Request();

		actionRequest.setAction("write");
		actionRequest.setModule("default");
		actionRequest.setController("message");
		actionRequest.setNamespace(Weber.Application);

		actionRequest.setParameters(this.getRequest().getParameters());
		actionRequest.getParameters().set("messageOptions", messageOptions);

		Weber.application.dispatch(actionRequest);
	},

	_triggerForumPostAction: function(postOptions) {
		var actionRequest = new anyLib.Application.Controller.Request();

		actionRequest.setModule("default");
		actionRequest.setController("forum");
		actionRequest.setAction("create-post");
		actionRequest.setNamespace(Weber.Application);

		actionRequest.setParameters(this.getRequest().getParameters());
		actionRequest.getParameters().set("postOptions", postOptions);

		Weber.application.dispatch(actionRequest);
	},

	writeMessageAction: function() {
		this._triggerMessageAction(null);
	},

	writeMessageToAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		this._triggerMessageAction({
			recipientID: actionLink.down(".hidden").innerHTML,
			recipientName: actionLink.up(".info").down(".username").innerHTML
		});
	},

	replyToMessageAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		var messageContainer = actionLink.up(".community-message-item");

		this._triggerMessageAction({
			recipientID: actionLink.down(".hidden").innerHTML,
			subject: messageContainer.down(".subject a").innerHTML,
			recipientName: messageContainer.down(".recipient a").innerHTML
		});
	},

	deleteMessageAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		var deleteRequest = new anyLib.Application.Controller.Request();

		deleteRequest.setAction("delete");
		deleteRequest.setModule("default");
		deleteRequest.setController("message");
		deleteRequest.setNamespace(Weber.Application);

		deleteRequest.getParameters().set("action-link", actionLink);
		deleteRequest.getParameters().set("messageID", actionLink.down(".hidden").innerHTML);

		Weber.application.dispatch(deleteRequest);
	},

	ignoreUserAction: function() {
		this._basicFriendshipAction();
	},

	createFriendshipAction: function() {
		this._basicFriendshipAction();
	},

	acceptFriendshipAction: function() {
		this._basicFriendshipAction();
	},

	declineFriendshipAction: function() {
		this._basicFriendshipAction();
	},

	quitFriendshipAction: function() {
		this._basicFriendshipAction();
	},

	deleteRecipeAction: function() {
		this._basicRecipeAction();
	},
	publishRecipeAction: function() {
		this._basicRecipeAction();
	},
	unPublishRecipeAction: function() {
		this._basicRecipeAction();
	},
	removeFavouriteRecipeAction: function() {
		this._basicRecipeAction();
	},

	userSearchAction: function() {
		this.getView().assign("formElement", $("user-search-form"));
		this.getView().assign("submitButton", $$(".start-user-search").first());
	},

	forumQuoteAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		var isReply = true;
		var container = actionLink.up(".forum-post-list");

		if (container == null) {
			isReply = false;
			container = actionLink.up(".content-grid");
		}

		this._triggerForumPostAction({
			isReply: isReply,
			threadID: actionLink.down(".hidden").innerHTML,
			author: container.down(".forum-post-item .username").innerHTML,
			quote: container.down(".forum-post-item .post-message").innerHTML,
			subject: container.down(".forum-post-item .post-subject").innerHTML
		});
	},
	forumReplyAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		var isReply = true;
		var container = actionLink.up(".forum-post-list");

		if (container == null) {
			isReply = false;
			container = actionLink.up(".content-grid");
		}

		this._triggerForumPostAction({
			isReply: isReply,
			threadID: actionLink.down(".hidden").innerHTML,
			author: container.down(".forum-post-item .username").innerHTML,
			quote: container.down(".forum-post-item .post-message").innerHTML,
			subject: container.down(".forum-post-item .post-subject").innerHTML
		});
	},
	forumCreateThreadAction: function() {
		var actionLink = this.getRequest().getParameters().get("action-link");

		var request = new anyLib.Application.Controller.Request();

		request.setModule("default");
		request.setController("forum");
		request.setAction("create-thread");
		request.setNamespace(Weber.Application);

		request.getParameters().set("isReply", false);
		request.getParameters().set("action-link", actionLink);
		request.getParameters().set("categoryID", actionLink.down(".hidden").innerHTML);

		Weber.application.dispatch(request);
	}
});
