import sharp from "sharp";

import fs from "fs";

interface CompressionInputProps {
  sourceFolder: string;
  compressionSize: number;
}

const ALLOWED_IMG_EXTENSIONS: Set<string> = new Set<string>([
  "jpg",
  "png",
  "jpeg",
]);
const COMPRESSION_OUTPUT_FOLDER = "media_compressed/";
const IMAGE_INPUTS: CompressionInputProps[] = [
  {
    sourceFolder: "media/assets/",
    compressionSize: 1080,
  },
  {
    sourceFolder: "media/collage-images/",
    compressionSize: 720,
  },
  {
    sourceFolder: "media/member-images/",
    compressionSize: 1080,
  },
  {
    sourceFolder: "media/press-photos/",
    compressionSize: 1080,
  },
  {
    sourceFolder: "media/show-flyers/",
    compressionSize: 1080,
  },
];

function createOutputFolders() {
  if (!fs.existsSync(COMPRESSION_OUTPUT_FOLDER)) {
    fs.mkdirSync(COMPRESSION_OUTPUT_FOLDER);
  }

  IMAGE_INPUTS.forEach((input) => {
    const outputFolder = COMPRESSION_OUTPUT_FOLDER + input.sourceFolder;
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }
  });
}

function listAllImagesInFolder(folder: string): string[] {
  return fs
    .readdirSync(folder)
    .filter((img: string) =>
      ALLOWED_IMG_EXTENSIONS.has(
        img.slice(img.lastIndexOf(".") + 1).toLowerCase(),
      ),
    )
    .map((fileName: string) => folder + fileName);
}

async function compressImage(inputFilePath: string, compressionSize: number) {
  const outputFilePath = COMPRESSION_OUTPUT_FOLDER + inputFilePath;
  console.log(
    `Compressing ${inputFilePath} to ${compressionSize}p into ${outputFilePath}`,
  );
  try {
    const image = sharp(inputFilePath);
    const metadata = await image.metadata();

    const width = metadata.width;
    const height = metadata.height;

    let newHeight = null;
    let newWidth = null;

    if (width > height) {
      newHeight = compressionSize;
    } else {
      newWidth = compressionSize;
    }

    await image
      .resize(newWidth, newHeight, {
        withoutEnlargement: true,
      })
      .toFile(outputFilePath);
  } catch (err) {
    console.log(`Failed to process: ${inputFilePath}`);
    throw err;
  }
}

function compressImageScript() {
  console.log("Setup compression output folders");
  createOutputFolders();
  for (const folderInput of IMAGE_INPUTS) {
    console.log(
      `Compression ${folderInput.sourceFolder} folder images to ${folderInput.compressionSize}p`,
    );
    listAllImagesInFolder(folderInput.sourceFolder).forEach((img) =>
      compressImage(img, folderInput.compressionSize),
    );
  }
}

compressImageScript();
