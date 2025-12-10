// Demo Theme: Fashion Boutique
window.siteConfig = {
    "site": {
        "name": "VELVET & LACE",
        "tagline": "Curated Fashion for the Modern You",
        "logo": "img/themes/fashion-boutique/logo.jpg",
        "heroBackground": "img/themes/fashion-boutique/hero.jpg",
        "showHeroText": true,
        "email": "hello@velvetandlace.demo",
        "socialLinks": [
            { "name": "Instagram", "url": "#" },
            { "name": "Pinterest", "url": "#" },
            { "name": "TikTok", "url": "#" }
        ],
        "copyright": "2025 VELVET & LACE. All rights reserved."
    },
    "colors": {
        "primary": "#B76E79",
        "secondary": "#D4A574",
        "tertiary": "#E8C4C4",
        "highlight": "#F5DEB3",
        "alert": "#8B0000",
        "background": "#1A1A1A",
        "text": "#FAF0E6"
    },
    "fonts": {
        "heading": "'Cormorant Garamond', serif",
        "body": "'Nunito Sans', sans-serif"
    },
    "terminology": {
        "category1": "Apparel",
        "category2": "Accessories",
        "category3": "Collections",
        "productTerm": "Piece",
        "productPluralTerm": "Pieces",
        "packTerm": "Size",
        "cartTerm": "Bag",
        "soldOutLabel": "SOLD OUT",
        "comingSoonLabel": "COMING SOON"
    },
    "effects": {
        "backgroundEffect": {
            "enabled": true,
            "type": "particles",
            "intensity": "low"
        }
    },
    "products": {
        "defaultStatus": "available",
        "enableRatings": true,
        "showPackOptions": true,
        "items": {
            "silk-blouse": {
                "id": "silk-blouse",
                "name": "Luxe Silk Blouse",
                "type": "Apparel",
                "status": "available",
                "image": "img/themes/fashion-boutique/silk-blouse.jpg",
                "description": "100% mulberry silk blouse with mother-of-pearl buttons. Effortlessly elegant.",
                "variety": "Top",
                "rating": 5,
                "details": "Material: 100% Mulberry Silk | Care: Dry Clean Only | Closure: Mother-of-Pearl Buttons | Made in: Italy",
                "packOptions": [
                    { "size": "XS", "regularPrice": 189, "salePrice": null },
                    { "size": "S", "regularPrice": 189, "salePrice": null },
                    { "size": "M", "regularPrice": 189, "salePrice": 159 },
                    { "size": "L", "regularPrice": 189, "salePrice": null }
                ],
                "displayOrder": 1,
                "promotional": { "type": "custom", "value": "NEW ARRIVAL", "enabled": true }
            },
            "cashmere-wrap": {
                "id": "cashmere-wrap",
                "name": "Cashmere Travel Wrap",
                "type": "Accessories",
                "status": "available",
                "image": "img/themes/fashion-boutique/cashmere-wrap.jpg",
                "description": "Oversized cashmere wrap. Perfect for travel or chilly evenings.",
                "variety": "Scarf",
                "rating": 5,
                "details": "Material: 100% Cashmere | Dimensions: 80\" x 28\" | Weight: Ultra-light | Colors: Cream, Blush, Charcoal",
                "packOptions": [
                    { "size": "Cream", "regularPrice": 275, "salePrice": 225 },
                    { "size": "Blush", "regularPrice": 275, "salePrice": 225 },
                    { "size": "Charcoal", "regularPrice": 275, "salePrice": 225 }
                ],
                "displayOrder": 2,
                "promotional": { "type": "percentage", "value": "18", "discountPercent": "18", "enabled": true }
            },
            "tailored-blazer": {
                "id": "tailored-blazer",
                "name": "The Perfect Blazer",
                "type": "Apparel",
                "status": "available",
                "image": "img/themes/fashion-boutique/blazer.jpg",
                "description": "Impeccably tailored blazer with gold-tone buttons. A wardrobe essential.",
                "variety": "Outerwear",
                "rating": 5,
                "details": "Material: Wool Blend | Lining: Silk | Closure: Single-breasted, Gold Buttons | Fit: Tailored",
                "packOptions": [
                    { "size": "XS", "regularPrice": 425, "salePrice": null },
                    { "size": "S", "regularPrice": 425, "salePrice": null },
                    { "size": "M", "regularPrice": 425, "salePrice": null },
                    { "size": "L", "regularPrice": 425, "salePrice": null }
                ],
                "displayOrder": 3,
                "promotional": { "type": "custom", "value": "BEST SELLER", "enabled": true }
            },
            "spring-collection": {
                "id": "spring-collection",
                "name": "Spring 2025 Preview",
                "type": "Collections",
                "status": "comingSoon",
                "image": "img/themes/fashion-boutique/spring-collection.jpg",
                "description": "Be the first to preview our upcoming Spring 2025 collection. Pastels, florals, and fresh silhouettes.",
                "variety": "Collection",
                "rating": 5,
                "details": "Includes: 12 new pieces | Preview Date: February 2025 | VIP Early Access | Complimentary alterations included",
                "packOptions": [
                    { "size": "VIP Access", "regularPrice": 0, "salePrice": null }
                ],
                "displayOrder": 4,
                "promotional": { "type": "custom", "value": "COMING SOON", "enabled": true }
            }
        }
    },
    "navigation": [
        { "name": "Shop", "url": "#products" },
        { "name": "Our Story", "url": "#about" }
    ],
    "about": {
        "title": "Our Story",
        "subtitle": "Fashion With Intention",
        "description": "VELVET & LACE was born from a simple belief: every woman deserves a wardrobe that makes her feel extraordinary. We curate timeless pieces from emerging and established designers who share our commitment to quality, sustainability, and thoughtful design.",
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
