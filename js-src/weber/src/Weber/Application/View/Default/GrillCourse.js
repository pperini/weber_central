/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Paging
 * @requiresPackage Weber.Glossary
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.GrillCourse = Class.create(anyLib.Application.View, {
	months: [],
	triggers: [],
	paging: null,
	currentMonth: 0,

	render: function() {
		this.paging = new anyLib.Paging();

		var me = this;

		this.triggers.each(function(trigger, index) {
			trigger.monthIndex = index.toString();

			var page = new Weber.Glossary.Page();

			page.setLetter(trigger);
			page.setElement(me.months[index]);

			me.paging.addPage(trigger.monthIndex, page);

			trigger.on("click", function() {
				me.paging.enterPage(trigger.monthIndex);
			});
		});

		this.paging.enterPage(this.currentMonth);
	}
});
