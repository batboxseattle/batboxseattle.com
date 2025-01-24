# batboxseattle.com

## Build commands:

Install dependencies (only needed once or when dependencies change): `npm install`

Start a local development server: `npm run start`

Build for production: `npm run build`

Style check: `npm run style-check`

Fix most style issues: `npm run style-fix`

## Compressing image assets

Compress images locally: `npm run compress`

This will create a local folder named `media_compressed`, mirroring the main `media` folder.

To add more folders to be compressed and configure the desired resolution, edit the `image-compressor.ts` script.
