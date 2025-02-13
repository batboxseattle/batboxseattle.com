import "./carousel/initialize-carousel";
import "./footer/footer";
import "./header/header";
import "./icon/load-icons";
import "./image-collage/image-collage";
import "./player/spotify-widget";
import "./shows/shows";

export function logDebug(message: unknown) {
  const panel = document.getElementById("debug-panel");
  if (panel) {
    panel.innerHTML += `<div>${message}</div>`;
  }
}

window.addEventListener("error", (event) => {
  logDebug(event);
});
