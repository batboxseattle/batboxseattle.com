import $ from "jquery";

window.addEventListener("load", () => {
  $("#header").load("header.html", () => {
    setUpHeader();
  });
});

window.addEventListener("resize", async (): Promise<void> => {
  await toggleHeaderIfNeeded();
});

function setUpHeader() {
  const stylesheetLink = document.getElementById("header-stylesheet-link");
  if (!stylesheetLink) {
    return;
  }
  stylesheetLink.onload = async () => {
    await resizeHeaderLogo();
    initializeHamburgerMenuButton();
    await toggleHeaderIfNeeded();
  };
}

async function resizeHeaderLogo() {
  const headerLogo = document.getElementById("header-logo");
  const headerLink = document.querySelectorAll(".header-link")[1]; // the first one is the logo itself. second one is fine
  if (!headerLogo || !headerLink) {
    return;
  }

  headerLogo.style.height = `${headerLink.clientHeight - getTotalVerticalPadding(headerLink)}px`;
}

function initializeHamburgerMenuButton() {
  const hamburgerMenuButton = document.getElementById("hamburger-menu-button");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const hamburgerMenuContainer = document.getElementById(
    "hamburger-menu-container",
  );
  if (!hamburgerMenuButton || !hamburgerMenu || !hamburgerMenuContainer) {
    return;
  }

  hamburgerMenuButton.addEventListener("click", () => {
    if (hamburgerMenu.classList.contains("hide")) {
      hamburgerMenu.style.maxHeight = `${hamburgerMenuContainer.scrollHeight + getTotalVerticalPadding(hamburgerMenuContainer)}px`;
      hamburgerMenu.classList.remove("hide");
    } else {
      hamburgerMenu.style.maxHeight = "0";
      hamburgerMenu.classList.add("hide");
    }
  });
}

async function toggleHeaderIfNeeded() {
  const headerNav = document.querySelector(".header-nav");
  const hamburgerMenuButton = document.getElementById("hamburger-menu-button");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");
  const socialLinks = document.getElementById("social-links");

  if (
    !headerNav ||
    !hamburgerMenuButton ||
    !hamburgerMenu ||
    !navLinks ||
    !socialLinks
  ) {
    return;
  }

  const areLinksHidden =
    navLinks.classList.contains("hide") ||
    socialLinks.classList.contains("hide");

  // temporarily show the navLinks to measure full width
  if (areLinksHidden) {
    navLinks.classList.remove("hide");
    socialLinks.classList.remove("hide");
  }
  const fullWidth = headerNav.scrollWidth;

  // restore the original state
  if (areLinksHidden) {
    navLinks.classList.add("hide");
    socialLinks.classList.add("hide");
  }

  if (!areLinksHidden && fullWidth > window.innerWidth) {
    hamburgerMenuButton.classList.remove("hide");
    navLinks.classList.add("hide");
    socialLinks.classList.add("hide");
  } else if (areLinksHidden && fullWidth <= window.innerWidth) {
    hamburgerMenuButton.classList.add("hide");
    navLinks.classList.remove("hide");
    socialLinks.classList.remove("hide");
    hamburgerMenu.style.maxHeight = "0";
    hamburgerMenu.classList.add("hide");
  }
}

function getTotalVerticalPadding(element: Element): number {
  const computedStyle = getComputedStyle(element);
  return (
    (parseFloat(computedStyle.paddingTop) || 0) +
    (parseFloat(computedStyle.paddingBottom) || 0)
  );
}
