export async function resizeHeaderLogo() {
  const headerLogo = document.getElementById("header-logo");
  const headerLink = document.querySelectorAll(".header-link")[1]; // the first one is the logo itself. second one is fine
  if (!headerLogo || !headerLink) {
    return;
  }

  const headerLinkComputedStyle = getComputedStyle(headerLink);
  headerLogo.style.height = `${headerLink.clientHeight - (parseFloat(headerLinkComputedStyle.paddingTop) + parseFloat(headerLinkComputedStyle.paddingBottom))}px`;

  await new Promise((resolve) => setTimeout(resolve, 0));
}

export function toggleHeaderIfNeeded() {
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
    hamburgerMenuButton.style.display = "block";
    navLinks.classList.add("hide");
    socialLinks.classList.add("hide");
  } else if (areLinksHidden && fullWidth <= window.innerWidth) {
    hamburgerMenuButton.style.display = "none";
    navLinks.classList.remove("hide");
    socialLinks.classList.remove("hide");
    hamburgerMenu.style.maxHeight = "0";
    hamburgerMenu.classList.add("hide");
  }
}

export function initializeHamburgerMenuButton() {
  const hamburgerMenuButton = document.getElementById("hamburger-menu-button");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  if (!hamburgerMenuButton || !hamburgerMenu) {
    return;
  }

  hamburgerMenuButton.addEventListener("click", () => {
    if (hamburgerMenu.classList.contains("hide")) {
      hamburgerMenu.style.maxHeight = hamburgerMenu.scrollHeight + "px";
      hamburgerMenu.classList.remove("hide");
    } else {
      hamburgerMenu.style.maxHeight = "0";
      hamburgerMenu.classList.add("hide");
    }
  });
}
