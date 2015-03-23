/**
 * @package Weber.Utilities
 * @requiresPackage anyLib
 * @requiresPackage Weber
 * @requiresPackage Weber.Service
 * @requiresPackage Weber.Community
 */
anyLib.registerNamespace("Weber");

Weber.Utilities = {
	getCommunity: function() {
		if (typeof(this._community) == "undefined")
			this._community = new Weber.Community();

		return this._community;
	},
	getUserService: function() {
		if (Weber.service.user.instance == null)
			Weber.service.user.instance = new Weber.Service.User();

		return Weber.service.user.instance;
	},
	getMessageService: function() {
		if (Weber.service.message.instance == null)
			Weber.service.message.instance = new Weber.Service.Message();

		return Weber.service.message.instance;
	},
	getCommunityService: function() {
		if (Weber.service.community.instance == null)
			Weber.service.community.instance = new Weber.Service.Community();

		return Weber.service.community.instance;
	},
	getRecipeService: function() {
		if (Weber.service.recipe.instance == null)
			Weber.service.recipe.instance = new Weber.Service.Recipe();

		return Weber.service.recipe.instance;
	},
	getForumService: function() {
		if (Weber.service.forum.instance == null)
			Weber.service.forum.instance = new Weber.Service.Forum();

		return Weber.service.forum.instance;
	},
	refreshWindow: function() {
		if (typeof(window.location.refresh) == "function")
			return window.location.refresh();

		return window.location.href = (window.location.href);
	},

	/**
	 * @returns Date.now();
	 */
	getDateNow: function() {
		if (!Date.now) {
			Date.now = function() {
				return new Date().valueOf();
			}
		} else {
			return Date.now();
		}
	}
};
