const IMAGES_PER_COLLAGE = 4;

type NormalizedImage = {
    src: string;
    normalizedWidth: number;
}

type Dimensions = {
    width: number;
    height: number;
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getImageDimensions(imageUrl: string): Promise<Dimensions> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            resolve({width: img.width, height: img.height});
        };
        img.onerror = () => {
            reject(new Error(`Failed to load image: ${imageUrl}`));
        };
    });
}

export async function loadRandomImages() {
    const data: { images: string[] } = await (await fetch("collage-images.json")).json();
    const imageFileNames = shuffleArray(data.images);

    for (const [index, imageCollage] of Array.from(document.querySelectorAll<HTMLDivElement>(".image-collage")).entries()) {
        imageCollage.innerHTML = "";

        const images: NormalizedImage[] = await Promise.all(
            imageFileNames.slice(index * IMAGES_PER_COLLAGE, index * IMAGES_PER_COLLAGE + IMAGES_PER_COLLAGE).map(async (fileName) => {
                const imageUrl = `/media/collage-images/${fileName}`;
                const {width, height} = await getImageDimensions(imageUrl);
                return {src: imageUrl, normalizedWidth: width / height};
            })
        )

        const totalNormalizedWidth = images.reduce((sum, img) => sum + img.normalizedWidth, 0);

        for (const image of images) {
            const img = document.createElement("img");
            img.src = image.src;
            img.alt = "Photo of Batbox performing onstage.";
            img.style.width = `${(image.normalizedWidth / totalNormalizedWidth) * 100}%`
            imageCollage.appendChild(img);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => loadRandomImages().catch(console.error));