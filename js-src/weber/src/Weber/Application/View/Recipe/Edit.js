/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage anyLib.Collection
 * @requiresPackage Weber
 */
anyLib.registerNamespace("Weber.Application.View.Recipe");

Weber.Application.View.Recipe.Edit = Class.create(anyLib.Application.View, {
	_template: null,
	_idElement: null,
	_uploadFrame: null,
	_requiredFields: [],
	_ingredientIndex: 0,
	_ingredientGroups: [],
	_selectedCategories: null,

	messageBox: null,
	formElement: null,
	addIngredientLink: null,
	ingredientContainer: null,
	savePublishedButton: null,
	saveUnpublishedButton: null,

	render: function() {
		var me = this;

		this._uploadFrame = $("upload-frame");

		this._idElement = this.formElement.down("#ID");

		var requiredFields = $$(".required");

		requiredFields.each(function(element) {
			var field = null;
			var label = null;

			if (element.hasClassName("item-text"))
				field = element.down("input");

			if (element.hasClassName("item-checkbox")) {
				field = element.down("input");

				if (field.id == "TermsOfUse")
					label = "Zustimmung der Nutzungsbedingungen";

				if (field.id == "TermsAndConditions")
					label = "Zustimmung der Datenschutzerklärung";
			}

			if (element.hasClassName("item-textarea"))
				field = element.down("textarea");

			if (element.hasClassName("item-select"))
				field = element.down(".select");

			if (field == null)
				return;

			if (label == null)
				label = element.down("label").innerHTML;

			me._requiredFields.push({
				label: label,
				element: field,
				container: element
			})
		});

		this._selectedCategories = new anyLib.Collection.List();

		$$(".item-checkbox.category-checkbox .checkbox").each(function(checkbox) {
			var value = checkbox.down("input").name.toString().gsub("category_", "");

			if (checkbox.instance.getValue() == true)
				me._selectedCategories.add(value);

			checkbox.instance.onValueChanged.add(function() {
				if (checkbox.instance.getIsChecked() == true && me._selectedCategories.hasValue(value) == false) {
					me._selectedCategories.add(value);
				}

				if (checkbox.instance.getIsChecked() == false && me._selectedCategories.hasValue(value) == true) {
					me._selectedCategories.remove(value);
				}
			});
		});

		this._template = new Template(this.ingredientContainer.innerHTML);

		this.ingredientContainer.innerHTML = "";
		this.ingredientContainer.show();

		if (this._idElement.value == "") {
			for (var i = 0; i < 5; i++) {
				this.addIngredient();
			}
		} else {
			this.formElement.down(".ingredient-data").select(".ingredient-data-item").each(function(ingredientData) {
				me.addIngredient({
					name: ingredientData.down(".name").innerHTML,
					unit: ingredientData.down(".unit").innerHTML,
					amount: ingredientData.down(".amount").innerHTML
				});
			});
		}

		var addListener = this.addIngredientLink.on("click", function() {
			me.addIngredient();

			if (me._ingredientIndex < 42)
				return;

			addListener.stop();

			me.addIngredientLink.remove();
		});

		this.savePublishedButton.on("click", function() {
			if (me.validates() !== true)
				return;

			me.save(true);
		});

		this.saveUnpublishedButton.on("click", function() {
			if (me.validates() !== true)
				return;

			me.save(false);
		});
	},

	addIngredient: function(data) {
		if (typeof(data) != "object") {
			data = {
				unit: 0,
				name: "",
				amount: ""
			};
		}

		data["index"] = this._ingredientIndex;

		this.ingredientContainer.insert({
			bottom: this._template.evaluate(data)
		});

		var group = this.ingredientContainer.down(".ingredient_group_" + this._ingredientIndex);

		var selectElement = group.down(".ingredient_unit_select_" + this._ingredientIndex);

		selectElement.instance = new Weber.Form.Element.Select();
		selectElement.instance.setElement(selectElement);

		selectElement.setStyle({
			zIndex: 99 - this._ingredientIndex
		});

		if (data.unit != 0 && data.unit != "")
			selectElement.instance.select(data.unit);

		this._ingredientGroups.push({
			index: this._ingredientIndex,
			unitSelect: selectElement.instance,
			name: group.down(".field-ingredient-name input"),
			amount: group.down(".field-ingredient-amount input")
		});

		this._ingredientIndex++;
	},

	validates: function() {
		var errors = [];

		this._requiredFields.each(function(field) {
			field.container.removeClassName("error");

			if (field.element.type == "text" && field.element.value == "") {
				field.container.addClassName("error");
				errors.push(field.label.gsub("*", ""));
			}

			if (field.element.type == "checkbox" && field.element.checked == false) {
				field.container.addClassName("error");
				errors.push(field.label.gsub("*", ""));
			}

			if (field.element.hasClassName("select") && field.element.instance.getSelectedOption() == "") {
				field.container.addClassName("error");
				errors.push(field.label.gsub("*", ""));
			}
		});

		var numericFields = $$(".value-numeric");

		if (numericFields.length > 0) {
			numericFields.each(function(numericField) {
				var field = numericField.down("input");

				numericField.removeClassName("error");

				if (field.value == "")
					return;

				if (field.value.length == parseInt(field.value).toString().length)
					return;

				var parentGrid = numericField.up(".grid-4");

				if (parentGrid == null)
					return;

				numericField.addClassName("error");
				errors.push("Die " + numericField.down("label").innerHTML + " unter \"" + parentGrid.down("h4").innerHTML + "\" müssen in ganzen Zahlen angegeben werden");
			});
		}

		if (this._selectedCategories.getCount() == 0) {
			errors.push("Kategorie (mindestens eine)");
		}

		this._ingredientGroups.each(function(group) {
			group.name.removeClassName("error");
			group.amount.removeClassName("error");
			group.unitSelect.getElement().removeClassName("error");

			if (group.amount.value == "" && group.unitSelect.getSelectedOption() == "" && group.name.value == "")
				return;

			if (group.amount.value == "") {
				group.amount.addClassName("error");
				errors.push("Menge der Zutat Nr. " + (group.index + 1));
			}

			if (group.unitSelect.getValue() == "") {
				group.unitSelect.getElement().addClassName("error");
				errors.push("Einheit der Zutat Nr. " + (group.index + 1));
			}

			if (group.name.value == "") {
				group.name.addClassName("error");
				errors.push("Name der Zutat Nr. " + (group.index + 1));
			}
		});

		if (errors.length == 0)
			return true;

		this.messageBox.display(
			'<div class="light-box-message">' +
				'<h3>Bitte überprüfen Sie Ihre angaben</h3>' +
				'<p>Folgende Pflichtfelder wurden nicht korrekt ausgefüllt:</p>' +
				'<ul><li>' + errors.join('</li><li>') + '</li></ul>' +
			'</div>'
		);

		return false;
	},

	save: function(published) {
		var me = this;

		var formData = this.formElement.serialize(true);

		formData["Group"] = 3;
		formData["TermsOfUse"] = 1;
		formData["TermsAndConditions"] = 1;
		formData["Privacy"] = (published === true) ? 0 : 1;
		formData["Token"] = Weber.Utilities.getCommunity().getToken();

		formData["Portions"] = parseInt(formData["Portions"]);

		if (formData["ID"] == "")
			delete(formData["ID"]);

		if (formData["GrillID"] == "")
			delete(formData["GrillID"]);

		if (formData["target"] == "")
			delete(formData["target"]);

		if (formData["Temperature"] == "")
			formData["Temperature"] = 0;

		if (formData["CoreTemperature"] == "")
			formData["CoreTemperature"] = 0;

		if (formData["TimeForLeadMin"] == "")
			formData["TimeForLeadMin"] = 0;

		if (formData["TimeForLeadHour"] == "")
			formData["TimeForLeadHour"] = 0;

		if (formData["TimeForPreparationHour"] == "")
			formData["TimeForPreparationHour"] = 0;

		if (formData["TimeForPreparationMin"] == "")
			formData["TimeForPreparationMin"] = 0;

		if (formData["Difficulty"] == "")
			formData["Difficulty"] = 0;

		if (formData["GrillingMethod"] == "")
			formData["GrillingMethod"] = 0;

		Object.keys(formData).each(function(formDataKey) {
			if (formDataKey.indexOf("ingredient_") != -1 || formDataKey.indexOf("category_") != -1)
				delete(formData[formDataKey]);
		});

		formData["Ingredients"] = [];

		this._ingredientGroups.each(function(group) {
			if (group.name.value.empty())
				return;

			formData["Ingredients"].push({
				Name: group.name.value,
				Amount: group.amount.value,
				UnitID: parseInt(group.unitSelect.getValue())
			});
		});

		formData["Categories"] = [];

		me._selectedCategories.getAll().each(function(categoryId) {
			formData["Categories"].push({
				ID: parseInt(categoryId),
				// TODO: LanguageID auf MandantID umbauen
				LanguageID: Weber.Settings.MandantID
			});
		});

		var action = "create";

		if (typeof(formData["ID"]) != "undefined" && formData["ID"] != "")
			action = "update";

		var errorCallback = function() {
			me.messageBox.display(
				'<div class="light-box-message">' +
					'<h3>Das Rezept konnte nicht gespeichert werden.</h3>' +
					'<p>Bitte versuchen Sie es später erneut.</p>' +
				'</div>'
			);
		};

		var successCallback = function() {
			me.messageBox.getLightBox().afterClose.add(function() {
				window.location = Weber.service.recipe.links.myRecipes;
			});

			me.messageBox.display(
				'<div class="light-box-message">' +
					'<h3>Das Rezept wurde erfolgreich gespeichert!</h3>' +
					'<p><a href="' + Weber.service.user.links.home + '">Zu meiner Weber Community</a></p>' +
					'<p><a href="' + Weber.service.recipe.links.myRecipes + '">Zu meinen Rezepten</a></p>' +
				'</div>'
			);
		};

		Weber.Utilities.getRecipeService()[action](
			formData,
			function(transport) {
				if (me.formElement.down("#image").value.blank())
					return successCallback();

				me.messageBox.display('<div class="loading-overlay" style="width:221px;height:80px;"><br><br></div>');

				var waitForLoadOverlay = true;

				me.messageBox.getLightBox().afterChange.add(function() {
					if (waitForLoadOverlay == false)
						return;

					waitForLoadOverlay = false;

					me._idElement.value = transport.responseJSON.Item.ID;

					me._uploadFrame.on("load", function() {
						var uploadResponseJSON = me._uploadFrame.contentWindow.document.getElementById("ResponseText").innerHTML.evalJSON();

						if (uploadResponseJSON.Success !== true)
							return errorCallback();

						Weber.Utilities.getRecipeService().setPicture(
							{
								RecipeID: transport.responseJSON.Item.ID,
								Picture: uploadResponseJSON.Files["default"],
								LightboxPicture: uploadResponseJSON.Files.large,
								Token: Weber.Utilities.getCommunity().getToken(),
								ThumbnailPicture: uploadResponseJSON.Files.thumbnail
							},
							successCallback,
							errorCallback
						);
					});

					me.formElement.submit();
				});
			},
			errorCallback
		)
	}
});
