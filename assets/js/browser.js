/* 
 * In charge of checking browser type - returns true if it's:
 * - Chrome
 * - Safari
 * - Firefox
 * - Edge
 * - Internet Explorer 9 and above
 *
 * Otherwise false is returned.
 */
function isCompatBrowser() {
  var ua = window.navigator.userAgent;

  var msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    var ie_version = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);

    // If > IE 9+ => true. else => false.
    if (ie_version == '9' || ie_version == '10') return true;
    return false;
  }

  var trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11
    return true;
  }

  var edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+)
    return true;
  }

  var chrome = ua.indexOf('Chrome/');
  if (chrome > 0) {
    // Chrome
    return true;
  }

  var safari = ua.indexOf('Safari/');
  if (safari > 0) {
    // Safari
    return true;
  }

  var firefox = ua.indexOf('Firefox/');
  if (firefox > 0) {
    // Firefox
    return true;
  }

  // other browser
  return false;
}