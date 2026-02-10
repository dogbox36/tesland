const axios = require('axios');
const fs = require('fs');
const path = require('path');

const url = 'https://www.picclickimg.com/d/l400/pict/186278852379_/Tesla-Model-3-Y-PTC-Heater-1088218-00-I.jpg';
const outputPath = path.resolve('apps/admin/public/parts/1088218-00-I.jpg');

async function downloadImage() {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Download failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
        }
        process.exit(1);
    }
}

downloadImage().then(() => console.log('Image downloaded successfully'));
