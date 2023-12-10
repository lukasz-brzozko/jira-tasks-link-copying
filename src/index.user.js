(function () {
  const SELECTORS = {
    linksContainer: ".search-results",
    link: ".search-results .issue-list .splitview-issue-link",
  };

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

  const toggleIconsVisibility = ({ button, copyIcon, successIcon }) => {
    button.classList.toggle("active");
    copyIcon.classList.toggle("invisible");
    successIcon.classList.toggle("invisible");
  };

  const copyLinksIntoClipboard = ({ searchResults, e }) => {
    const links = [...searchResults.querySelectorAll(SELECTORS.link)];
    const { currentTarget: button } = e;
    const newLinks = createNewLinks(links);
    const clipboardItem = createClipBoardItem(newLinks);

    navigator.clipboard.write([clipboardItem]);

    const copyIcon = button.querySelector(".js-copy-icon");
    const successIcon = button.querySelector(".js-copy-success");

    toggleIconsVisibility({ button, copyIcon, successIcon });

    setTimeout(() => {
      toggleIconsVisibility({ button, copyIcon, successIcon });
    }, 3000);
  };

  const generateBtn = (searchResults) => {
    const btnContainer = document.querySelector(
      ".simple-issue-list .pagination-view"
    );

    if (!btnContainer) return;

    const btnEl = document.createElement("button");
    btnEl.className = "copy-to-clipboard-btn";
    btnEl.innerHTML = `
      <span class="copy-icon js-copy-icon">&#128203</span>
      <span class="copy-icon copy-icon--success js-copy-success invisible">&#10003</span>
    `;
    btnEl.addEventListener("click", (e) =>
      copyLinksIntoClipboard({ searchResults, e })
    );

    btnContainer.appendChild(btnEl);
  };

  const init = () => {
    const searchResults = document.querySelector(SELECTORS.linksContainer);
    if (!searchResults) return console.error("Brak kontenera.");

    const links = searchResults.querySelectorAll(SELECTORS.link);
    if (links.length > 0) {
      linkStyles();
      generateBtn(searchResults);
    } else {
      setTimeout(init, 1000);
    }
  };

  init();
})();
