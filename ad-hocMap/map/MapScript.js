/**
 * 
 */
var xmlHttp = null;
var map;
var circles = [];
var values = [];
//var server = "alkhwarizmi-umh.cs.umn.edu"; //"128.101.96.158";
var server = "ibn-battuta-umh.cs.umn.edu";
var portnum = "8000";

var markers = [];

function processing_on() {
	document.getElementById('loadingImg').style.visibility='visible';
}

function processing_off() {
	document.getElementById('loadingImg').style.visibility='hidden';
}


function updateData(x1,y1,x2,y2,level,keyword,from,to)
{
	processing_on();
	 if(from == null){
	 	from = "2015-01-01";
	 }
	 if(to == null){
	 	to = "2015-01-01";
	 }
	 
	  var temp;
     if (x2 < x1) {
     	x1= -180;
     	x2= 180;
     	}
     if (y2 < y1) {
     	y1= -90;
     	y2 = 90;
     	}
     	
     	if(from == ""){
     		from = "01-01-2015";
     	}else{
     		var temp = formatDate(from);
     		from = temp;
     	}
     	if(to == ""){
     		to = "01-01-2015";
     	}else{
     		var temp = formatDate(to);
     		to = temp;
     	}
      
    var Url = "http://"+server+":"+portnum+"/query?x1="+x1+"&y1="+y1+"&x2="+x2+"&y2="+y2+"&level="+level+"&start="+from+"&end="+to+"&keyword="+keyword;
    
    xmlHttp = new XMLHttpRequest(); 
    xmlHttp.onreadystatechange = ProcessRequest;
    xmlHttp.open( "GET", Url, true );
    xmlHttp.send( null );
}

/*
 This function takes a date in any format and then return the date as YYYY-MM-DD format that is acceptable by the server.
*/
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}


function ProcessRequest() 
{
    if ( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) 
    {
        if ( xmlHttp.responseText == null ) 
        {
         	// do nothing 
        }
        else
        {
            var info = eval ( "(" + xmlHttp.responseText + ")" ); 

            for (var key in info.locations) {
               //alert('x ='+info.locations[key].x+' y ='+info.locations[key].y+' value ='+info.locations[key].value);
               markers.push([Number(info.locations[key].x) ,Number(info.locations[key].y),Number(info.locations[key].value)]);
				}
	    testFucntion();
	    processing_off();
        }                    
    }
}



/////////////////////////////////////

function testFucntion(){
	var bounds = map.getBounds();
	markers.forEach(function(point) {
		generateIcon(point[2], function(src) {
			//alert('im in generate icon');
			var pos = new google.maps.LatLng(point[1], point[0]);
			bounds.extend(pos);
			var Lobject = new google.maps.Marker({
			position : pos,
			map : map,
			icon : src
				});
			values.push(Lobject);
			Lobject.setMap(map);
			});
		});
}


var generateIconCache = {};

/*ones = Math.floor(num % 10),
tens = Math.floor(num/10 % 10),
hundreds = Math.floor(num/100 % 10),
thousands = Math.floor(num % 10000 /1000),
tenThousands = Math.floor(num / 10000 % 10),
hundredThousands = Math.floor(num / 100000 % 10),
millions = Math.floor(num / 1000000 % 10),
tenMillions = Math.floor(num / 10000000 % 10),
hundredMillions = Math.floor(num / 100000000 % 10);*/

