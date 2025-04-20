// Seed Collective - Configuration File
				// Edit this file to customize your site

				window.siteConfig = {
    "site": {
        "name": "Midnighters Seed Bank",
        "tagline": "Testing Premium Genetics from Around the World",
        "logo": "img/logo.png",
        "heroBackground": "hero-bg.jpg",
        "showHeroText": true,
        "email": "midnighters@sitepackages.net",
        "socialLinks": {
            "discord": "https://discord.gg/8vK42qAGBP",
            "youtube": "",
            "tiktok": ""
        },
        "copyright": "© 2025 Midnighters Seed Bank. All rights reserved."
    },
    "colors": {
        "primary": "#003b6f",
        "secondary": "#00ff9f",
        "tertiary": "#6a0dad",
        "highlight": "#ffd700",
        "alert": "#ff5722",
        "background": "#0a0e17",
        "text": "#ffffff"
    },
    "background": {
        "image": "",
        "sectionImage": ""
    },
    "fonts": {
        "heading": "'Orbitron', sans-serif",
        "body": "'Exo 2', sans-serif"
    },
    "terminology": {
        "category1": "Premium Collection",
        "category2": "Signature Series",
        "category3": "Hybrid Collection",
        "productTerm": "Collectible",
        "productPluralTerm": "Collectibles",
        "packTerm": "Collection Pack",
        "cartTerm": "Collection Box",
        "soldOutLabel": "UNAVAILABLE",
        "comingSoonLabel": "COMING SOON"
    },
    "effects": {
        "backgroundEffect": {
            "enabled": true,
            "type": "stars",
            "intensity": "medium"
        },
        "specialFeature": {
            "enabled": false,
            "type": "floatingObject",
            "image": "img/floating-object.png",
            "behavior": "teleport"
        }
    },
    "strainTree": {
        "enabled": false,
        "title": "Genetics Explorer",
        "description": "Explore the genetic relationships between our strains.",
        "dataPath": "data/straindata.json"
    },
    "about": {
        "title": "Midnighters Seed Bank",
        "subtitle": "We test premium genetics in Ohio",
        "image": "img/about.jpg",
        "description": "Founded in 2025, Midnighters Seed Bank is dedicated to bringing unique collectibles to enthusiasts around Ohio. We carefully curate our collections to ensure only the highest quality items reach our members.",
        "teamMembers": [],
        "historyItems": [],
        "additionalSections": []
    },
    "products": {
        "defaultStatus": "available",
        "enableRatings": true,
        "showPackOptions": true,
        "defaultPackOptions": [
            {
                "size": "3 Pack",
                "regularPrice": 35,
                "salePrice": 30
            },
            {
                "size": "5 Pack",
                "regularPrice": 50,
                "salePrice": 45
            },
            {
                "size": "10 Pack",
                "regularPrice": 95,
                "salePrice": 80
            }
        ],
        "items": {
            "product-00001": {
                "id": "product-00001",
                "name": "FREE GOOGLE SEARCH",
                "type": "Premium Collection",
                "status": "available",
                "delivery": "digital",
                "digitalContent": "https://www.google.com/",
                "image": "digital1.jpg",
                "additionalImages": [],
                "description": "A Digital Product, FREE for you.",
                "variety": "Premium Collection",
                "rating": "4.5/5",
                "origin": "INTERNET",
                "details": "No Charge, Use it freely!",
                "notes": "Share it with friends!",
                "packOptions": []
            }
        }
    },
    "navigation": [
        {
            "name": "Collections",
            "url": "#products"
        },
        {
            "name": "About",
            "url": "#about"
        },
        {
            "name": "Contact",
            "url": "#contact"
        }
    ],
    "friendLinks": [
        {
            "name": "StrainNavigator",
            "url": "https://www.strainnavigator.com/"
        }
    ],
    "advanced": {
        "enableShop": true,
        "enableLocalStorage": true,
        "checkoutMethod": "email",
        "externalCheckoutUrl": "",
        "analyticsId": "",
        "orderEmail": "orders@example.com"
    }
};