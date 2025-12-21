const sharp = require('sharp');

const targetWidth = 453;
const targetHeight = 540;

const members = [
    { name: 'director', src: '/var/www/html/card-website/public/images/administration/director.jpg' },
    { name: 'treasurer', src: '/var/www/html/card-website/public/images/administration/treasurer.jpg' },
    { name: 'asst-director', src: '/var/www/html/card-website/public/images/administration/asst-director.jpg' }
];

async function processMember(member) {
    try {
        // Resize original image to fit within target while preserving aspect ratio
        const resized = await sharp(member.src)
            .resize({ width: targetWidth, height: targetHeight, fit: 'inside' })
            .toBuffer();

        // Get dimensions of resized image
        const meta = await sharp(resized).metadata();
        const left = Math.round((targetWidth - meta.width) / 2);
        const top = Math.round((targetHeight - meta.height) / 2);

        // Create white background and composite resized image onto it
        await sharp({
            create: {
                width: targetWidth,
                height: targetHeight,
                channels: 3,
                background: { r: 255, g: 255, b: 255 }
            }
        })
            .composite([{ input: resized, left, top }])
            .jpeg({ quality: 95 })
            .toFile(member.src);

        console.log(`Processed ${member.name} with white background`);
    } catch (err) {
        console.error(`Error processing ${member.name}:`, err);
    }
}

(async () => {
    for (const m of members) {
        await processMember(m);
    }
})();
