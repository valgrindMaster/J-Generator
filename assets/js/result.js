// Redirect if browser not compatible with site.
if (isCompatBrowser() === false) {
  alert("This browser is incapable of rendering certain elements on this site. Please download a newer browser.");
  window.location = "https://goo.gl/xhszUW";
}

// Gather Cookies.
var era = GetCookie('Era');
var tonality = GetCookie('Tonality');
var intensity = GetCookie('Intensity');
var name = GetCookie('artist_name');
var sample = GetCookie('artist_sample');
var count = GetCookie('hit_count');

// Setup Wiki Query endpoint via proxy.
var base_url = 'http://serenity.ist.rit.edu/~olh5363/project_1/Ajfdi34HFaa/assets/js/proxy/proxy.php?format=xml&filename=';
var wiki_api_endpoint = encodeURIComponent('https://en.wikipedia.org/w/api.php?action=query&format=xml&prop=extracts|info&inprop=url&titles=' + encodeURIComponent(name) + '&redirects=1&exsentences=10&exlimit=1');
var full_url = base_url + wiki_api_endpoint;

// Gets first and last name from stored procedure.
var user_fname;
var user_lname;
if (typeof(Storage) !== "undefined") {
  var loc_fname = localStorage.getItem("firstname");
  var loc_lname = localStorage.getItem("lastname");
  user_fname = loc_fname == null ? "" : " " + loc_fname;
  user_lname = loc_lname == null ? "" : " " + loc_lname;
} else {
  alert("This browser is not equipped with local storage capabilities - please download a browser that is to use this feature.");
  window.location = "https://goo.gl/xhszUW";
}

// Setup banner text
var p1 = document.createElement('p');
var p2 = document.createElement('p');
var welcome = document.createTextNode("Welcome" + user_fname + user_lname + "! You are visiter number " + count + " on this browser.");
var qualities = document.createTextNode("Era => " + era + ", Tonality => " + tonality + ", Intensity => " + intensity);
p1.appendChild(welcome);
p2.appendChild(qualities);
document.getElementById('scroller_welcome').appendChild(p1);
document.getElementById('scroller_qualities').appendChild(p2);

// Set background image on left.
var div_background = document.getElementById('div_absolute');
div_background.style.background = "url('assets/media/" + name.toLowerCase() + ".png') no-repeat center center";
div_background.style.backgroundSize = "cover";

// Setup h2 with artist name.
var header_text = document.createTextNode(name);
var h1 = document.createElement("h1");
h1.appendChild(header_text);

var header_container = document.getElementById("artist_header");
header_container.style.padding = "5px";
header_container.appendChild(h1);

// Set iframe video src.
document.getElementById('video').src = sample;

// Returns user to home page to begin processes again.
function restart() {
  window.location = "index.html";
}

// Used to recursively add line breaks to formulate paragraphs.
function myLoop(x) {
  var i, y, xLen, txt;
  txt = "";
  x = x.childNodes;
  xLen = x.length;
  for (i = 0; i < xLen ;i++) {
    y = x[i];
    if (y.nodeType != 3) {
      if (y.childNodes[0] != undefined) {
        txt += myLoop(y);
      }
    } else {
    txt += y.nodeValue + "<br>";
    }
  }
  return txt;
}

// Sends request by proxy to wiki endpoint. Populates page with response.
function request() {
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {

    // If request successful...
    if (request.readyState == 4 && request.status == 200) {
      var wikidiv = document.getElementById('wikidiv');
      
      var txt, parser, xmlDoc;
      txt = request.responseText;
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(txt,"text/xml");

      // Populate page with response.
      wikidiv.innerHTML = myLoop(xmlDoc.documentElement);

      var seeMoreLink = document.createElement('a');
      var page = xmlDoc.getElementsByTagName('page')[0];
      seeMoreLink.href = page.getAttribute('fullurl');
      seeMoreLink.target = "_blank";
      seeMoreLink.text = "Continue Reading";

      // Style article.
      seeMoreLink.style.textDecoration = "none";
      seeMoreLink.style.color = "#f4511e";
      seeMoreLink.style.padding = "5px 10px";
      seeMoreLink.style.border = "1px solid #f4511e";

      // Set action listeners.
      seeMoreLink.addEventListener("mouseenter", function (event) {
        event.target.style.color = "#963212";
        event.target.style.border = "1px solid #963212";
        event.target.style.borderRadius = "10px";
        event.target.style.transition = "1s";
      });

      seeMoreLink.addEventListener("mouseleave", function (event) {
        event.target.style.color = "#f4511e";
        event.target.style.border = "1px solid #f4511e";
        event.target.style.borderRadius = "0";
        event.target.style.transition = "1s";
      });

      // Add full article link to DOM.
      wikidiv.appendChild(seeMoreLink);
    }
  }
  request.open("GET", full_url, true);
  request.send(null);
}

// Make the request.
request();