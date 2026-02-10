const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape(query) {
    console.log(`Testing scrape for: ${query}`);
    try {
        const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}&_sacat=0`;
        console.log(`URL: ${searchUrl}`);

        const { data } = await axios.get(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const $ = cheerio.load(data);
        const results = $('.s-item');
        console.log(`Found ${results.length} items (raw count)`);

        if (results.length === 0) {
            console.log('No items found');
            return;
        }

        const firstResult = results.first();
        const title = firstResult.find('.s-item__title').text().trim();
        const price = firstResult.find('.s-item__price').text().trim();
        const image = firstResult.find('.s-item__image-img').attr('src');

        console.log('--- Result 1 ---');
        console.log('Title:', title);
        console.log('Price:', price);
        console.log('Image:', image);

        // Try second item if first is "Shop on eBay"
        if (title === 'Shop on eBay' || !title) {
            const second = results.eq(1);
            console.log('--- Result 2 (Fallback) ---');
            console.log('Title:', second.find('.s-item__title').text().trim());
            console.log('Price:', second.find('.s-item__price').text().trim());
            console.log('Image:', second.find('.s-item__image-img').attr('src'));
        }

    } catch (e) {
        console.error('Error:', e.message);
        if (e.response) {
            console.error('Status:', e.response.status);
        }
    }
}

testScrape('1088218-00-I');
