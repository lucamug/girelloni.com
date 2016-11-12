// Read the file and print its contents.
var fs = require('fs'),
	folder = 'source/GPS\ Data\ Iceland\ Berlin/',
	// filename = 'LUCA_833000591_20120829_022328.TXT',
	r = [];
var files = fs.readdirSync(folder);

for (var j in files.sort()) {
	var file = files[j];
	if (file.match(/^LUCA/)) {
		processThisFile(file);
		// break;
	}
}

console.log([
'<?xml version="1.0"?>',
'<gpx creator="GPS Visualizer http://www.gpsvisualizer.com/" version="1.0" xmlns="http://www.topografix.com/GPX/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">',
	'<trk>',
	'<name>All</name>',
		'<trkseg>',
		r.join(''),
		'</trkseg>',
	'</trk>',
'</gpx>',
].join(''));


function processThisFile(filename) {
	var array = fs.readFileSync(folder + filename).toString().split("\n");
	var c = 0;
	for (var i in array) {
		var row = array[i];
		if (row.match(/^\$GPRMC/)) {
			c++;
			if (!(c % 4)) {
				var ll = getLatLng(row);
				r.push([
					'<trkpt lat="' + ll.lat + '" lon="' + ll.lon + '">',
					'</trkpt>',
				].join(''));
			}
			// break;
		}
	}
}

function getLatLng(d) {
	var nmea = d.split(",");

	// LAT: North South 
	var coordNS = nmea[3];
	var direction = nmea[4];
	var days = coordNS.substring(0, 2);
	var minutes = coordNS.substring(2, 10);
	var lat = toDD(days, minutes, direction);

	// East West
	var coordEW = nmea[5];
	direction = nmea[6];
	days = coordEW.substring(0, 3);
	minutes = coordEW.substring(3, 11);
	var lon = toDD(days, minutes, direction);

	return { lat: lat, lon: lon };
}

function toDD(degrees, minutes, direction) {
	var out = parseInt(degrees) + (parseFloat(minutes) / 60);
	if (direction == "S" || direction == "W") {
		out = out * -1.0;
	}
	return out.toFixed(6);
}

// $GPRMC,002516.000,A,6358.0464,N,02234.5556,W,1.69,324.78,290812,,,A*72

//<?xml version="1.0"?>
//<gpx creator="GPS Visualizer http://www.gpsvisualizer.com/" version="1.0" xmlns="http://www.topografix.com/GPX/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">
//<trk>
//  <name>LUCA_833000591_20120829_022328</name>
//  <trkseg>
//    <trkpt lat="63.96744" lon="-22.575926667">
//      <time>2012-08-29T00:25:16Z</time>
//      <course>324.78</course>
//      <speed>0.87</speed>
//    </trkpt>
//    <trkpt lat="63.967453333" lon="-22.575948333">
//      <ele>49.2</ele>
//      <time>2012-08-29T00:25:17Z</time>
//      <course>323.85</course>
//      <speed>1.77</speed>
//      <sat>9</sat>
//      <hdop>0.9</hdop>
//    </trkpt>
//    <trkpt lat="63.97462" lon="-22.544038333">
//      <ele>17.6</ele>
//      <time>2012-08-29T01:00:51Z</time>
//      <sat>10</sat>
//      <hdop>0.9</hdop>
//    </trkpt>
//  </trkseg>
//</trk>
//</gpx>
