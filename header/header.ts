import $ from "jquery";

try {
  window.addEventListener("load", () => {
    $("#header").load("header/header.html", () => {
      setUpHeader();
    });
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
  }
}

try {
  window.addEventListener("resize", async (): Promise<void> => {
    await toggleHeaderIfNeeded();
  });
} catch (error: unknown) {
  if (error instanceof Error) {
    alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
  }
}

function setUpHeader() {
  try {
    const stylesheetLink = document.getElementById("header-stylesheet-link");
    if (!stylesheetLink) {
      return;
    }
    stylesheetLink.onload = async () => {
      await resizeHeaderLogo();
      initializeHamburgerMenuButton();
      await toggleHeaderIfNeeded();
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
    }
  }
}

async function resizeHeaderLogo() {
  try {
    const headerLogo = document.getElementById("header-logo");
    const headerLink = document.querySelectorAll(".header-link")[1]; // the first one is the logo itself. second one is fine
    if (!headerLogo || !headerLink) {
      return;
    }

    headerLogo.style.height = `${headerLink.clientHeight - getTotalVerticalPadding(headerLink)}px`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
    }
  }
}

function initializeHamburgerMenuButton() {
  try {
    const hamburgerMenuButton = document.getElementById(
      "hamburger-menu-button",
    );
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const hamburgerMenuContainer = document.getElementById(
      "hamburger-menu-container",
    );
    if (!hamburgerMenuButton || !hamburgerMenu || !hamburgerMenuContainer) {
      return;
    }

    hamburgerMenuButton.addEventListener("click", () => {
      try {
        if (hamburgerMenu.classList.contains("hide")) {
          hamburgerMenu.style.maxHeight = `${hamburgerMenuContainer.scrollHeight + getTotalVerticalPadding(hamburgerMenuContainer)}px`;
          hamburgerMenu.classList.remove("hide");
        } else {
          hamburgerMenu.style.maxHeight = "0";
          hamburgerMenu.classList.add("hide");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
        }
      }
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
    }
  }
}

async function toggleHeaderIfNeeded() {
  try {
    const headerNav = document.querySelector(".header-nav");
    const hamburgerMenuButton = document.getElementById(
      "hamburger-menu-button",
    );
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
    }
  }
}

function getTotalVerticalPadding(element: Element): number {
  try {
    const computedStyle = getComputedStyle(element);
    return (
      (parseFloat(computedStyle.paddingTop) || 0) +
      (parseFloat(computedStyle.paddingBottom) || 0)
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      alert(`Error: ${error.message}\nStack Trace: ${error.stack}`);
    }
    throw error;
  }
}
