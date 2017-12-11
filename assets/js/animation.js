/* In charge of loading animations on load. */

document.body.classList.add('js-loading');
var loader = document.getElementsByClassName('loader_container')[0];

window.addEventListener("load", showPage);

function showPage() {
  document.body.classList.remove('js-loading');
}

function fadeOutLoader() {
  loader.style.opacity = '0';
  setTimeout(function(){loader.parentNode.removeChild(loader);}, 1000);
}

window.onload = function () { fadeOutLoader(); }