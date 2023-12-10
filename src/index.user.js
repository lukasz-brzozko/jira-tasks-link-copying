// ==UserScript==
// @name         Jira tasks link copying
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Creates a new userscript
// @author       Łukasz Brzózko
// @match        https://jira.nd0.pl/browse/*
// @icon         https://jira.nd0.pl/s/a3v501/940003/1dlckms/_/images/fav-jsw.png
// @resource styles    https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-link-copying/main/dist/styles.css
// @updateURL    https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-link-copying/main/dist/index.meta.js
// @downloadURL  https://raw.githubusercontent.com/lukasz-brzozko/jira-tasks-link-copying/main/dist/index.user.js
// @grant        none
// ==/UserScript==

(function () {
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

  const createClipBoardItem = (newLinks) => {
    const clipboardItem = new ClipboardItem({
      "text/plain": new Blob(
        [
          `<ul>${newLinks
            .map(({ textContent }) => textContent)
            .join(" ")}</ul>`,
        ],
        { type: "text/plain" }
      ),
      "text/html": new Blob(
        [`<ul>${newLinks.map(({ outerHTML }) => outerHTML).join(" ")}</ul>`],
        { type: "text/html" }
      ),
    });

    return clipboardItem;
  };

  const copyLinksIntoClipboard = (links) => {
    const newLinks = createNewLinks(links);
    const clipboardItem = createClipBoardItem(newLinks);

    navigator.clipboard.write([clipboardItem]);
  };

  const generateBtn = (links) => {
    const btnContainer = document.querySelector(
      ".simple-issue-list .pagination-view"
    );

    if (!btnContainer) return;

    const btnEl = document.createElement("button");
    btnEl.className = "copy-to-clipboard-btn";
    btnEl.innerHTML = "&#128203";
    btnEl.addEventListener("click", () => copyLinksIntoClipboard(links));

    btnContainer.appendChild(btnEl);
  };

  const init = () => {
    console.clear();
    console.log("init");
    const links = [
      ...document.querySelectorAll(
        ".search-results .issue-list .splitview-issue-link"
      ),
    ];

    if (links.length > 0) {
      generateBtn(links);
    } else {
      setTimeout(init, 1000);
    }
  };

  init();
})();
