/* 
 * QR Code offline generator webapp
 * @Author: Didier Donsez
 * @Version: 0.1.2
 */

// Error Correction Capability
var qrcode_ecc_level = 'M';

// current QRcode size
// @TODO must fit the device screen size
var qrcode_size = 10;

// current QRcode message
var qrcode_msg = '';


/**
 * Calculates the CRC16 of a string.
 *
 * @param {String} str the data str.
 * @return {String} the calculated CRC16 on 4 digits.
 * 
 * Source: github.com/yaacov/node-modbus-serial
 */

function crc16str(str) {
    var crc = 0xFFFF;
    var odd;

    for (var i = 0; i < str.length; i++) {
        crc = crc ^ str.charCodeAt(i);

        for (var j = 0; j < 8; j++) {
            odd = crc & 0x0001;
            crc = crc >> 1;
            if (odd) {
                crc = crc ^ 0xA001;
            }
        }
	}
	return	('0000' + crc.toString(16).toUpperCase()).slice(-4);
};

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
			if ((_u.indexOf('http://') < 0) && (_u.indexOf('https://') < 0 )) {
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
		} else 	 if (currentmode == "lorawan") {
			str = "LW";

			_s = $("#lorawan-schema").val(); // TODO check length 2 and mandatory
			if (_s != '')
				str += ':' +_s;
			_s = $("#lorawan-joineui").val(); // TODO check length 8 and mandatory
			if (_s != '')
				str += ':' +_s;
			_s = $("#lorawan-deveui").val(); // TODO check length 8 and mandatory
			if (_s != '')
				str += ':' +_s;
			_s = $("#lorawan-profileid").val(); // TODO check length 8
			if (_s != '')
				str += ':' +_s;	
			_s = $("#lorawan-ownertoken").val(); // TODO check length 4 
			if (_s != '')
				str += ':' +_s;
			_s = $("#lorawan-sernum").val(); // TODO check length 4
			if (_s != '')
				str += ':' +_s;
			_s = $("#lorawan-proprietary").val(); // TODO check length
			if (_s != '')
				str += ':' +_s;
		
			str = str.toUpperCase();

			str += ':' + crc16str(str); // MODBUS CRC16 
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
