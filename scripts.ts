import "./collage-images.ts";
import { initializeHideButton } from "./hide-button";
import $ from "jquery";
import "./shows.ts";
import "./initialize-swiper";

window.onload = (): void => {
  $("#footer").load("footer.html");
  $("#header").load("header.html");
  $("#spotify-widget").load("spotify-widget.html", () => {
    initializeHideButton();
  });
};
