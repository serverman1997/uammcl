/**
* Returns an XMLHttp instance to use for asynchronous
* downloading. This method will never throw an exception, but will
* return NULL if the browser does not support XmlHttp for any reason.
* @return {XMLHttpRequest|Null}
*/
function xmlParse(str) {
  if (typeof ActiveXObject != 'undefined' && typeof GetObject != 'undefined') {
    var doc = new ActiveXObject('Microsoft.XMLDOM');
    doc.loadXML(str);
    return doc;
  }

  if (typeof DOMParser != 'undefined') {
    return (new DOMParser()).parseFromString(str, 'text/xml');
  }

  return createElement('div', null);
}
function createXmlHttpRequest() {
 try {
   if (typeof ActiveXObject != 'undefined') {
     return new ActiveXObject('Microsoft.XMLHTTP');
   } else if (window["XMLHttpRequest"]) {
     return new XMLHttpRequest();
   }
 } catch (e) {
   changeStatus(e);
 }
 return null;
};

/**
* This functions wraps XMLHttpRequest open/send function.
* It lets you specify a URL and will call the callback if
* it gets a status code of 200.
* @param {String} url The URL to retrieve
* @param {Function} callback The function to call once retrieved.
*/
function GDownloadUrl(url, callback) {
 var status = -1;
 var request = createXmlHttpRequest();
 if (!request) {
   return false;
 }

 request.onreadystatechange = function() {
   if (request.readyState == 4) {
     try {
       status = request.status;
     } catch (e) {
       // Usually indicates request timed out in FF.
     }
     if (status == 200) {
	 // next line altered: Text replaces XML
       callback(request.responseText, request.status);
       request.onreadystatechange = function() {};
     }
   }
 }
 request.open('GET', url, true);
 try {
   request.send(null);
 } catch (e) {
   changeStatus(e);
 }
};

function downloadScript(url) {
  var script = document.createElement('script');
  script.src = url;
  document.body.appendChild(script);
}


