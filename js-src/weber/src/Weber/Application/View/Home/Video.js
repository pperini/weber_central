/**
 * @package Weber.Application
 * @requiresPackage anyLib
 * @requiresPackage anyLib.Application
 * @requiresPackage Weber
 * @requiresPackage Weber.Home
 * @requiresPackage Weber.LightBox
 */
anyLib.registerNamespace("Weber.Application.View.Home");

Weber.Application.View.Home.Video = Class.create(anyLib.Application.View, {
	element: null,
	videoUrl: null,

	render: function() {
		var lightBox = new anyLib.UI.LightBox();

		lightBox.setLayout(new Weber.LightBox.Layout.HomeVideo());

		var video = new anyLib.UI.LightBox.Content.Video.YouTube();

		video.setKey("video");

		video._setContent(this.videoUrl.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/).last());

		video.setDimensions({
			width: 640,
			height: 360
		});

		lightBox.addContent(video);

		this.element.on("click", function(event) {
			Event.stop(event);

			lightBox.change("video");
		});
	}
});