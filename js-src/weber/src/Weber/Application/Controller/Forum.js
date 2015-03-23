/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.Controller");

Weber.Application.Controller.Forum = Class.create(anyLib.Application.Controller, {
	createPostAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());

		var postOptions = this.getRequest().getParameters().get("postOptions");

		var quote = postOptions.quote;
		var author = postOptions.author;
		var subject = postOptions.subject;

		if (postOptions.isReply == true)
			subject = t("forum-reply-prefix") + subject;

		this.getView().assign("quote", quote);
		this.getView().assign("categoryID", 0);
		this.getView().assign("title", subject);
		this.getView().assign("author", author);
		this.getView().assign("isReply", postOptions.isReply);
		this.getView().assign("threadID", postOptions.threadID);
	},
	createThreadAction: function() {
		this.getView().assign("messageBox", new Weber.MessageBox());

		this.getView().assign("threadID", 0);
		this.getView().assign("categoryID", this.getRequest().getParameters().get("categoryID"));
	}
});