jQuery( document ).ready(function() { load(); });
jQuery( document ).ready(function() { searchLocations(); });
jQuery( window ).unload(function() { GUnload(); });
var myurl = "https://www.pradan.net/";
	function summitCounty(id)
	{
	//alert(id);
		if (id=="")
		{
			document.getElementById("txtHint").innerHTML="";
			return;
		}
		if (window.XMLHttpRequest)
		{
			xmlhttp=new XMLHttpRequest();
		}
		else
		{
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange=function()
		{
			if (xmlhttp.readyState==4 && xmlhttp.status==200)
			{
				//console.log(xmlhttp.responseText);
				document.getElementById("txtHint").innerHTML=xmlhttp.responseText;
				document.getElementById("city").setAttribute("class", "input");
			}
		}
	xmlhttp.open("GET",myurl+"ajaxResponse.php?stateId="+id+"&key="+ new Date().getTime(),true);
	xmlhttp.send();

	}

    //<![CDATA[
    var map;
    var geocoder;
	var mylat='';
	var mylong='';
   var myLatlng;
    var markers = [];
    var infoWindow;
    var locationSelect;

               // ##################   Create the Map   ################
           
   function load() {
	  
	   //searchLocations();
	    if (navigator.geolocation) {
         var watchID = navigator.geolocation.watchPosition(function(position) { do_something(position.coords.latitude, position.coords.longitude);});
         function do_something(lat,long){
          mylat=lat;
          mylong=long;
             if(mylat !='' && mylong!='') {
				 myLatlng  = new google.maps.LatLng(mylat,mylong);
			     }
		      }
          }
       
		if(mylat !='' && mylong!='')
		{
         myLatlng = new google.maps.LatLng(mylat,mylong);
		}
		else
		{
          myLatlng = new google.maps.LatLng(22.550442,78.574219);
		}
	   
	   
	    map = new google.maps.Map( document.getElementById( "map" ), {
            center: myLatlng,
            zoom: 5,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            }
        } );
	 
 
    }

  // ######################   Create the Map  #####################




   function searchLocations() {
	  load();
      var address = document.getElementById('addressInput').value;
     var pincode = document.getElementById('pincode').value;
     var stateid = document.getElementById('stateid').value;
     var city = document.getElementById('city').value;
     searchLocationsNear(address,pincode,stateid,city);
	//return false;
   }
  
   function searchLocationsNear(address,pincode,stateid,city) { 
	   // clearLocations();
 //  alert("searchLocationsNear");
     document.getElementById('sidebarcol').style.display="block";
     document.getElementById('map').style.width="100%";
     var searchUrl = myurl+'pradan_xml.php?address=' + address + '&pincode=' + pincode + '&stateid=' + stateid + '&city=' + city;
	   //console.log(searchUrl);
     GDownloadUrl(searchUrl, function(data) {
       var xml = xmlParse(data);
       markers = xml.documentElement.getElementsByTagName('marker');
		//console.log("Markers"+markers);
       //map.clearOverlays();
       var sidebar = document.getElementById('sidebar');
       sidebar.innerHTML = '';
       if (markers.length == 0) {
         sidebar.innerHTML = '<div style="background:#0095eb; width:100%; margin-top:-5px; padding:15px !important; color:#FFF; float:left; font-size:20px;">No results found.</div>';
 
if(mylat !='' && mylong!='')
{
 new google.maps.LatLng(mylat,mylong);
}
else
{
new google.maps.LatLng(22.550442,78.574219);
}
      //  map.setCenter(new GLatLng(22.550442,78.574219), 5);
         return;
       }
	   else if(markers.length==1)
	   {
	   sidebar.innerHTML = '<div style="background:#0E590A; width:100%; margin-top:-5px; padding:15px !important; color:#FFF; font-size:20px;">' + markers.length+' Locations Near You.</div>';
	   }
	   else
	   {
	   sidebar.innerHTML = '<div style="background:#0E590A; width:100%; margin-top:-5px; padding:15px !important; color:#FFF; font-size:20px;">' + markers.length+' Locations Near You.</div>';
	   }
		  var infoWindow = new google.maps.InfoWindow();
   var plat="";
   var plng= "";
       var bounds = new google.maps.LatLngBounds();
       for (var i = 0; i < markers.length; i++) {
		  
         var name = markers[i].getAttribute('name');
         var address = markers[i].getAttribute('address');
         var distance = '';
		 var logo = markers[i].getAttribute('logo');
		 var city = markers[i].getAttribute('city');
		 var state = markers[i].getAttribute('state');
		 var pinNo = markers[i].getAttribute('pinNo');
		 var stdCode = markers[i].getAttribute('stdCode');
		 var phone = markers[i].getAttribute('phone');
		 var fax = markers[i].getAttribute('fax');
		 var IPDDiscount = markers[i].getAttribute('IPDDiscount');
		 var OPDDiscount = markers[i].getAttribute('OPDDiscount');
		 var remarks = markers[i].getAttribute('remarks');
		 var contactPerson = markers[i].getAttribute('contactPerson');
		 var contactNumber = markers[i].getAttribute('contactNumber');
		  plat=parseFloat(markers[i].getAttribute('lat'));
		  plng=parseFloat(markers[i].getAttribute('lng'));
         var point = new google.maps.LatLng(plat,plng);
         var marker = createMarker(point, name, address, logo, city, state, pinNo, stdCode, phone, fax, plat, plng, IPDDiscount, OPDDiscount, remarks, contactPerson, contactNumber,i);
		 console.log("return"+marker);
        // map.addOverlay(marker);
         var sidebarEntry = createSidebarEntry(marker, name, address, distance, logo, city, state, pinNo);
         sidebar.appendChild(sidebarEntry);
         bounds.extend(point);
        
       }

     });
   }



// #################    Create Marker ####################
// 
 function createMarker(point, name, address, logo, city, state, pinNo, stdCode, phone, fax, plat, plng, IPDDiscount, OPDDiscount, remarks, contactPerson, contactNumber,i) {
      //var marker = new GMarker(point);
	  var destination=plat + ',' + plng+'('+address+', '+city +', '+state+', India)';
	  var source=city+','+state+',India';
 
      var basicInfo ='<table "width=300px" border="0" cellspacing="2" cellpadding="2"><tr><td colspan="2"><b>' + name + '</b></td></tr><tr><td colspan=2>' + address+'</td></tr><tr><td><b>City : </b></td><td>' + city + '</td></tr><tr><td><b>State : </b></td><td>' + state + '</td></tr><tr><td><b>Pincode : </b></td><td>' + pinNo + '</td></tr><tr><td><b>Contact No. : </b></td><td>' + stdCode + '-' + phone + '</td></tr><tr><td><b>Fax No. : </b></td><td>' + fax + '</b></td></tr><tr><td></td><td><a href="http://maps.google.com/maps?saddr='+ source + '&daddr=' + destination + '&hl=in" target="_blank">Get Direction</a></td></tr></table>';

	  if(IPDDiscount !='')
	  {
      var otherInfo ='<table "width=300px" border="0" cellspacing="4" cellpadding="4"><tr><td>'+logo+'</td><td></td></tr><tr><td><b>IPD Discount : </b></td><td>' + IPDDiscount + '</td></tr><tr><td><b>OPD Discount : </b></td><td>' + OPDDiscount + '</td></tr><tr><td><b>Remarks : </b></td><td>' + remarks + '</td></tr><tr><td><b>Contact Person : </b></td><td>' +contactPerson + '</td></tr><tr><td><b>Contact Number : </b></td><td>' + contactNumber + '</b></td></tr><tr><td></td><td><a href="http://maps.google.com/maps?saddr='+ source + '&daddr=' + destination + '&hl=in" target="_blank">Get Direction</a></td></tr></table>';
	  }
	  else{
	    var otherInfo = '';
	  }
			
var tabs = [];
tabs.push(new google.maps.InfoWindow('Info', basicInfo));
if(otherInfo !='')
{
 tabs.push(new google.maps.InfoWindow('Offer', '<table width=350px border=0 cellpadding=0 cellspacing=0><tr><td colspan=2>'+otherInfo+'</td></tr></table>'));
}

var point = new google.maps.LatLng(plat,plng);	 
const marker = new google.maps.Marker({
	position:point,
    map,
});	 
	 
console.log("lATLONG"+ point);
google.maps.event.addListener(marker, 'click', (function (marker, i) {
var infowindow = new google.maps.InfoWindow({
content: basicInfo
});

return function () {                   
infowindow.open(map, marker);
}
})(marker, i));
 
  				
}
// #################    Create Marker ####################




