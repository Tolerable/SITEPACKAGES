// Seed Collective - Configuration File
				// Edit this file to customize your site

				window.siteConfig = {
    "site": {
        "name": "Seed Collective",
        "tagline": "Unique Collectibles from Around the World",
        "logo": "img/logo.jpg",
        "heroBackground": "",
        "showHeroText": true,
        "email": "contact@example.com",
        "socialLinks": {
            "discord": "https://discord.gg/yourcollective",
            "youtube": "https://youtube.com/@yourchannel",
            "tiktok": "https://tiktok.com/@yourhandle"
        },
        "copyright": "© 2025 Seed Collective. All rights reserved."
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
            "enabled": true,
            "type": "floatingObject",
            "image": "img/floating-object.png",
            "behavior": "teleport"
        }
    },
    "strainTree": {
        "enabled": true,
        "title": "Strain Genetics Explorer",
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
        "items": {}
    },
    "navigation": [
        {
            "name": "Premium Collections",
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