// Function to shuffle an array and return a random item
function getRandomImage(images) {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
}

// Load images from JSON file
async function loadImages() {
    try {
        const response = await fetch('headerimages.json');
        const data = await response.json();
        return data.images;
    } catch (error) {
        console.error('Error loading images:', error);
        return [];
    }
}

export async function startImageRotation() {
    const imageContainer = document.querySelector('.image-container2');
    if (!imageContainer) {
        console.error(`Container '.image-container2' not found.`);
        return;
    }

    const images = await loadImages();
    console.log('Loaded images:', images);
    if (images.length === 0) return;

    // Get a random image and set it as the background image
    const randomImage = getRandomImage(images);
    const img = document.createElement('img');
    img.src = `/media/images/${randomImage}`; // Assuming images are in an 'images' folder
    img.classList.add('background-image2');
    img.alt = 'trio batbox';
    img.width = '60%';

    // Clear the container and append the new image
    imageContainer.innerHTML = '';
    imageContainer.appendChild(img);
}
