// ==UserScript==
// @name         Jira Tasks Link Copying
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds button allowing to copy tasks' links
// @author       Łukasz Brzózko
// @match        https://jira.nd0.pl/*
// @exclude      https://jira.nd0.pl/plugins/servlet/*
// @icon         https://jira.nd0.pl/s/a3v501/940003/1dlckms/_/images/fav-jsw.png
// @resource styles    https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-link-copying/main/dist/styles.css
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-link-copying/main/dist/index.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-link-copying/main/dist/index.user.js
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
  const SELECTORS = {
    linksContainer: ".search-results",
    link: ".search-results .issue-list .splitview-issue-link",
    jqlTextArea: "textarea#advanced-search",
  };

  const MAX_ATTEMPTS = 5;

  let attempts = 0;

  const linkStyles = async () => {
    const myCss = GM_getResourceText("styles");
    const styleTag = document.createElement("style");
    styleTag.textContent = myCss;

    document.body.prepend(styleTag);
  };

  const createNewLinks = (links) => {
    const newLinks = links.map((link) => {
      const { href } = link;
      const linkName = link.querySelector(".issue-link-key").textContent;
      const newLi = document.createElement("li");
      const newLink = document.createElement("a");
      newLink.href = href;
      newLink.textContent = linkName;
      newLi.appendChild(newLink);

      return newLi;
    });

    return newLinks;
  };

  const createClipBoardItem = ({ newLinks, filterUrl }) => {
    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob([filterUrl], { type: "text/plain" }),
      "text/html": new Blob(
        [`<ol>${newLinks.map(({ outerHTML }) => outerHTML).join("")}</ol>`],
        { type: "text/html" }
      ),
    });

    return clipboardItem;
  };

  const toggleIconsVisibility = ({ button, copyIcon, successIcon }) => {
    button.classList.toggle("active");
    copyIcon.classList.toggle("invisible");
    successIcon.classList.toggle("invisible");
  };

  const getFilterUrl = () => {
    const jqlTextArea = document.querySelector(SELECTORS.jqlTextArea);
    const url = new URL("https://jira.nd0.pl/issues/");

    url.searchParams.set("jql", jqlTextArea.value);

    return url.toString();
  };

  const copyLinksIntoClipboard = (e) => {
    const links = [...document.querySelectorAll(SELECTORS.link)];
    const { currentTarget: button } = e;
    const newLinks = createNewLinks(links);
    const filterUrl = getFilterUrl();
    const clipboardItem = createClipBoardItem({ newLinks, filterUrl });

    navigator.clipboard.write([clipboardItem]);

    const copyIcon = button.querySelector(".js-copy-icon");
    const successIcon = button.querySelector(".js-copy-success");

    toggleIconsVisibility({ button, copyIcon, successIcon });

    setTimeout(() => {
      toggleIconsVisibility({ button, copyIcon, successIcon });
    }, 3000);
  };

  const generateBtn = () => {
    const btnContainer = document.querySelector(
      ".simple-issue-list .pagination-view"
    );

    if (!btnContainer) return;

    const btnEl = document.createElement("button");
    btnEl.className = "copy-to-clipboard-btn";
    btnEl.title = "Copy to clipboard";
    btnEl.innerHTML = `
      <span class="copy-icon js-copy-icon aui-icon aui-icon-small aui-iconfont-copy" role="img" aria-label="Insert meaningful text here for accessibility"></span>
      <span class="copy-icon copy-icon--success js-copy-success invisible aui-icon aui-icon-small aui-iconfont-check" role="img" aria-label="Insert meaningful text here for accessibility"></span>
    `;
    btnEl.addEventListener("click", (e) => copyLinksIntoClipboard(e));

    btnContainer.appendChild(btnEl);
  };

  const init = () => {
    const links = document.querySelectorAll(SELECTORS.link);
    if (links.length > 0) {
      linkStyles();
      generateBtn();
    } else if (attempts === MAX_ATTEMPTS) {
      return console.error("Brak kontenera.");
    } else {
      attempts++;
      setTimeout(init, 1000);
    }
  };

  init();
})();
