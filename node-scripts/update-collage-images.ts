import { promises } from "fs";

const COLLAGE_IMAGES_DIRECTORY = "media/collage-images";
const COLLAGE_IMAGES_JSON_FILE_PATH = "image-collage/collage-images.json";

async function main() {
  await promises.writeFile(
    COLLAGE_IMAGES_JSON_FILE_PATH,
    JSON.stringify({
      images: await promises.readdir(COLLAGE_IMAGES_DIRECTORY),
    }),
  );
}

await main();
