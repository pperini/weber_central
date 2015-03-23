/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Paging
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.Paging = Class.create(anyLib.Application.View, {
	pageContainerList: [],
	pagingLinkContainer: null,

	render: function() {
		if (this.pagingLinkContainer == null)
			return;

		var paging = new anyLib.Paging();

		var me = this;

		var pageLinks = this.pagingLinkContainer.select(".pages .page");

		pageLinks.each(function(trigger, index) {
			var pageIndex = index + 1;

			var page = new anyLib.Paging.Page();

			page.setElement(me.pageContainerList[index]);

			page.beforeExit.add(function() {
				trigger.removeClassName("active");
			});

			page.beforeEnter.add(function() {
				trigger.addClassName("active");
			});

			paging.addPage(pageIndex.toString(), page);

			trigger.on("click", function() {
				paging.enterPage(pageIndex.toString());
			});
		});

		paging.enterPage("1");

		var changePage = function() {
			Effect.ScrollTo(Weber.mainContainer, {
				duration: 0.8
			});
		};

		paging.beforeEnterNextPage.add(changePage);
		paging.beforeEnterPreviousPage.add(changePage);

		this.pagingLinkContainer.down(".next").on("click", function() {
			paging.next();
		});

		this.pagingLinkContainer.down(".prev").on("click", function() {
			paging.prev();
		});
	}
});
