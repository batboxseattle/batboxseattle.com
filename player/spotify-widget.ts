import $ from "jquery";

window.addEventListener("load", () => {
  $(".spotify-widget").load("player/spotify-widget.html", () => {
    initializeHideButton();
    const stylesheetLink = document.getElementById("spotify-widget-stylesheet-link");
    if (!stylesheetLink) {
      return;
    }
    stylesheetLink.addEventListener("load", () => {
      resizeSpotifyPlayerIfNeeded();
      window.addEventListener("resize", async (): Promise<void> => {
        resizeSpotifyPlayerIfNeeded();
      });
    })
  });
});

function updateButtonText(button: HTMLElement, isHidden: boolean) {
  button.textContent = isHidden ? "Show Spotify player" : "Hide Spotify player";
}

function initializeHideButton() {
  const button = document.getElementById("hide-button");
  const spotifyPlayer = document.getElementById("spotify-player");

  const savedState = localStorage.getItem("spotifyPlayerVisible");

  if (spotifyPlayer && button) {
    if (savedState === "hidden") {
      spotifyPlayer.style.display = "none";
      updateButtonText(button, true);
    } else {
      spotifyPlayer.style.display = "block";
      updateButtonText(button, false);
    }
  }

  button?.addEventListener("click", () => {
    if (spotifyPlayer) {
      if (spotifyPlayer.style.display === "none") {
        spotifyPlayer.style.display = "block";
        updateButtonText(button, false);
        localStorage.setItem("spotifyPlayerVisible", "visible");
      } else {
        spotifyPlayer.style.display = "none";
        updateButtonText(button, true);
        localStorage.setItem("spotifyPlayerVisible", "hidden");
      }
    }
  });
}

function resizeSpotifyPlayerIfNeeded() {
  const spotifyPlayer = document.getElementById("spotify-player");
  if (!spotifyPlayer) {
    return;
  }

  // temporarily remove maxHeight to measure the natural height
  spotifyPlayer.style.maxHeight = "none";
  const naturalHeight = spotifyPlayer.clientHeight;
  if (naturalHeight < 152) {
    spotifyPlayer.style.maxHeight = "80px";
  } else if (naturalHeight < 352) {
    spotifyPlayer.style.maxHeight = "152px";
  }
}
