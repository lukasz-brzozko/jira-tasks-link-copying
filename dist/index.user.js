function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// ==UserScript==
// @name         Userscript starter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creates a new userscript
// @author       Łukasz Brzózko
// @match        https://jira.nd0.pl/browse/*
// @icon         https://jira.nd0.pl/s/a3v501/940003/1dlckms/_/images/fav-jsw.png
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/userscript-starter/main/dist/index.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/userscript-starter/main/dist/index.user.js
// @grant        none
// ==/UserScript==
(function () {
  // setTimeout(() => {
  var links = _toConsumableArray(document.querySelectorAll(".search-results .issue-list .splitview-issue-link"));
  var searchResults = document.querySelector(".search-results");
  console.log({
    links: links,
    searchResults: searchResults
  });
  var newLinks = links.map(function (link) {
    var href = link.href;
    var linkName = link.querySelector(".issue-link-key").textContent;
    var newLink = document.createElement("a");
    newLink.href = href;
    newLink.textContent = linkName;
    return newLink;
  });
  var clipboardItems = new ClipboardItem({
    "text/plain": new Blob(["<ul><li>" + newLinks.map(function (_ref) {
      var textContent = _ref.textContent;
      return textContent;
    }).join("<li>") + "</ul>"], {
      type: "text/plain"
    }),
    "text/html": new Blob(["<ul><li>" + newLinks.map(function (_ref2) {
      var outerHTML = _ref2.outerHTML;
      return outerHTML;
    }).join("<li>") + "</ul>"], {
      type: "text/html"
    })
  });
  console.log({
    clipboardItems: clipboardItems
  });
  navigator.clipboard.write([clipboardItems]);

  // console.log({newLinks});

  // navigator.clipboard.writeText(newLinks[0]);
  // navigator.clipboard.read().then(text=>console.log(text))
  // }, 1000);
})();