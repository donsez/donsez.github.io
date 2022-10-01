/* 
 * QR Code offline generator webapp
 * @Author: Didier Donsez
 * @Version: 0.1.1
 */

// Error Correction Capability
var qrcode_ecc_level = 'M';

// current QRcode size
// @TODO must fit the device screen size
var qrcode_size = 10;

// current QRcode message
var qrcode_msg = '';

// generate the QR code in the canvas
function genQRCode(msg) {
	qr.canvas({
		canvas : document.getElementById('qr-code'),
		value : msg,
		size : qrcode_size,
		level : qrcode_ecc_level
	});
}

// trig when volue changing in form inputs
function onInputChange() {
	if (currentmode == "cfg") {
		qrcode_ecc_level = $("input:radio[name=cfg-ecc]:checked").val();
	} else {
		str = "";
		if (currentmode == "http") {
			_u = $("#http-url").val();
			_prefix = 'http://';
			if (_u.indexOf(_prefix) < 0) {
				str = 'http://';
			}
			str += _u;
		} else if (currentmode == "text") {
			str = $("#text-message").val();
		} else if (currentmode == "sms") {
			str = 'smsto:' + $("sms-number").val() + ':'
					+ $("#sms-message").val();
		} else if (currentmode == "tel") {
			str = 'tel:' + $("#tel-number").val();
		} else if (currentmode == "geo") {
			str = 'geo:' + $("#geo-lat").val() + ',' + $("#geo-lon").val();
			_gq = $("#geo-query").val();
			if (_gq != '')
				str += '?q=' + _gq;
		} else if (currentmode == "wifi") {
			// WIFI:S:ssid;T:WEP;P:password;H:true;;
			str = 'WIFI:S:'
					+ $("#wifi-ssid").val()
					+ ';P:'
					+ $("#wifi-password").val()
					+ ';T:'
					+ $("input:radio[name=wifi-type]:checked").val()
					+ ($("input:checkbox[name=wifi-hidden]:checked").val() == "true" ? ';H:true'
							: '')
			// @TODO add checkbox hidden
		} else if (currentmode == "mail") {
			str = 'mailto:' + $("#mail-address").val() + ':'
					+ $("#mail-message").val();
		} else if (currentmode == "vcard") {
			str = "BEGIN:VCARD\nVERSION:3.0\n";
			str += "N:";
			_s = $("#vcard-lastname").val();
			if (_s != '')
				str += _s;
			_s = $("#vcard-firstname").val();
			if (_s != '')
				str += ";" + _s;
			str += "\n";

			_s = $("#vcard-org").val();
			if (_s != '')
				str += "ORG:" + _s + "\n";
			_s = $("#vcard-title").val();
			if (_s != '')
				str += "TITLE:" + _s + "\n";
			_s = $("#vcard-phonenumber").val();
			if (_s != '')
				str += "TEL:" + _s + "\n";
			_s = $("#vcard-url").val();
			if (_s != '')
				str += "URL:" + _s + "\n";
			_s = $("#vcard-mailaddress").val();
			if (_s != '')
				str += "EMAIL:" + _s + "\n";
			_s = $("#vcard-postaladdress").val();
			if (_s != '')
				str += "ADR:" + _s + "\n";
			str += "END:VCARD";
		}
		qrcode_msg = str;
	}

	genQRCode(qrcode_msg);
	$("#generatedstr").replaceWith(
			"<p id=\'generatedstr\'>" + qrcode_msg + "</p>");
}

function swapModeForm(one, two) {
	// if(one==two) return;
	document.getElementById("input-" + one).style.display = 'none';
	document.getElementById("input-" + two).style.display = 'block';
	$("#but-" + one).removeClass("btn-primary").addClass("btn-default");
	$("#but-" + two).removeClass("btn-default").addClass("btn-primary");
}

var currentmode = "http";

function switchTo(newmode) {
	swapModeForm(currentmode, newmode);
	currentmode = newmode;
	onInputChange();
}
