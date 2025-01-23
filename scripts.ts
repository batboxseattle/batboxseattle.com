import "./collage-images";
import { initializeHideButton } from "./hide-button";
import $ from "jquery";
import "./shows";
import "./initialize-swiper";
import "./header/header";

window.addEventListener("load", () => {
  $("#footer").load("footer.html");
  $("#spotify-widget").load("spotify-widget.html", () => {
    initializeHideButton();
  });
});