function generateIcon(number, callback) {
	if (generateIconCache[number] !== undefined) {
		callback(generateIconCache[number]);
		}
	var fontSize = 16, imageWidth = imageHeight = 40;
	
	// First circle color
	  if(number >=0 && number < 100){
		fontSize = 20;
		imageWidth = imageHeight = 40;
		var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
		// circle 
		var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '20.2').style('fill', '#80e6ff');
		// border 
		//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
		// text color
		var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #f0ffff; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
		var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
		d3.select(svgNode).select('clippath').remove();
		var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
		image.onload = (function(imageWidth, imageHeight) {
			var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
			d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
			context.drawImage(image, 0, 0, imageWidth, imageHeight);
			dataURL = canvas.toDataURL();
			generateIconCache[number] = dataURL;
			callback(dataURL);
			}).bind(this, imageWidth, imageHeight);
		
		image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
		
		function(match, p1) {
			return String.fromCharCode('0x' + p1);
			}));
		} // number  number >=0 && number < 100
	  
	// Second circle color
	  if(number >=100 && number < 1000){
			fontSize = 16;
			imageWidth = imageHeight = 45;
			var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
			// circle 
			var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '21.5').style('fill', '#00ccff');
			// border 
			//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
			// text color
			var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #ffefef; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
			var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
			d3.select(svgNode).select('clippath').remove();
			var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
			image.onload = (function(imageWidth, imageHeight) {
				var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
				d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
				context.drawImage(image, 0, 0, imageWidth, imageHeight);
				dataURL = canvas.toDataURL();
				generateIconCache[number] = dataURL;
				callback(dataURL);
				}).bind(this, imageWidth, imageHeight);
			
			image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
			
			function(match, p1) {
				return String.fromCharCode('0x' + p1);
				}));
			} //   number >= 100 && number < 1000
	  
	// Third circle color
	  if(number >= 1000 && number < 10000){
			fontSize = 16;
			imageWidth = imageHeight = 50;
			var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
			// circle 
			var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '22.8').style('fill', '#0099bf');
			// border 
			//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
			// text color
			var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #ffefef; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
			var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
			d3.select(svgNode).select('clippath').remove();
			var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
			image.onload = (function(imageWidth, imageHeight) {
				var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
				d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
				context.drawImage(image, 0, 0, imageWidth, imageHeight);
				dataURL = canvas.toDataURL();
				generateIconCache[number] = dataURL;
				callback(dataURL);
				}).bind(this, imageWidth, imageHeight);
			
			image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
			
			function(match, p1) {
				return String.fromCharCode('0x' + p1);
				}));
			} //   number >= 1000 && number < 10000
	  
	// Forth circle color
	  if( number >= 10000 && number < 100000){
			fontSize = 14;
			imageWidth = imageHeight = 50;
			var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
			// circle 
			var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '23.4').style('fill', '#00667f');
			// border 
			//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
			// text color
			var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #ffefef; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
			var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
			d3.select(svgNode).select('clippath').remove();
			var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
			image.onload = (function(imageWidth, imageHeight) {
				var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
				d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
				context.drawImage(image, 0, 0, imageWidth, imageHeight);
				dataURL = canvas.toDataURL();
				generateIconCache[number] = dataURL;
				callback(dataURL);
				}).bind(this, imageWidth, imageHeight);
			
			image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
			
			function(match, p1) {
				return String.fromCharCode('0x' + p1);
				}));
			} //   number >= 10000 && number < 100000
	  
	// Fifth circle color
	  if( number >= 100000 && number < 1000000){
			fontSize = 12;
			imageWidth = imageHeight = 50;
			var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
			// circle 
			var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '24.7').style('fill', '#004c5f');
			// border 
			//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
			// text color
			var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #ffefef; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
			var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
			d3.select(svgNode).select('clippath').remove();
			var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
			image.onload = (function(imageWidth, imageHeight) {
				var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
				d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
				context.drawImage(image, 0, 0, imageWidth, imageHeight);
				dataURL = canvas.toDataURL();
				generateIconCache[number] = dataURL;
				callback(dataURL);
				}).bind(this, imageWidth, imageHeight);
			
			image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
			
			function(match, p1) {
				return String.fromCharCode('0x' + p1);
				}));
			} //   number >= 100000 && number < 1000000
	  
	// Sixth circle color
	  if( number >= 1000000 && number < 10000000){
			fontSize = 13;
			imageWidth = imageHeight = 50;
			var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
			// circle 
			var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '25.9').style('fill', '#B2A3E4.');
			// border 
			//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
			// text color
			var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #ffefef; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
			var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
			d3.select(svgNode).select('clippath').remove();
			var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
			image.onload = (function(imageWidth, imageHeight) {
				var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
				d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
				context.drawImage(image, 0, 0, imageWidth, imageHeight);
				dataURL = canvas.toDataURL();
				generateIconCache[number] = dataURL;
				callback(dataURL);
				}).bind(this, imageWidth, imageHeight);
			
			image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
			
			function(match, p1) {
				return String.fromCharCode('0x' + p1);
				}));
			} //   number >= 100000 && number < 1000000
	  
	// Seventh circle color
	  if(number > 1000000) {
		fontSize = 14;
		imageWidth = imageHeight = 50;
		
		var svg = d3.select(document.createElement('div')).append('svg').attr('viewBox', '0 0 54.4 54.4').append('g')
		// circle 
		var circles = svg.append('circle').attr('cx', '27.2').attr('cy', '27.2').attr('r', '26.2').style('fill', '#9E8CD7');
		// border 
		//var path = svg.append('path').attr('d','M27.2,0C12.2,0,0,12.2,0,27.2s12.2,27.2,27.2,27.2s27.2-12.2,27.2-27.2S42.2,0,27.2,0z M6,27.2 C6,15.5,15.5,6,27.2,6s21.2,9.5,21.2,21.2c0,11.7-9.5,21.2-21.2,21.2S6,38.9,6,27.2z').attr('fill', '#ff3366');
		// text color
		var text = svg.append('text').attr('dx', 27).attr('dy', 32).attr('text-anchor', 'middle').attr('style','font-size:'+ fontSize + 'px; fill: #ffefef; font-family: "Comic Sans MS", cursive, sans-serif; font-weight: ').text(number);
		var svgNode = svg.node().parentNode.cloneNode(true), image = new Image();
		d3.select(svgNode).select('clippath').remove();
		var xmlSource = (new XMLSerializer()).serializeToString(svgNode);
		image.onload = (function(imageWidth, imageHeight) {
			var canvas = document.createElement('canvas'), context = canvas.getContext('2d'), dataURL;
			d3.select(canvas).attr('width', imageWidth).attr('height', imageHeight);
			context.drawImage(image, 0, 0, imageWidth, imageHeight);
			dataURL = canvas.toDataURL();
			generateIconCache[number] = dataURL;
			callback(dataURL);
			}).bind(this, imageWidth, imageHeight);
		
		image.src = 'data:image/svg+xml;base64,'+ btoa(encodeURIComponent(xmlSource).replace(/%([0-9A-F]{2})/g,
		
		function(match, p1) {
			return String.fromCharCode('0x' + p1);
			}));
		} // number > 1000000
	  
	  
	} // generateIcon

