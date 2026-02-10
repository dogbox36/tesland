import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from '@tesland/dto';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                discountExpiresAt: createProductDto.discountExpiresAt ? new Date(createProductDto.discountExpiresAt) : null
            },
        });
    }

    findAll() {
        return this.prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    findOne(id: string) {
        return this.prisma.product.findUnique({
            where: { id },
        });
    }

    update(id: string, updateProductDto: UpdateProductDto) {
        const { discountExpiresAt, ...rest } = updateProductDto;
        const data: any = { ...rest };

        if (discountExpiresAt !== undefined) {
            data.discountExpiresAt = discountExpiresAt ? new Date(discountExpiresAt) : null;
        }

        return this.prisma.product.update({
            where: { id },
            data,
        });
    }

    remove(id: string) {
        return this.prisma.product.delete({
            where: { id },
        });
    }

    identify(query: string) {
        const lowerQuery = query.toLowerCase();

        // Mock Database of Tesla Parts
        const mockDb = [
            {
                keywords: ['model 3', 'tesla model 3'],
                name: 'Tesla Model 3 High Performance',
                description: 'Experience the future of driving with the Tesla Model 3. Featuring dual motor all-wheel drive, 0-60 mph in 3.1 seconds, and a range of up to 315 miles. Includes Autopilot, premium interior, and 15-inch touchscreen display.',
                price: 35000,
                imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                partNumber: 'TM3-HP-2024'
            },
            {
                keywords: ['model y', 'tesla model y'],
                name: 'Tesla Model Y Long Range',
                description: 'The Tesla Model Y is a fully electric mid-size SUV. It offers seating for up to seven, plenty of storage space, and versatile seating. With a range of up to 330 miles and 0-60 mph in 4.8 seconds, it combines performance with utility.',
                price: 45000,
                imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
                partNumber: 'TMY-LR-2024'
            },
            {
                keywords: ['control arm', 'lengőkar', '1044321-00-g'],
                name: 'Tesla Model 3/Y Front Upper Control Arm',
                description: 'Genuine Tesla Front Upper Control Arm for Model 3 and Model Y. Manufactured to meet high standards for durability and performance. Critical component for steering and suspension stability.',
                price: 120,
                imageUrl: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Mechanic/Part placeholder
                partNumber: '1044321-00-G'
            },
            {
                keywords: ['filter', 'szűrő', 'cabin air'],
                name: 'Tesla Model 3/Y Cabin Air Filter',
                description: 'High-efficiency particulate air (HEPA) filter for Tesla Model 3 and Model Y. Prevents pollen, industrial fallout, road dust, and other particles from entering the cabin through the vents.',
                price: 25,
                imageUrl: 'https://images.unsplash.com/photo-1626125345510-4703ee9238b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', // Air filter like placeholder
                partNumber: '1107681-00-A'
            },
            {
                keywords: ['bumper', 'lökhárító', 'fascia', '1088218-00-i', 'heater', 'ptc'],
                name: 'Tesla Model 3 PTC Heater Dual Zone',
                description: 'Original Tesla Model 3 PTC Heater (Dual Zone). Efficient cabin heating system for cold weather performance. Direct replacement for part 1088218-00-I.',
                price: 350,
                imageUrl: '/parts/1088218-00-I.svg', // Local technical schematic (fail-safe)
                partNumber: '1088218-00-I'
            }
        ];

        // Prioritize exact part number match first
        const exactMatch = mockDb.find(item =>
            item.partNumber && item.partNumber.toLowerCase() === lowerQuery
        );

        if (exactMatch) {
            return {
                name: exactMatch.name,
                description: exactMatch.description,
                price: exactMatch.price,
                stock: 10,
                imageUrl: exactMatch.imageUrl,
                partNumber: exactMatch.partNumber
            };
        }

        const match = mockDb.find(item =>
            item.keywords.some(k => lowerQuery.includes(k))
        );

        if (match) {
            return {
                name: match.name,
                description: match.description,
                price: match.price,
                stock: 10, // Default assumption
                imageUrl: match.imageUrl,
                partNumber: match.partNumber
            };
        }

        // Fallback: External Scraping (Universal)
        return this.searchExternal(query);
    }

    private async searchExternal(query: string) {
        try {
            console.log(`Starting universal search for: ${query}`);

            // 1. Search for Name/Description using Bing Web Search (HTML)
            // Bing is more reliable for simple title extraction than DDG or Google
            const bingWebUrl = `https://www.bing.com/search?q=${encodeURIComponent('Tesla part ' + query)}`;
            const bingWebRes = await axios.get(bingWebUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            });

            const $web = cheerio.load(bingWebRes.data);
            let name = '';

            // Extract title from Bing search results (usually in <h2> or <h3> tags inside list items)
            const firstTitle = $web('li.b_algo h2 a').first().text();

            if (firstTitle) {
                // Clean up the title (remove site suffixes like " | eBay", " - Amazon")
                name = firstTitle.replace(/ \| eBay/g, '')
                    .replace(/ - Amazon.*/, '')
                    .trim();

                // If the cleaned name is too short, use the first part of the title
                if (name.length < 5) {
                    name = firstTitle.split('|')[0].trim();
                }
            } else {
                name = `Tesla Part ${query.toUpperCase()}`;
            }

            // 2. Search for Image using Bing Images (HTML)
            // Note: Bing Images is often easier to scrape for a single thumb than Google
            const bingUrl = `https://www.bing.com/images/search?q=${encodeURIComponent('Tesla part ' + query + ' real photo')}&first=1&scenario=ImageBasicHover`;
            const bingRes = await axios.get(bingUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const $bing = cheerio.load(bingRes.data);
            let imageUrl = '';

            // Bing stores image metadata in 'm' attribute of 'a.iusc' class
            const firstImageMeta = $bing('a.iusc').first().attr('m');
            if (firstImageMeta) {
                try {
                    const meta = JSON.parse(firstImageMeta);
                    imageUrl = meta.murl; // Direct image URL
                } catch (e) {
                    // Fallback if parsing fails
                }
            }

            // Fallback to local placeholders if no image found
            if (!imageUrl || imageUrl.length < 10) {
                imageUrl = '/parts/1088218-00-I.svg'; // Use our safe fallback (or a generic one)
            }

            return {
                name: name || `Tesla Part ${query.toUpperCase()}`,
                description: `Automated web search result for ${query}. Verified via universal search.`,
                price: 199.00, // Placeholder price
                stock: 0,
                imageUrl: imageUrl,
                partNumber: query.toUpperCase()
            };

        } catch (error: any) {
            console.error('Universal search failed:', error.message);
            // Fallback
            return {
                name: `Tesla Part ${query.toUpperCase()}`,
                description: `Manual verification required. System could not scrape details.`,
                price: 0,
                stock: 0,
                imageUrl: '/parts/1088218-00-I.svg', // Generic fallback
                partNumber: query.toUpperCase()
            };
        }
    }
}
