// Redirect if browser not compatible with site.
if (isCompatBrowser() === false) {
	alert("This browser is incapable of rendering certain elements on this site. Please download a newer browser.");
	window.location = "https://goo.gl/xhszUW";
}

// Initialize to false. Set true in the event that user inputs their first and last name on the home screen.
SetCookie('isNameSet', false, expiry);

// JSON "tree" to be used for select traversal.
var tree = '{"name":"Era","next":"Era","value":[{"name":"Bebop","next":"Tonality","value":[{"name":"Consonant","next":"Intensity","value":[{"name":"High","next":"Artist","value":{"name":"Dizzy Gillespie","sample":"https://www.youtube.com/embed/7jrnihGqumE"}},{"name":"Low","next":"Artist","value":{"name":"Chet Baker","sample":"https://www.youtube.com/embed/BHsMXQRiapA"}}]},{"name":"Dissonant","next":"Intensity","value":[{"name":"High","next":"Artist","value":{"name":"Charles Mingus","sample":"https://www.youtube.com/embed/__OSyznVDOY"}},{"name":"Low","next":"Artist","value":{"name":"Thelonious Monk","sample":"https://www.youtube.com/embed/otnAqbFvbMw"}}]}]},{"name":"Cool","next":"Tonality","value":[{"name":"Consonant","next":"Intensity","value":[{"name":"High","next":"Artist","value":{"name":"Miles Davis","sample":"https://www.youtube.com/embed/cWGvsyeayFk"}},{"name":"Low","next":"Artist","value":{"name":"Dave Brubeck","sample":"https://www.youtube.com/embed/BU7uaiMaLds"}}]}]},{"name":"Modern","next":"Tonality","value":[{"name":"Consonant","next":"Intensity","value":[{"name":"High","next":"Artist","value":{"name":"Miguel Zenon","sample":"https://www.youtube.com/embed/ZHrcMCnjVKk"}},{"name":"Low","next":"Artist","value":{"name":"Nicholas Payton","sample":"https://www.youtube.com/embed/hTNYHbO_2WE"}}]},{"name":"Dissonant","next":"Intensity","value":[{"name":"High","next":"Artist","value":{"name":"Walter Smith III","sample":"https://www.youtube.com/embed/zWLXWND4qDQ"}},{"name":"Low","next":"Artist","value":{"name":"Kendrick Scott","sample":"https://www.youtube.com/embed/JYNsK1CFnvQ"}}]}]}]}';
var div_content_right = document.getElementsByClassName("right_content")[0]; // Top-level container for content.
var currentIndex; // Current location in the tree.
var div_center;   // Goes inside of div_content_right. All elements added to DOM via this.
var tree_obj;     // Global variable used to traverse JSON.
var category;     // The current category in tree_obj.
var select;       // Global select reused to house the latest select object.
var span;         // Global span reused to house the latest span object. Stores select inside of it.
var h2;           // Global header reused to house latest header associated with latest select.

// Initialize home page. Animate main content into view.
div_content_right.className += " right_content_anim_enter";
init();

/*
 * Initializes the tree on the first level. Sets up initial description and begin button.
 */
function init() {
	currentIndex = -1;

	// Init tree.
	tree_obj = JSON.parse(tree);
	category = tree_obj.name;

	// Header.
	var h2_intro = document.createElement("h2");
	var header_text = document.createTextNode("Select from a list of qualities that you look for in music, then enjoy listening to our pick for you. Learn more about the music while you’re at it.");
	h2_intro.appendChild(header_text);
	h2_intro.style.textAlign = "center";
	h2_intro.style.cursor = "default";

	// Begin button.
	var btn_intro = document.createElement("button");
	var btn_span_intro = document.createElement("span");
	var btn_span_p_intro = document.createTextNode("Begin ");
	btn_span_intro.appendChild(btn_span_p_intro);
	btn_intro.appendChild(btn_span_intro);
	btn_intro.className = "btn_orange div_center_horizontal";

	// Set begin button listeners.
	div_center = document.createElement("div");
	btn_intro.onclick = function() {
		emptyDivCenter();
		loadResetBtn();
		loadSelect();
	}

	// Add elements to DOM.
	div_center.className = "div_center";
	div_center.id = "div_welcome";
	div_center.appendChild(h2_intro);
	div_center.appendChild(btn_intro);
	div_content_right.appendChild(div_center);
}

// Create an H2 from the global category.
function createLabel() {
    var header_text = document.createTextNode(category);
	h2 = document.createElement("h2");
    h2.appendChild(header_text);
	h2.style.display = "inline";
}

// Add options to the global select from the past in collection.
function addOptions(children) {
	for (var i = 0; i < children.length; i++) {
		var option = createOption(children[i].name);
		select.add(option);
	}
}

// Create and return a single option with the text set to the passed in value.
function createOption(cat) {
	var opt = document.createElement("option");
	opt.text = cat;
	return opt;
}

