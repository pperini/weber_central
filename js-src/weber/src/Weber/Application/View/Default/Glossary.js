/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Paging
 * @requiresPackage Weber.Glossary
 */
anyLib.registerNamespace("Weber.Application.View.Default");

Weber.Application.View.Default.Glossary = Class.create(anyLib.Application.View, {
	paging: null,
	glossaryLetters: [],
	glossaryContainers: [],

	render: function() {
		this.paging = new anyLib.Paging();

		var me = this;

		this.glossaryLetters.each(function(glossaryLetter, index) {
			var letter = glossaryLetter.innerHTML;

			var page = new Weber.Glossary.Page();

			page.setLetter(glossaryLetter);
			page.setElement(me.glossaryContainers[index]);

			me.paging.addPage(letter, page);

			glossaryLetter.on("click", function() {
				me.paging.enterPage(letter);
			});
		});
	}
});
