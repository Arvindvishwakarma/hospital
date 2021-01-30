//Font Resizer js

var fontSize = 100;
jQuery(document).ready(function() {
    //alert("ok");
    if (_getCookie("fontSize") != null) {
        var fontSize = _getCookie("fontSize");
    } else {
        var fontSize = 100;
    }
    jQuery("body").css("font-size", fontSize + "%");
    // jQuery(".morenav_sec").css("font-size", fontSize + "%");
});

function _getCookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while (i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return _getCookieVal(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if (i == 0)
            break;
    }
    return null;
}

function _deleteCookie(name, path, domain) {
    if (_getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

function _setCookie(name, value, expires, path, domain, secure) {
    var vurl = true;
    if (path != '' && path != undefined) {
        vurl = validUrl(path);
    }
    if (jQuery.type(name) == "string" && vurl) {
        document.cookie = name + "=" + escape(value) +
            ((expires) ? "; expires=" + expires.toGMTString() : "") +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            ((secure) ? "; secure" : "");
    }
}

function _getCookieVal(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if (endstr == -1) { endstr = document.cookie.length; }
    return unescape(document.cookie.substring(offset, endstr));
}
/*********Font size resize**********/
function set_font_size(fontType) {
    if (fontType == "increase") {
        if (fontSize < 130) {
            fontSize = parseInt(fontSize) + 15;
        }
    } else if (fontType == "decrease") {
        if (fontSize > 70) {
            fontSize = parseInt(fontSize) - 15;
        }
    } else {
        fontSize = 100;
    }
    _setCookie("fontSize", fontSize);
    jQuery("body").css("font-size", fontSize + "%");
    //  jQuery(".morenav_sec").css("font-size", fontSize + "%");
}



var manual_or_random = "manual" //"manual" or "random"
var randomsetting = "3 days" //"eachtime", "sessiononly", or "x days (replace x with desired integer)". Only applicable if mode is random.

//////No need to edit beyond here//////////////

function getCookie(Name) {
    var re = new RegExp(Name + "=[^;]+", "i"); //construct RE to search for target name/value pair
    if (document.cookie.match(re)) //if cookie found
        return document.cookie.match(re)[0].split("=")[1] //return its value
    return null
}

function setCookie(name, value, days) {
    var expireDate = new Date()
        //set "expstring" to either future or past date, to set or delete cookie, respectively
    var expstring = (typeof days != "undefined") ? expireDate.setDate(expireDate.getDate() + parseInt(days)) : expireDate.setDate(expireDate.getDate() - 5)
    document.cookie = name + "=" + value + "; expires=" + expireDate.toGMTString() + "; path=/";
}

function deleteCookie(name) {
    setCookie(name, "moot")
}


function setStylesheet(title, randomize) { //Main stylesheet switcher function. Second parameter if defined causes a random alternate stylesheet (including none) to be enabled
    var i, cacheobj, altsheets = [""];
    if (setStylesheet.chosen)
        try {
            document.getElementsByTagName('head')[0].removeChild(setStylesheet.chosen);
        } catch (e) {}
    for (i = 0;
        (cacheobj = document.getElementsByTagName("link")[i]); i++) {
        if (cacheobj.getAttribute("rel").toLowerCase() == "alternate stylesheet" && cacheobj.getAttribute("title")) { //if this is an alternate stylesheet with title
            cacheobj.disabled = true
            altsheets.push(cacheobj) //store reference to alt stylesheets inside array
            if (cacheobj.getAttribute("title") == title) { //enable alternate stylesheet with title that matches parameter
                cacheobj.disabled = false //enable chosen style sheet
                setStylesheet.chosen = document.createElement('link'); //cloneNode(false);
                setStylesheet.chosen.rel = 'stylesheet';
                setStylesheet.chosen.type = 'text/css';
                if (cacheobj.media)
                    setStylesheet.chosen.media = cacheobj.media;
                setStylesheet.chosen.href = cacheobj.href;
                document.getElementsByTagName('head')[0].appendChild(setStylesheet.chosen);
            }
        }
    }
    if (typeof randomize != "undefined") { //if second paramter is defined, randomly enable an alt style sheet (includes non)
        var randomnumber = Math.floor(Math.random() * altsheets.length)
        altsheets[randomnumber].disabled = false
    }
    return (typeof randomize != "undefined" && altsheets[randomnumber] != "") ? altsheets[randomnumber].getAttribute("title") : "" //if in "random" mode, return "title" of randomly enabled alt stylesheet
}



function chooseStyle(styletitle, days) { //Interface function to switch style sheets plus save "title" attr of selected stylesheet to cookie
    //alert(styletitle);
    if (document.getElementById) {
        setStylesheet(styletitle)
        setCookie("mysheet", styletitle, days)
    }
}

function indicateSelected(element) { //Optional function that shows which style sheet is currently selected within group of radio buttons or select menu
    if (selectedtitle != null && (element.type == undefined || element.type == "select-one")) { //if element is a radio button or select menu
        var element = (element.type == "select-one") ? element.options : element
        for (var i = 0; i < element.length; i++) {
            if (element[i].value == selectedtitle) { //if match found between form element value and cookie value
                if (element[i].tagName == "OPTION") //if this is a select menu
                    element[i].selected = true
                else { //else if it's a radio button
                    element[i].checked = true
                }
                break
            }
        }
    }
}

if (manual_or_random == "manual") { //IF MANUAL MODE
    var selectedtitle = getCookie("mysheet")
    if (document.getElementById && selectedtitle != null) //load user chosen style sheet from cookie if there is one stored
        setStylesheet(selectedtitle)
} else if (manual_or_random == "random") { //IF AUTO RANDOM MODE
    if (randomsetting == "eachtime")
        setStylesheet("", "random")
    else if (randomsetting == "sessiononly") { //if "sessiononly" setting
        if (getCookie("mysheet_s") == null) //if "mysheet_s" session cookie is empty
            document.cookie = "mysheet_s=" + setStylesheet("", "random") + "; path=/" //activate random alt stylesheet while remembering its "title" value
        else
            setStylesheet(getCookie("mysheet_s")) //just activate random alt stylesheet stored in cookie
    } else if (randomsetting.search(/^[1-9]+ days/i) != -1) { //if "x days" setting
        if (getCookie("mysheet_r") == null || parseInt(getCookie("mysheet_r_days")) != parseInt(randomsetting)) { //if "mysheet_r" cookie is empty or admin has changed number of days to persist in "x days" variable
            setCookie("mysheet_r", setStylesheet("", "random"), parseInt(randomsetting)) //activate random alt stylesheet while remembering its "title" value
            setCookie("mysheet_r_days", randomsetting, parseInt(randomsetting)) //Also remember the number of days to persist per the "x days" variable
        } else
            setStylesheet(getCookie("mysheet_r")) //just activate random alt stylesheet stored in cookie
    }
}


jQuery(document).ready(function () {
    jQuery('#menu-item-278 > a, #menu-item-194 > a, #menu-item-192 >  a').click(function() { return false; });

    jQuery('.dark').click(function() {

        var thirtyDays = 1000 * 60 * 60 * 24 * 30;
        var expireDate = new Date((new Date()).valueOf() + thirtyDays);

        document.cookie = 'contrast' + "=" + 1 + "; expires=" + expireDate.toGMTString() + "; path=/";
        document.cookie = "username=John Doe";
        //var site_temp_uri = document.getElementById("site_url_js").value;
        $(".light").show();
        $(".dark").hide();
        jQuery('head').append('<link rel="stylesheet" type="text/css" media="screen" href="/assets/theme_font_changer/change.css">');
    });

    jQuery('.light').click(function() {

        var thirtyDays = 1000 * 60 * 60 * 24 * 30;
        var expireDate = new Date((new Date()).valueOf() + thirtyDays);

        document.cookie = 'contrast' + "=" + 0 + "; expires=" + expireDate.toGMTString() + "; path=/";

        $(".light").hide();
        $(".dark").show();

        jQuery("[href*='change.css']").remove();
    });

    if (getCookie('contrast') == "1") {
        //var site_temp_uri = document.getElementById("site_url_js").value;
        jQuery('head').append('<link rel="stylesheet" type="text/css" media="screen" href="/assets/theme_font_changer/change.css">');
    }



    if (getCookie('contrast') == "0") {
        jQuery("[href*='change.css']").remove();
    }

    /*-----------------------------
        	skip to main content
        ---------------------------------*/
    $("#skip_content").on('click', function(event) {

        // Make sure this.hash has a value before overriding default behavior
        if (this.hash !== "") {
            // Prevent default anchor click behavior
            event.preventDefault();

            // Store hash
            var hash = this.hash;

            // Using jQuery's animate() method to add smooth page scroll
            // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function() {

                // Add hash (#) to URL when done scrolling (default click behavior)
                window.location.hash = hash;
            });
        } // End if
    });


    //setInterval(checkTime(), 1000);

});