// Create a select with the default blank option. Also generate its label and span container.
function createSelect() {

	// Create select with unique id.
	select = document.createElement("select");
	select.style.display = "inline";
	select.style.padding = "5px";
	select.id = ++currentIndex;
	
	// Default blank option. Set to selected and disabled.
	var option = createOption(" ");
	option.selected = true;
	option.disabled = true;
	select.add(option);

	// Create accompanying label.
	createLabel();

	// Add label and select to new span. Add fade in animation.
	span = document.createElement("span");
	span.appendChild(h2);
	span.appendChild(select);
	span.className = "fade-in";

	// Set action listeners.
	select.onmouseover = function() {
		h2.style.color = "#f4511e";
		h2.style.transition = "0.5s";
	};

	select.onmouseout = function() {
		h2.style.color = "#000000";
		h2.style.transition = "0.5s";
	};

	select.onchange = function(event) {
		// Get the id of the user-altered select to generate the next branch in the right place.
		var target = event.target || event.srcElement;
		nextBranch(parseInt(target.id));
	};
}

/* 
 * Moves to appropriate index in tree and either:
 * - Displays results if questionnare has been finished OR
 * - Loads the next select.
 */
function nextBranch(id) {
	moveToIndex(id);
	var currentSelect = getSelect(id);
	if (!Array.isArray(tree_obj.value)) displayResults();
	else if (currentSelect.selectedIndex > 0) loadSelect();
}

// Traverses tree to the select with the passed in id. Removes all selects following it.
function moveToIndex(id) {
	removeNodeChildren(div_center, id + 1, true);
	currentIndex = id;

	tree_obj = JSON.parse(tree);
	var children = div_center.children;
	for (var i = 0; i < children.length - 1; i++) {
		tree_obj = tree_obj.value[children[i].lastChild.selectedIndex - 1];
		var name = children[i].lastChild.options[children[i].lastChild.selectedIndex].text;
		category = children[i].firstChild.innerHTML;
		SetCookie(category, name, expiry);
	}

	category = tree_obj.next;
}

// Increase hit count cookie, updte artist name and youtube video sample cookies, and relocate to results page.
function displayResults() {
	if(GetCookie('hit_count') == null) {
		SetCookie('hit_count','1');
	} else {
		var getHits = GetCookie('hit_count');
		SetCookie('hit_count', parseInt(GetCookie('hit_count')) + 1);			
	}

	SetCookie('artist_name', tree_obj.value.name, expiry);
	SetCookie('artist_sample', tree_obj.value.sample, expiry);

	window.location = "result.html";
}

// Removes all children from div_center.
function emptyDivCenter() {
	removeNodeChildren(div_center, 0, false);
}

// Create button that will restart the select process altogether.
function loadResetBtn() {
	var btn_reset = document.createElement("button");
	btn_reset.className = "btn_reset fade-in";
	btn_reset.innerHTML = "Reset";
	btn_reset.onclick = function() {
		reset();
	};

	div_center.appendChild(btn_reset);
}

// Creates a new select, adds all options from current point in tree, and adds to div_center.
function loadSelect() {
	createSelect();
	addOptions(tree_obj.value);
	div_center.insertBefore(span, div_center.lastChild);
}

// Returns the select matching the passed in id, otherwise returns -1.
function getSelect(id) {
	var children = div_center.children;
	for (var i = 0; i < children.length - 1; i++) {
		if (children[i].lastChild.id == id) return children[i].lastChild;
	}

	return -1;
}

// Removes element children from specified start index. Leaves reset button if true.
function removeNodeChildren(element, startIndex, leaveReset) {
	var children = element.children;
	if (children.length == 0) return;

	for (var i = startIndex; i < children.length; i++) {
		removeNodeChildren(children[i], startIndex, leaveReset);
		if (i == children.length - 1 && leaveReset) break;
		element.removeChild(children[i--]);
	}
}

// Empties div_center and reinitializes the select process.
function reset() {
	removeNodeChildren(div_center, 0, false);
	init();
}

// Popup form to get user first and last name.
function popup() {
	if (typeof(Storage) === "undefined") {
		alert("This browser is not equipped with local storage capabilities - please download a browser that is to use this feature.");
	    window.location = "https://goo.gl/xhszUW";
	    return;
	}
	
    var popup = document.getElementById("myPopup");

	if (popup.classList) { 
	    popup.classList.toggle("show");
	} else {
	    // For IE9
	    var classes = popup.className.split(" ");
	    var i = classes.indexOf("show");

	    if (i >= 0) 
	        classes.splice(i, 1);
	    else 
	        classes.push("show");
	        popup.className = classes.join(" "); 
	}
}

// onsubmit for the form in index.html. First and last name stored in local storage.
function formSubmit() {
    var fname = document.forms["user_name"]["fname"].value;
    var lname = document.forms["user_name"]["lname"].value;
    if (fname == "" || lname == "") {
        alert("First and last name must be entered.");
        return false;
    } else {
    	if (typeof(Storage) !== "undefined") {
    		localStorage.setItem("firstname", fname);
    		localStorage.setItem("lastname", lname);
	    	alert("Thank you. Name has be been stored locally to your browser.");
	    	SetCookie('isNameSet', true, expiry);
	    	return true;
		} else {
			alert("This browser is not equipped with local storage capabilities - please download a browser that is to use this feature.");
		    window.location = "https://goo.gl/xhszUW";
		}
    }
}