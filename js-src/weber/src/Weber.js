/**
 * @package Weber
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 */
anyLib.registerNamespace("Weber");

var Weber = {};
var _gaq = _gaq || [];

var ga = document.createElement("script");
ga.type = "text/javascript";
ga.async = true;
ga.src = ("https:" == document.location.protocol ? "https://ssl" : "http://www") + ".google-analytics.com/ga.js";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(ga, s);

anyLib.bootstrap(function() {
	Weber.Settings = $("website-information").innerHTML.evalJSON();

	_gaq.push(["_setAccount", Weber.Settings.GoogleAnalyticsKey]);
	_gaq.push(["_gat._anonymizeIp"]);

	Weber.Settings.MandantID = parseInt(Weber.Settings.MandantID);

	Weber.googleMap = {
		loadCallback: Prototype.emptyFunction,
		key: Weber.Settings.GoogleMapsApiKey,
		scriptSrc: "http://maps.googleapis.com/maps/api/js?key=#{key}&sensor=false&callback=#{callback}",
		customInfoBox: "http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/src/infobox.js"
	};

	Weber.mainContainer = $("main-container");

	Weber.application = new anyLib.Application();

	var defaultRoute = new anyLib.Application.Router.Route.RegExp("default");
	defaultRoute.setPattern(/(.*)(?:\.aspx|\.html)/);
	defaultRoute.setMapping([
		"path"
	]);

	Weber.tools = {
		stringWidth: new Weber.Tool.StringWidth()
	};

	Weber.tools.stringWidth.setMeasureElement($("string-measure-helper"));

	Weber.service = {
		token: null,
		user: {
			api: {
				login: {
					method: "put",
					url: "/api/user/login"
				},
				edit: {
					method: "put",
					url: "/api/user/"
				},
				changePassword: {
					method: "put",
					url: "/api/user/password"
				},
				registration: {
					method: "post",
					url: "/api/user/"
				},
				friends: {
					method: "get",
					url: "/api/user/friend/#{identifier}"
				},
				picture: {
					method: "put",
					url: "/api/user/picture/"
				}
			},
			instance: null,
			links: {
				home: Weber.Settings.Service.User.Home,
				logout: Weber.Settings.Service.User.Logout,
				registerUrl: Weber.Settings.Service.User.RegisterUrl,
				lostPassword: Weber.Settings.Service.User.LostPassword
			}
		},
		forum: {
			api: {
				post: {
					method: "post",
					url: "/api/forum/"
				}
			},
			instance: null,
			links: {
			}
		},
		recipe: {
			api: {
				create: {
					method: "post",
					url: "/api/recipe/"
				},
				update: {
					method: "put",
					url: "/api/recipe/"
				},
				remove: {
					method: "delete",
					url: "/api/recipe/"
				},
				read: {
					method: "get",
					url: "/api/recipe/{id}"
				},
				comment: {
					method: "post",
					url: "/api/recipe/add-comment/"
				},
				rate: {
					method: "post",
					url: "/api/recipe/rate/"
				},
				like: {
					method: "post",
					url: "/api/recipe/like/"
				},
				hate: {
					method: "delete",
					url: "/api/recipe/like/"
				},
				setPicture: {
					method: "put",
					url: "/api/recipe/set-picture/"
				},
				publish: {
					method: "put",
					url: "/api/recipe/publish/#{id}"
				},
				isFavourite: {
					method: "get",
					url: "/api/recipe/is-favourite/#{mandantID}/#{recipeID}/#{token}"
				},
				getComments: {
					method: "get",
					url: "/api/recipe/comments/#{mandantID}/#{recipeID}"
				}
			},
			instance: null,
			links: {
				myRecipes: Weber.Settings.Service.Recipe.MyRecipes
			}
		},
		community: {
			api: {
				quit: {
					method: "delete",
					url: "/api/user/friend"
				},
				ignore: {
					method: "put",
					url: "/api/user/friend"
				},
				create: {
					method: "post",
					url: "/api/user/friend"
				},
				accept: {
					method: "put",
					url: "/api/user/friend/#{token}/#{userID}"
				}
			},
			instance: null
		},
		message: {
			api: {
				write: {
					method: "post",
					url: "/api/message"
				},
				read: {
					method: "get",
					url: "/api/message/#{token}/#{id}"
				},
				remove: {
					method: "delete",
					url: "/api/message/#{token}/#{id}"
				}
			},
			instance: null
		}
	};

	Weber.tracking = new Weber.Tracking();

	Weber.iCanHazPun=function(){$$("img").each(function(img){var w=img.width;if(w==0)return;var r=function(){return Math.floor((Math.random()*10)+1);};var t=["abstract","city","animals","food","nightlife","fashion","people","nature","sports","technics","transport"][r()];var c=function(){return String.fromCharCode(Math.abs(3^(r()))+97);};img.src="http://lorempixel.com/"+w+"/"+img.height+"/"+t+"/"+c()+c()+"/";});return"u can haz :)";};
	Weber.kickAss=function(){$$("body").first().insert({bottom:new Element("script",{type:"text/javascript",src:"http://hi.kickassapp.com/kickass.js"})});return"time to kick ass!";};

	Weber.tracking.onTrigger.add(function(data) {
		if (data.getAction() != "") {
			_gaq.push([
				"_trackEvent",
				data.getAction(),
				data.getLabel(),
				data.getValue()
			]);
		}
	});

	Weber.application.getRouter().addRoute(defaultRoute);

	var defaultModule = new Weber.Application.DefaultModule();

	Weber.application.addModule(defaultModule);

	var mainNavigationRequest = new anyLib.Application.Controller.Request();

	mainNavigationRequest.setModule("default");
	mainNavigationRequest.setController("navigation");
	mainNavigationRequest.setAction("main-navigation");
	mainNavigationRequest.setNamespace(defaultModule.getNamespace());

	Weber.application.dispatch(mainNavigationRequest);

	var languageSelectRequest = new anyLib.Application.Controller.Request();

	languageSelectRequest.setModule("default");
	languageSelectRequest.setController("navigation");
	languageSelectRequest.setAction("language-select");
	languageSelectRequest.setNamespace(defaultModule.getNamespace());

	Weber.application.dispatch(languageSelectRequest);

	// neuer Teil

	if ($("main-navigation-dealer-flags")) {

		var dealerLanguageSelectRequest = new anyLib.Application.Controller.Request();

		dealerLanguageSelectRequest.setModule("default");
		dealerLanguageSelectRequest.setController("navigation");
		dealerLanguageSelectRequest.setAction("dealer-language-select");
		dealerLanguageSelectRequest.setNamespace(defaultModule.getNamespace());

		Weber.application.dispatch(dealerLanguageSelectRequest);
	}

	// Teil ende

	Weber.rnbws=function() {$$("p,a,li,h1,h2,h3,h4,td,th,div,span,label,input").each(function(e){e.addClassName("easteregg");});};

	var routingInformationElement = $("routing-information");

	var routingInformation = routingInformationElement.innerHTML.evalJSON();

	Weber.initialRoutingInformation = routingInformation;

	var pageRequest = new anyLib.Application.Controller.Request();

	pageRequest.setModule("default");
	pageRequest.setAction(routingInformation.action);
	pageRequest.setNamespace(defaultModule.getNamespace());
	pageRequest.setController(routingInformation.controller);

	Weber.application.getDispatcher().postDispatch.add(function() {
		if (Prototype.Browser.IE === true) {
			var oddTableRows = $$("tr:nth-child(odd)");

			if (oddTableRows.length > 0 && oddTableRows.first().getStyle("backgroundColor") == "transparent") {
				oddTableRows.each(function(oddTableRow) {
					oddTableRow.addClassName("odd");
				});
			}
		}
	});

	var selectElements = $$(".select");
	var checkBoxElements = $$(".item-checkbox .checkbox");
	var radioElements = $$(".item-radio .radio");

	if (selectElements.length > 0) {
		var selectRequest = new anyLib.Application.Controller.Request();
		selectRequest.setAction("select");
		selectRequest.setModule("default");
		selectRequest.setController("form");
		selectRequest.setNamespace(defaultModule.getNamespace());

		selectRequest.getParameters().set("elements", selectElements);

		Weber.application.dispatch(selectRequest);
	}

	if (checkBoxElements.length > 0) {
		var checkBoxRequest = new anyLib.Application.Controller.Request();
		checkBoxRequest.setModule("default");
		checkBoxRequest.setController("form");
		checkBoxRequest.setAction("check-box");
		checkBoxRequest.setNamespace(defaultModule.getNamespace());

		checkBoxRequest.getParameters().set("elements", checkBoxElements);

		Weber.application.dispatch(checkBoxRequest);
	}

	if (checkBoxElements.length > 0) {
		var radioRequest = new anyLib.Application.Controller.Request();
		radioRequest.setModule("default");
		radioRequest.setController("form");
		radioRequest.setAction("radio");
		radioRequest.setNamespace(defaultModule.getNamespace());

		radioRequest.getParameters().set("elements", radioElements);
		radioRequest.getParameters().set("group", radioElements);

		Weber.application.dispatch(radioRequest);
	}

	var pageContainerElements = $$(".paging-page");

	if (pageContainerElements.length > 1) {
		var pagingRequest = new anyLib.Application.Controller.Request();
		pagingRequest.setAction("paging");
		pagingRequest.setModule("default");
		pagingRequest.setController("default");
		pagingRequest.setNamespace(defaultModule.getNamespace());

		pagingRequest.getParameters().add("pageCollection", pageContainerElements);

		Weber.application.dispatch(pagingRequest);
	}

	var tooltips = $$(".tooltip");

	if (tooltips.length > 0) {
		var tooltipRequest = new anyLib.Application.Controller.Request();
		tooltipRequest.setAction("tooltip");
		tooltipRequest.setModule("default");
		tooltipRequest.setController("default");
		tooltipRequest.setNamespace(defaultModule.getNamespace());

		tooltipRequest.getParameters().add("tooltipCollection", tooltips);

		Weber.application.dispatch(tooltipRequest);
	}

	if ($$(".community-login").length > 0) {
		var initializeLoginRequest = new anyLib.Application.Controller.Request();
		initializeLoginRequest.setModule("default");
		initializeLoginRequest.setController("login");
		initializeLoginRequest.setAction("initialize");
		initializeLoginRequest.setNamespace(defaultModule.getNamespace());

		Weber.application.dispatch(initializeLoginRequest);

		var initializeCommunityRequest = new anyLib.Application.Controller.Request();
		initializeCommunityRequest.setModule("default");
		initializeCommunityRequest.setAction("initialize");
		initializeCommunityRequest.setController("community");
		initializeCommunityRequest.setNamespace(defaultModule.getNamespace());

		Weber.application.dispatch(initializeCommunityRequest);
	}

	if ($$(".foldout-item").length > 0) {
		var foldoutRequest = new anyLib.Application.Controller.Request();

		foldoutRequest.setAction("foldout");
		foldoutRequest.setModule("default");
		foldoutRequest.setController("default");
		foldoutRequest.setNamespace(Weber.Application);

		Weber.application.dispatch(foldoutRequest);
	}

	var recommendRequest = new anyLib.Application.Controller.Request();
	recommendRequest.setModule("default");
	recommendRequest.setAction("recommend");
	recommendRequest.setController("default");
	recommendRequest.setNamespace(defaultModule.getNamespace());

	$$('.back-to-top').each(function(element) {
		element.on('click', function(event) {
			window.scrollTo(0,0);
			event.preventDefault();
		});
	});

	Weber.application.dispatch(recommendRequest);

	Weber.application.dispatch(pageRequest);

	_gaq.push(['_trackPageview']);

	document.fire(Weber.Tracking.Events.PageView);
});
