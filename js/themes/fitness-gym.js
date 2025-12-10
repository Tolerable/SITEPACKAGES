// Demo Theme: Fitness & Gym
window.siteConfig = {
    "site": {
        "name": "IRON REPUBLIC",
        "tagline": "Fuel Your Fire",
        "logo": "https://image.pollinations.ai/prompt/fitness%20gym%20logo%20iron%20barbell%20red%20black%20bold%20aggressive?width=200&height=200&nologo=true",
        "heroBackground": "https://image.pollinations.ai/prompt/gym%20interior%20dark%20red%20lighting%20weights%20barbells%20intense%20atmosphere?width=1920&height=800&nologo=true",
        "showHeroText": true,
        "email": "team@ironrepublic.demo",
        "socialLinks": [
            { "name": "YouTube", "url": "#" },
            { "name": "Instagram", "url": "#" },
            { "name": "TikTok", "url": "#" }
        ],
        "copyright": "2025 IRON REPUBLIC. No Excuses."
    },
    "colors": {
        "primary": "#DC143C",
        "secondary": "#FFD700",
        "tertiary": "#FF6347",
        "highlight": "#FF4500",
        "alert": "#8B0000",
        "background": "#0A0A0A",
        "text": "#F5F5F5"
    },
    "fonts": {
        "heading": "'Bebas Neue', sans-serif",
        "body": "'Roboto Condensed', sans-serif"
    },
    "terminology": {
        "category1": "Supplements",
        "category2": "Apparel",
        "category3": "Equipment",
        "productTerm": "Product",
        "productPluralTerm": "Products",
        "packTerm": "Option",
        "cartTerm": "Cart",
        "soldOutLabel": "SOLD OUT",
        "comingSoonLabel": "COMING SOON"
    },
    "effects": {
        "backgroundEffect": {
            "enabled": true,
            "type": "particles",
            "intensity": "high"
        }
    },
    "products": {
        "defaultStatus": "available",
        "enableRatings": true,
        "showPackOptions": true,
        "items": {
            "pre-workout": {
                "id": "pre-workout",
                "name": "IGNITE Pre-Workout",
                "type": "Supplements",
                "status": "available",
                "image": "https://image.pollinations.ai/prompt/pre%20workout%20supplement%20container%20red%20black%20bold%20fitness%20product?width=400&height=400&nologo=true",
                "description": "Explosive energy. Laser focus. Zero crash. 300mg caffeine, beta-alanine, citrulline.",
                "variety": "Pre-Workout",
                "rating": 5,
                "details": "Servings: 30 | Caffeine: 300mg | Beta-Alanine: 3.2g | L-Citrulline: 6g | No artificial colors | Third-party tested",
                "packOptions": [
                    { "size": "Fruit Punch", "regularPrice": 45, "salePrice": 39 },
                    { "size": "Blue Razz", "regularPrice": 45, "salePrice": 39 },
                    { "size": "Watermelon", "regularPrice": 45, "salePrice": 39 }
                ],
                "displayOrder": 1,
                "promotional": { "type": "percentage", "value": "13", "discountPercent": "13", "enabled": true }
            },
            "protein": {
                "id": "protein",
                "name": "FORGE Whey Protein",
                "type": "Supplements",
                "status": "available",
                "image": "https://image.pollinations.ai/prompt/whey%20protein%20powder%20container%20gold%20black%20premium%20fitness?width=400&height=400&nologo=true",
                "description": "25g protein, 5g BCAAs, ultra-fast absorption. Grass-fed whey isolate.",
                "variety": "Protein",
                "rating": 5,
                "details": "Protein: 25g | BCAAs: 5g | Servings: 28 | Source: Grass-fed Whey Isolate | Gluten-free | No fillers",
                "packOptions": [
                    { "size": "2lb - Chocolate", "regularPrice": 55, "salePrice": null },
                    { "size": "2lb - Vanilla", "regularPrice": 55, "salePrice": null },
                    { "size": "5lb - Chocolate", "regularPrice": 99, "salePrice": 89 }
                ],
                "displayOrder": 2,
                "promotional": { "type": "custom", "value": "BEST SELLER", "enabled": true }
            },
            "tank-top": {
                "id": "tank-top",
                "name": "REPUBLIC Performance Tank",
                "type": "Apparel",
                "status": "available",
                "image": "https://image.pollinations.ai/prompt/fitness%20tank%20top%20black%20red%20logo%20athletic%20wear?width=400&height=400&nologo=true",
                "description": "Moisture-wicking, breathable, built to move. Rep the Republic.",
                "variety": "Tank Top",
                "rating": 4,
                "details": "Material: 95% Polyester, 5% Spandex | Fit: Athletic | Features: Moisture-wicking, 4-way stretch | Machine washable",
                "packOptions": [
                    { "size": "S", "regularPrice": 32, "salePrice": null },
                    { "size": "M", "regularPrice": 32, "salePrice": null },
                    { "size": "L", "regularPrice": 32, "salePrice": null },
                    { "size": "XL", "regularPrice": 32, "salePrice": null }
                ],
                "displayOrder": 3
            },
            "resistance-bands": {
                "id": "resistance-bands",
                "name": "TITAN Resistance Band Set",
                "type": "Equipment",
                "status": "available",
                "image": "https://image.pollinations.ai/prompt/resistance%20bands%20set%20fitness%20equipment%20red%20black%20professional?width=400&height=400&nologo=true",
                "description": "5 resistance levels. Door anchor, handles, ankle straps included. Train anywhere.",
                "variety": "Equipment",
                "rating": 5,
                "details": "Bands: 5 levels (10-50lb) | Includes: Door anchor, 2 handles, 2 ankle straps, carry bag | Material: Natural latex | Warranty: Lifetime",
                "packOptions": [
                    { "size": "Full Set", "regularPrice": 49, "salePrice": 39 }
                ],
                "displayOrder": 4,
                "promotional": { "type": "percentage", "value": "20", "discountPercent": "20", "enabled": true }
            }
        }
    },
    "navigation": [
        { "name": "Shop", "url": "#products" },
        { "name": "About", "url": "#about" }
    ],
    "about": {
        "title": "About IRON REPUBLIC",
        "subtitle": "Built Different",
        "description": "IRON REPUBLIC was founded by athletes who got tired of overhyped, under-dosed supplements. Every product we sell is third-party tested, transparently labeled, and designed to actually work. No proprietary blends. No BS. Just results.",
        "teamMembers": []
    },
    "advanced": {
        "enableShop": true,
        "enableLocalStorage": true,
        "enableShipping": true,
        "shippingPrice": 0,
        "showFreeShipping": true
    }
};
