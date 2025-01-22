import "./collage-images.ts";
import { initializeHideButton } from "./hide-button";
import $ from "jquery";
import "./shows.ts";
import "./initialize-swiper";
import {
  initializeHamburgerMenuButton,
  resizeHeaderLogo,
  toggleHeaderIfNeeded,
} from "./header";

window.onload = (): void => {
  $("#footer").load("footer.html");
  $("#header").load("header.html", async () => {
    await resizeHeaderLogo();
    initializeHamburgerMenuButton();
    toggleHeaderIfNeeded();
  });
  $("#spotify-widget").load("spotify-widget.html", () => {
    initializeHideButton();
  });
};

window.onresize = (): void => {
  toggleHeaderIfNeeded();
};
