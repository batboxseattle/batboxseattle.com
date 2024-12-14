document.addEventListener('DOMContentLoaded', (event) => {
    // Get references to the button and the element
    const button = document.getElementById('hideButton') as HTMLButtonElement | null;
    const spotifyPlayer = document.getElementById('spotifyPlayer') as HTMLElement | null;

    // Add a click event listener to the button
    if (spotifyPlayer) {
        button?.addEventListener('click', () => {
            // Check the current display property of the element
            console.log("testing");
            if (spotifyPlayer?.style.display === 'none') {
                // If it's 'none', change it to 'block'
                spotifyPlayer.style.display = 'block';
                button.textContent = 'Hide Spotify player';
            } else {
                // Otherwise, change it to 'none'
                spotifyPlayer.style.display = 'none';
                button.textContent = 'Show Spotify player';
            }
        });
    }
});