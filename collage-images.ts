
function shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function loadRandomImages() {
    const response = await fetch("collage-images.json");
    const data: { images: string[] } = await response.json();
    const images: string[] = shuffleArray(data.images);

    document.querySelectorAll<HTMLDivElement>(".image-collage").forEach((imageCollage, index) => {
        imageCollage.innerHTML = "";

        images.slice(index * 4, index * 4 + 4).forEach(image => {
            const imageContainer: HTMLDivElement = document.createElement("div");
            imageContainer.classList.add("ic-container");

            const imgElement: HTMLImageElement = document.createElement("img");
            imgElement.src = `/media/collage-images/${image}`;
            imgElement.alt = "Random image";

            imageContainer.appendChild(imgElement);
            imageCollage.appendChild(imageContainer);
        });
    })
}

document.addEventListener("DOMContentLoaded", () => loadRandomImages().catch(console.error));
