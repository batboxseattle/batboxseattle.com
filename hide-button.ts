function updateButtonText(button: HTMLElement, isHidden: boolean) {
  button.textContent = isHidden ? "Show Spotify player" : "Hide Spotify player";
}

export function initializeHideButton() {
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
