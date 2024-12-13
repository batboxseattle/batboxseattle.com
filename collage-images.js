function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function loadRandomImages() {
    const images = shuffleArray((await (await fetch("collage-images.json")).json()).images)

    document.querySelectorAll(".image-collage").forEach((imageCollage, index) => {
        imageCollage.innerHTML = "";

        images.slice(index * 4, index * 4 + 4).forEach(image => {
            const imageContainer = document.createElement("div");
            imageContainer.classList.add("ic-container");

            const imgElement = document.createElement("img");
            imgElement.src = `/media/collage-images/${image}`;
            imgElement.alt = "Random image";

            imageContainer.appendChild(imgElement);
            imageCollage.appendChild(imageContainer);
        });
    })
}

document.addEventListener("DOMContentLoaded", loadRandomImages);