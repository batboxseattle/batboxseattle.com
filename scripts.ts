import "./collage-images";
import { initializeHideButton } from "./hide-button";
import $ from "jquery";
import "./shows";
import "./initialize-swiper";
import "./header/header";
import "./footer/footer";

window.addEventListener("load", () => {
  $("#spotify-widget").load("spotify-widget.html", () => {
    initializeHideButton();
  });
});
