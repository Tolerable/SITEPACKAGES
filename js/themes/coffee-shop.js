// Demo Theme: Artisan Coffee Shop
window.siteConfig = {
    "site": {
        "name": "Bean & Brew",
        "tagline": "Artisan Coffee Roasted Fresh Daily",
        "logo": "img/themes/coffee-shop/logo.jpg",
        "heroBackground": "img/themes/coffee-shop/hero.jpg",
        "showHeroText": true,
        "email": "hello@beanandbrew.demo",
        "socialLinks": [
            { "name": "Instagram", "url": "#" },
            { "name": "Facebook", "url": "#" }
        ],
        "copyright": "2025 Bean & Brew Coffee Co. All rights reserved."
    },
    "colors": {
        "primary": "#6F4E37",
        "secondary": "#C4A77D",
        "tertiary": "#8B4513",
        "highlight": "#D4AF37",
        "alert": "#8B0000",
        "background": "#1A1208",
        "text": "#F5F5DC"
    },
    "fonts": {
        "heading": "'Playfair Display', serif",
        "body": "'Lato', sans-serif"
    },
    "terminology": {
        "category1": "Single Origin",
        "category2": "Blends",
        "category3": "Accessories",
        "productTerm": "Coffee",
        "productPluralTerm": "Coffees",
        "packTerm": "Size",
        "cartTerm": "Order",
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
            "ethiopian": {
                "id": "ethiopian",
                "name": "Ethiopian Yirgacheffe",
                "type": "Single Origin",
                "status": "available",
                "image": "img/themes/coffee-shop/ethiopian.jpg",
                "description": "Bright, fruity, with notes of blueberry and citrus. Our lightest roast.",
                "variety": "Light Roast",
                "rating": 5,
                "details": "Origin: Yirgacheffe, Ethiopia | Altitude: 1,900m | Process: Washed | Notes: Blueberry, Citrus, Floral",
                "packOptions": [
                    { "size": "12oz Bag", "regularPrice": 18, "salePrice": null },
                    { "size": "2lb Bag", "regularPrice": 42, "salePrice": 38 }
                ],
                "displayOrder": 1,
                "promotional": { "type": "custom", "value": "STAFF PICK", "enabled": true }
            },
            "colombian": {
                "id": "colombian",
                "name": "Colombian Supremo",
                "type": "Single Origin",
                "status": "available",
                "image": "img/themes/coffee-shop/colombian.jpg",
                "description": "Rich, balanced, with caramel sweetness and nutty undertones.",
                "variety": "Medium Roast",
                "rating": 4,
                "details": "Origin: Huila, Colombia | Altitude: 1,700m | Process: Washed | Notes: Caramel, Hazelnut, Chocolate",
                "packOptions": [
                    { "size": "12oz Bag", "regularPrice": 16, "salePrice": null },
                    { "size": "2lb Bag", "regularPrice": 38, "salePrice": null }
                ],
                "displayOrder": 2
            },
            "house-blend": {
                "id": "house-blend",
                "name": "House Blend",
                "type": "Blends",
                "status": "available",
                "image": "img/themes/coffee-shop/house-blend.jpg",
                "description": "Our signature blend. Bold, smooth, perfect for every morning.",
                "variety": "Medium-Dark",
                "rating": 5,
                "details": "Blend: Brazil, Guatemala, Sumatra | Notes: Dark Chocolate, Brown Sugar, Smoky | Best for: Drip, French Press",
                "packOptions": [
                    { "size": "12oz Bag", "regularPrice": 14, "salePrice": 12 },
                    { "size": "2lb Bag", "regularPrice": 32, "salePrice": 28 }
                ],
                "displayOrder": 3,
                "promotional": { "type": "percentage", "value": "15", "discountPercent": "15", "enabled": true }
            },
            "french-press": {
                "id": "french-press",
                "name": "French Press Kit",
                "type": "Accessories",
                "status": "available",
                "image": "img/themes/coffee-shop/french-press.jpg",
                "description": "34oz Borosilicate glass French press with stainless steel filter.",
                "variety": "Equipment",
                "rating": 4,
                "details": "Capacity: 34oz (8 cups) | Material: Borosilicate Glass, Stainless Steel | Includes: Press, Extra Filter, Scoop",
                "packOptions": [
                    { "size": "Kit", "regularPrice": 45, "salePrice": null }
                ],
                "displayOrder": 4
            }
        }
    },
    "navigation": [
        { "name": "Coffees", "url": "#products" },
        { "name": "Our Story", "url": "#about" }
    ],
    "about": {
        "title": "Our Story",
        "subtitle": "Roasting Since 2018",
        "description": "Bean & Brew started in a small garage with a passion for perfect coffee. Today, we source beans directly from farmers across three continents and roast them fresh in small batches.",
        "teamMembers": []
    },
    "advanced": {
        "enableShop": true,
        "enableLocalStorage": true,
        "enableShipping": true,
        "shippingPrice": 5,
        "showFreeShipping": true
    }
};
