const axios = require('axios');
const cheerio = require('cheerio');

async function testScrape(query) {
    console.log(`Testing universal search for: ${query}`);

    try {
        // 1. Search for Name/Description using Bing Web Search (HTML)
        // Bing is often friendlier than Google/DDG for simple HTML scraping
        const bingWebUrl = `https://www.bing.com/search?q=${encodeURIComponent('Tesla part ' + query)}`;
        console.log(`Fetching Bing Web: ${bingWebUrl}`);

        const bingWebRes = await axios.get(bingWebUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const $web = cheerio.load(bingWebRes.data);
        let name = '';

        // Bing titles are usually in <h2> or <h3> inside <li class="b_algo">
        const firstTitle = $web('li.b_algo h2 a').first().text();

        if (firstTitle) {
            console.log(`Raw Title: ${firstTitle}`);
            // Clean up common suffixes
            name = firstTitle.replace(/ \| eBay/g, '')
                .replace(/ - Amazon.*/, '')
                .replace(/Tesla.*/i, '') // Remove redundant "Tesla" if we add it back later
                .trim();

            // If we stripped too much, use the raw title but clean up
            if (name.length < 3) {
                name = firstTitle.split('|')[0].trim();
            }
        } else {
            console.log('No title found on Bing Web.');
            // Debug HTML if needed
            // console.log(bingWebRes.data.substring(0, 500));
        }

        console.log(`Extracted Name: ${name}`);

        // 2. Search for Image using Bing Images (HTML) - CONFIRMED WORKING
        const bingImgUrl = `https://www.bing.com/images/search?q=${encodeURIComponent('Tesla part ' + query + ' real photo')}&first=1&scenario=ImageBasicHover`;
        console.log(`Fetching Bing Images: ${bingImgUrl}`);
        const bingImgRes = await axios.get(bingImgUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $img = cheerio.load(bingImgRes.data);
        let imageUrl = '';

        const firstImageMeta = $img('a.iusc').first().attr('m');
        if (firstImageMeta) {
            try {
                const meta = JSON.parse(firstImageMeta);
                imageUrl = meta.murl;
                console.log(`Extracted Image URL: ${imageUrl}`);
            } catch (e) {
                console.error('Failed to parse image meta', e);
            }
        } else {
            console.log('No image meta found on Bing.');
        }

        return { name, imageUrl };

    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testScrape('1088218-00-I');