// #################    Create Sidebar Entry ####################
    function createSidebarEntry(marker, name, address, distance, logo, city, state, pinNo) {
      var div = document.createElement('div');
	  div.style.backgroundColor = '#FFFFFF';
      //var html = '<span class=icon_img>'+ logo+'<strong>' + name + '</strong>' + address + '</span>';
      var html = '<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="padding:15px; border-bottom:1px solid #0E590A;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="padding-right:10px; width:32px;">'+logo+'</td><td><strong style="color:#084c85; font-weight:bold; text-transform:uppercase; text-decoration:underline; display:block; padding-bottom:5px;">'+name+'</strong>'+address+', '+city+', '+state+', '+pinNo+'</td></tr></table></td></tr></table>';
		
      div.innerHTML = html;
      div.style.cursor = 'pointer';
      div.style.marginBottom = '';
   google.maps.event.addDomListener(div, 'click', function() {
        google.maps.event.trigger(marker, 'click');
        div.style.backgroundColor = '#E8FCE7';
      });
    google.maps.event.addDomListener(div, 'mouseover', function() {
        div.style.backgroundColor = '#E8FCE7';
		//document.getElementById("mylisting").setAttribute("class", "over");

      });
     google.maps.event.addDomListener(div, 'mouseout', function() {
        div.style.backgroundColor = '#FFFFFF';
		//document.getElementById("mylisting").setAttribute("class", "out");
      });
      return div;
    }
    //]]>

// #################    Create Sidebar Entry ####################


function keywordsearch()
{
if(navigator.appName == "Microsoft Internet Explorer")
{
document.getElementById("key").setAttribute("className", "nav_link_active");
document.getElementById("pin").setAttribute("className", "nav_link");
document.getElementById("cs").setAttribute("className", "nav_link");
}
else
{
document.getElementById("key").setAttribute("class", "nav_link_active");
document.getElementById("pin").setAttribute("class", "nav_link");
document.getElementById("cs").setAttribute("class", "nav_link");
}

document.getElementById('addressInput').value="";
document.getElementById('pincode').value="";
document.getElementById('stateid').value="";
document.getElementById('city').value="";

document.getElementById('keywords').style.display="block";
document.getElementById('pincodes').style.display="none";
document.getElementById('citys').style.display="none";
}

function pincodesearch()
{
if(navigator.appName == "Microsoft Internet Explorer")
{
document.getElementById("key").setAttribute("className", "nav_link");
document.getElementById("pin").setAttribute("className", "nav_link_active");
document.getElementById("cs").setAttribute("className", "nav_link");
}
else
{
document.getElementById("key").setAttribute("class", "nav_link");
document.getElementById("pin").setAttribute("class", "nav_link_active");
document.getElementById("cs").setAttribute("class", "nav_link");
}

document.getElementById('addressInput').value="";
document.getElementById('pincode').value="";
document.getElementById('stateid').value="";
document.getElementById('city').value="";

document.getElementById('keywords').style.display="none";
document.getElementById('pincodes').style.display="block";
document.getElementById('citys').style.display="none";
}

function citysearch()
{
if(navigator.appName == "Microsoft Internet Explorer")
{
document.getElementById("key").setAttribute("className", "nav_link");
document.getElementById("pin").setAttribute("className", "nav_link");
document.getElementById("cs").setAttribute("className", "nav_link_active");
}
else
{
document.getElementById("key").setAttribute("class", "nav_link");
document.getElementById("pin").setAttribute("class", "nav_link");
document.getElementById("cs").setAttribute("class", "nav_link_active");
}


document.getElementById('addressInput').value="";
document.getElementById('pincode').value="";
document.getElementById('stateid').value="";
document.getElementById('city').value="";

document.getElementById('keywords').style.display="none";
document.getElementById('pincodes').style.display="none";
document.getElementById('citys').style.display="block";
}