/////////////////////////////////////

function clearCircle() {
	for(i = 0; i< values.length; i++){
		values[i].setMap(null);
		}
	values = [];
	markers = [];
	}

	
function initMap() {
	// Map Style
	var styles = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{"featureType":"landscape","elementType":"all","stylers":[{"invert_lightness":true},{"saturation":-100}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"color":"#2a292a"}]},{"featureType":"poi.park","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#a09d9e"}]},{"featureType":"road","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#808080"}]}];
/*	{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#1B2A41"}]},
	{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":50}]},
	{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},
	{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#007EA7"},{"lightness":50},{"weight":1.4}]},
	{"featureType":"landscape","elementType":"all","stylers":[{"color":"#08304b"}]},
	{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},
	{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},
	{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},
	{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},
	{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},
	{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},
	{"featureType":"transit","elementType":"all","stylers":[{"color":"#146474"}]},
	{"featureType":"water","elementType":"all","stylers":[{"color":"#021019"}]}];*/
	
	var styledMap = new google.maps.StyledMapType(styles, {
		name : "Styled Map"
	});
	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : 27.288779,
			lng : 12.975057
		},
		zoom : 3,
		maxZoom : 14,
		minZoom : 3,
		mapTypeControlOptions : {
			mapTypeIds : [ google.maps.MapTypeId.ROADMAP, 'map_style' ]
		}

	});
	map.mapTypes.set('map_style', styledMap);
	map.setMapTypeId('map_style');
	//Event when center changed 
	map.addListener('idle', function() {
		// 3 seconds after the center of the map has changed, pan back to the
		// marker.
		zoomLevel = map.getZoom();
		var bound = map.getBounds();
		var ne = bound.getNorthEast(); // LatLng of the north-east corner
		var sw = bound.getSouthWest(); // LatLng of the south-west corder
		clearCircle();
		var keyword = document.getElementById("inputkeyword").value;
		if(keyword == null || keyword == ""){
		   keyword = document.getElementById("inputHashtag").value;
		}
		var from = document.getElementById("inputFromDate").value;
		var to = document.getElementById("inputToDate").value;
		//alert(sw.lng()+" , "+sw.lat()+","+ne.lng()+","+ne.lat());
		updateData(sw.lng(), sw.lat(), ne.lng(), ne.lat(), zoomLevel,keyword,from,to);
	});//endEvent idle listener      
}//end init map 
