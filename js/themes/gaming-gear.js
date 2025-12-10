// Demo Theme: Gaming/Esports Gear
window.siteConfig = {
    "site": {
        "name": "NEXUS GEAR",
        "tagline": "Level Up Your Setup",
        "logo": "img/themes/gaming-gear/logo.jpg",
        "heroBackground": "img/themes/gaming-gear/hero.jpg",
        "showHeroText": true,
        "email": "support@nexusgear.demo",
        "socialLinks": [
            { "name": "Discord", "url": "#" },
            { "name": "Twitch", "url": "#" },
            { "name": "Twitter", "url": "#" }
        ],
        "copyright": "2025 NEXUS GEAR. Game On."
    },
    "colors": {
        "primary": "#00FF41",
        "secondary": "#9D00FF",
        "tertiary": "#FF00E4",
        "highlight": "#00FFFF",
        "alert": "#FF3131",
        "background": "#0D0D0D",
        "text": "#E0E0E0"
    },
    "fonts": {
        "heading": "'Orbitron', sans-serif",
        "body": "'Rajdhani', sans-serif"
    },
    "terminology": {
        "category1": "Peripherals",
        "category2": "Audio",
        "category3": "Streaming",
        "productTerm": "Gear",
        "productPluralTerm": "Gear",
        "packTerm": "Edition",
        "cartTerm": "Loadout",
        "soldOutLabel": "OUT OF STOCK",
        "comingSoonLabel": "PRE-ORDER"
    },
    "effects": {
        "backgroundEffect": {
            "enabled": true,
            "type": "matrix",
            "intensity": "medium"
        }
    },
    "products": {
        "defaultStatus": "available",
        "enableRatings": true,
        "showPackOptions": true,
        "items": {
            "mech-keyboard": {
                "id": "mech-keyboard",
                "name": "NEXUS K1 Pro",
                "type": "Peripherals",
                "status": "available",
                "image": "img/themes/gaming-gear/keyboard.jpg",
                "description": "Hot-swappable mechanical keyboard with per-key RGB. Cherry MX compatible.",
                "variety": "Keyboard",
                "rating": 5,
                "details": "Switches: Hot-swap (Cherry MX compatible) | Keycaps: PBT Double-shot | Lighting: Per-key RGB | Connectivity: USB-C, Wireless 2.4GHz | Battery: 4000mAh",
                "packOptions": [
                    { "size": "Linear Red", "regularPrice": 149, "salePrice": 129 },
                    { "size": "Tactile Brown", "regularPrice": 149, "salePrice": 129 },
                    { "size": "Clicky Blue", "regularPrice": 149, "salePrice": 129 }
                ],
                "displayOrder": 1,
                "promotional": { "type": "percentage", "value": "13", "discountPercent": "13", "enabled": true }
            },
            "gaming-mouse": {
                "id": "gaming-mouse",
                "name": "NEXUS M7 Wireless",
                "type": "Peripherals",
                "status": "available",
                "image": "img/themes/gaming-gear/mouse.jpg",
                "description": "Ultra-lightweight wireless gaming mouse. 26K DPI sensor, <1ms latency.",
                "variety": "Mouse",
                "rating": 5,
                "details": "Sensor: 26,000 DPI Optical | Weight: 58g | Buttons: 6 Programmable | Battery: 70hrs | Connectivity: 2.4GHz Wireless, Bluetooth, USB-C",
                "packOptions": [
                    { "size": "Standard", "regularPrice": 99, "salePrice": null }
                ],
                "displayOrder": 2,
                "promotional": { "type": "custom", "value": "BEST SELLER", "enabled": true }
            },
            "headset": {
                "id": "headset",
                "name": "NEXUS Audio 7.1",
                "type": "Audio",
                "status": "available",
                "image": "img/themes/gaming-gear/headset.jpg",
                "description": "Virtual 7.1 surround sound headset with noise-canceling mic.",
                "variety": "Headset",
                "rating": 4,
                "details": "Drivers: 50mm Neodymium | Surround: Virtual 7.1 | Mic: Detachable, Noise-canceling | Connectivity: USB, 3.5mm | Weight: 298g",
                "packOptions": [
                    { "size": "Wired", "regularPrice": 79, "salePrice": null },
                    { "size": "Wireless", "regularPrice": 129, "salePrice": 109 }
                ],
                "displayOrder": 3
            },
            "stream-deck": {
                "id": "stream-deck",
                "name": "NEXUS Stream Control",
                "type": "Streaming",
                "status": "comingSoon",
                "image": "img/themes/gaming-gear/stream-deck.jpg",
                "description": "15-key LCD macro pad for streaming. One-touch scene switching.",
                "variety": "Streaming",
                "rating": 5,
                "details": "Keys: 15 customizable LCD | Integration: OBS, Streamlabs, XSplit, Twitch, Discord | Connectivity: USB-C",
                "packOptions": [
                    { "size": "15-Key", "regularPrice": 149, "salePrice": null }
                ],
                "displayOrder": 4,
                "promotional": { "type": "custom", "value": "PRE-ORDER", "enabled": true }
            }
        }
    },
    "navigation": [
        { "name": "Gear", "url": "#products" },
        { "name": "About", "url": "#about" }
    ],
    "about": {
        "title": "About NEXUS",
        "subtitle": "Built by Gamers, For Gamers",
        "description": "NEXUS GEAR was founded by competitive esports players who were tired of overpriced, underperforming equipment. Every product is tested in tournament conditions.",
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
