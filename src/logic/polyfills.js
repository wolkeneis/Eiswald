if (!Element.prototype.requestFullscreen) {
  Element.prototype.requestFullscreen =
    Element.prototype.mozRequestFullscreen ||
    Element.prototype.mozRequestFullScreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.webkitEnterFullscreen ||
    Element.prototype.webkitEnterFullScreen ||
    Element.prototype.msRequestFullscreen;
}