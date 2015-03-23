function iapixel(cId, cvType, cvValue, opts) {
	if (cId && cvType && cvValue) {
		var merge = function(d, s) {
			for (var p in s) {
				if (d.hasOwnProperty(p)) {
					d[p] = s[p];
				}
			}
			return d;
		};
		var options = merge({
			currency: 'EUR', // conversion currency code(ACCORDING ISO 4271 i.e. 'EUR' or 'USD') [optional
			orderId: '', // orderId [optional]
			age: '', // user age [optional]
			dob: '', // user birth date (format: YYYYMMDD)
			gender: '', // user gender (possible values: m or w)
			zip: '', // user zip code (5 digit zip code, i.e. 12345)
			city: '', // user city (i.e. Berlin)
			region: '', // user region (i.e. Bayern)
			country: '', // user country (possible values: 2 char coutry code, i.e. de) [optional]
			custom1: '', // custom value 1 [optional]
			custom2: '', // custom value 2 [optional]
			custom3: '', // custom value 3 [optional]
			custom4: ''  // custom value 4 [optional]
		}, opts || {});
		var varMap = {
			currency: 'vv', orderId: 'po', age: 'sh', dob: 'nf', gender: 'hr', zip: 'uo', city: 'vo', region: 'tr',
			country: 'vp', custom1: 'c1', custom2: 'c2', custom3: 'c3', custom4: 'c4'
		};
		var proto = (document.location.toString().indexOf('https://') != -1) ? 'https' : 'http';
		var uri = 't23.intelliad.de/tc.php';
		var url = '?cl=' + encodeURIComponent(cId) + '&v=' + encodeURIComponent(cvValue) + '&vz=' + encodeURIComponent(cvType) + '&';
		for (var v in varMap) {
			if (varMap.hasOwnProperty(v)) {
				url += varMap[v] + '=' + encodeURIComponent(options[v]) + '&';
			}
		}
		var imgsrc = proto + '://' + uri + url + '&rand=' + Math.floor(Math.random() * 11111139435231);
		var img = new Image();
		img.setAttribute('width', 1);
		img.setAttribute('height', 1);
		img.src = imgsrc;
		document.getElementsByTagName('body')[0].appendChild(img);
	}
	return true;
}

document.on(Weber.Tracking.Events.DealerSearch.StartSearch, function(event) {
	var targetElement = $("website-information");

	if (!targetElement)
		return;

	var ia_tp = "t23.intelliad.de/tc2.js";
	var ia_v = "0";
	var ia_vz = "le";
	var ia_vv = "EUR";
	var ia_po = "";
	var ia_sh = "";
	var ia_nf = "";
	var ia_hr = "";
	var ia_uo = "";
	var ia_vo = "";
	var ia_tr = "";
	var ia_vp = "";
	var ia_c1 = "local_shop";
	var ia_c2 = event.memo.search; // bei Search Ignite var x2
	var ia_c3 = "";
	var ia_c4 = "";

	var ia_cl = "4323231313236323131303";
	var ia_rand = Math.floor(Math.random() * 11111139435231);

	var ia_link = ia_tp + '?cl=' + ia_cl + '&v=' + ia_v + '&vz=' + ia_vz + '&vv=' + ia_vv + '&po=' + ia_po + '&sh=' + ia_sh + '&nf=' + ia_nf + '&hr=' + ia_hr + '&uo=' + ia_uo + '&vo=' + escape(ia_vo) + '&tr=' + escape(ia_tr) + '&vp=' + ia_vp + '&c1=' + ia_c1 + '&c2=' + ia_c2 + '&c3=' + ia_c3 + '&c4=' + ia_c4 + '&rand=' + ia_rand;

	var trackingCode = new Element("script", {
		type: "text/javascript",
		src: 'http' + (document.location.protocol == 'https:' ? 's' : '') + '://' + ia_link
	});

	targetElement.insert({
		after: trackingCode
	});
});

document.on(Weber.Tracking.Events.AdWords.ClickBanner, function(event) {
	iapixel('4323231313236323131303', 'le', '0', {custom1: event.memo.trackingLabel});
});
