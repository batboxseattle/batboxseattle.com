import $ from "jquery";
import { logDebug } from "../scripts";

window.addEventListener("load", () => {
  $("#header").load("header/header.html", () => {
    logDebug("HERE 1");
    setUpHeader();
  });
});

window.addEventListener("resize", async (): Promise<void> => {
  logDebug("HERE 2");
  await toggleHeaderIfNeeded();
});

function setUpHeader() {
  logDebug("HERE 3");
  const stylesheetLink = document.getElementById("header-stylesheet-link");
  if (!stylesheetLink) {
    return;
  }
  logDebug("HERE 4");
  stylesheetLink.onload = async () => {
    logDebug("HERE 5");
    await resizeHeaderLogo();
    initializeHamburgerMenuButton();
    await toggleHeaderIfNeeded();
    logDebug("HERE 6");
  };
}

async function resizeHeaderLogo() {
  logDebug("HERE 7");
  const headerLogo = document.getElementById("header-logo");
  const headerLink = document.querySelectorAll(".header-link")[1]; // the first one is the logo itself. second one is fine
  if (!headerLogo || !headerLink) {
    return;
  }

  logDebug("HERE 8");

  headerLogo.style.height = `${headerLink.clientHeight - getTotalVerticalPadding(headerLink)}px`;

  logDebug("HERE 9");
}

function initializeHamburgerMenuButton() {
  logDebug("HERE 10");
  const hamburgerMenuButton = document.getElementById("hamburger-menu-button");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const hamburgerMenuContainer = document.getElementById(
    "hamburger-menu-container",
  );
  if (!hamburgerMenuButton || !hamburgerMenu || !hamburgerMenuContainer) {
    return;
  }

  logDebug("HERE 11");

  hamburgerMenuButton.addEventListener("click", () => {
    logDebug("HERE 12");
    if (hamburgerMenu.classList.contains("hide")) {
      hamburgerMenu.style.maxHeight = `${hamburgerMenuContainer.scrollHeight + getTotalVerticalPadding(hamburgerMenuContainer)}px`;
      hamburgerMenu.classList.remove("hide");
    } else {
      hamburgerMenu.style.maxHeight = "0";
      hamburgerMenu.classList.add("hide");
    }
    logDebug("HERE 13");
  });

  logDebug("HERE 14");
}

async function toggleHeaderIfNeeded() {
  logDebug("HERE 15");
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

  logDebug("HERE 16");

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

  logDebug("HERE 17");

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

  logDebug("HERE 18");
}

function getTotalVerticalPadding(element: Element): number {
  const computedStyle = getComputedStyle(element);
  return (
    (parseFloat(computedStyle.paddingTop) || 0) +
    (parseFloat(computedStyle.paddingBottom) || 0)
  );
}
