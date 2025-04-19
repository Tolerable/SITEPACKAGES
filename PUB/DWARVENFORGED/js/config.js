// Dwarven Forged - Configuration File
// Created for the Dwarven Forged Seed Collective

window.siteConfig = {
    site: {
        name: "DwarvenForged",
        tagline: "Cannabis Seeds Forged With Dwarven Precision",
        logo: "img/logo.jpg",
        heroBackground: "img/forge-background.jpg",
        showHeroText: true,
        email: "info@dwarvenforged.com",
        orderEmail: "orders@dwarvenforged.com",
        socialLinks: {
            discord: "https://discord.gg/dwarvenforged",
            youtube: "https://youtube.com/@dwarvenforged",
            tiktok: "https://tiktok.com/@dwarvenforged"
        },
        copyright: "© 2025 DwarvenForged / Brokkr Seeds. All rights reserved."
    },
    colors: {
        primary: "#b87333",      // Copper tone
        secondary: "#c69c6d",    // Lighter copper/bronze
        tertiary: "#a23e25",     // Forge fire red
        highlight: "#e6c200",    // Gold
        alert: "#a23e25",        // Forge fire red (for alerts)
        background: "#2e2119",   // Dark brown background
        text: "#f5f0e6"          // Light parchment color
    },
    fonts: {
        heading: "'Cinzel', serif",
        body: "'Montserrat', sans-serif"
    },
    terminology: {
        category1: "Anvil Series",        // Indica
        category2: "Forge Collection",    // Sativa
        category3: "Hybrid Collection",   // Hybrid
        productTerm: "Strain",
        productPluralTerm: "Strains",
        packTerm: "Seed Pack",
        cartTerm: "Collection Box",
        soldOutLabel: "SOLD OUT",
        comingSoonLabel: "COMING SOON"
    },
    effects: {
        backgroundEffect: {
            enabled: true,
            type: "particles",
            intensity: "medium"
        },
        specialFeature: {
            enabled: true,
            type: "floatingObject",
            image: "img/floating-object.png",
            behavior: "float"
        }
    },
    about: {
        title: "The Brokkr Story",
        subtitle: "Premium Genetics Forged with Dwarven Precision",
        image: "img/dwarf-breeder.jpg",
        description: "Founded by a collective of passionate cannabis craftsmen with decades of combined experience, Brokkr Seeds was born from a simple mission: to forge exceptional cannabis genetics that are accessible to real growers.\n\nLike the mythical dwarven smiths who crafted legendary treasures in their mountain forges, we meticulously select, test, and perfect our genetics through rigorous breeding programs. Each strain is carefully hammered into its final form through multiple generations of selection.\n\nOur name pays homage to Brokkr, the dwarven smith of Norse mythology who crafted mighty artifacts for the gods. In that same tradition, we create seeds worthy of the most discerning growers.",
        teamMembers: [
            {
                name: "Master Brokkr",
                title: "Lead Geneticist & Founder",
                bio: "With over 20 years of breeding experience, Master Brokkr has developed some of the most exceptional cannabis genetics in the industry.",
                image: "img/team1.jpg"
            },
            {
                name: "Sindri",
                title: "Strain Curator",
                bio: "Responsible for selecting and preserving our collection of rare genetics, Sindri ensures that only the finest traits make it to our final products.",
                image: "img/team2.jpg"
            }
        ],
        historyItems: [
            {
                year: "2018",
                title: "The Forge Begins",
                description: "The first Dwarven Forged genetics were developed in our mountain breeding facility."
            },
            {
                year: "2020",
                title: "Anvil Series Launch",
                description: "Our flagship collection of heavy-hitting strains was released to critical acclaim."
            },
            {
                year: "2022",
                title: "Heirloom Treasures Recovery",
                description: "Rare landrace genetics were recovered and preserved in our genetic vault."
            },
            {
                year: "2024",
                title: "Global Distribution",
                description: "DwarvenForged strains became available to growers worldwide."
            }
        ]
    },
    products: {
        defaultStatus: "available",
        enableRatings: true,
        showPackOptions: true,
        defaultPackOptions: [
            { size: "3 Pack", regularPrice: 35, salePrice: 30 },
            { size: "6 Pack", regularPrice: 60, salePrice: 55 },
            { size: "10 Pack", regularPrice: 95, salePrice: 80 }
        ],
        items: {
            "dwarf-hammer": {
                id: "dwarf-hammer",
                name: "Dwarf Hammer",
                type: "Anvil Series",
                dominance: "indica",
                status: "in-stock",
                delivery: "physical",
                image: "img/strains/dwarf-hammer.jpg",
                additionalImages: ["img/strains/dwarf-hammer-detail1.jpg"],
                description: "Our flagship strain, Dwarf Hammer hits with the force of a dwarven smithing hammer. This indica-dominant powerhouse produces dense, resin-covered nuggets with a knockout effect.",
                variety: "Autoflower",
                rating: "24-26% THC",
                origin: "Gorilla Glue #4 × Anvil #8 FEM F7",
                rarity: "Premium",
                details: "Flowering Time: 12 weeks\nStretch: Medium\nYield: High\nHeight: Medium\nTHC: 24-26%\nCBD: 0.1%\nEffects: Relaxing, Sedative, Euphoric, Pain Relief\nFlavors: Earthy, Pine",
                notes: "Our flagship strain, perfect for evening use and pain management. Easy to grow with exceptional yields.",
                packOptions: [
                    { size: "6 Pack", regularPrice: 60, salePrice: 55 },
                    { size: "10 Pack", regularPrice: 95, salePrice: 80 },
                    { size: "40 Pack", regularPrice: 320, salePrice: 280 }
                ]
            },
            "thors-hammer": {
                id: "thors-hammer",
                name: "Thor's Hammer",
                type: "Anvil Series",
                dominance: "hybrid",
                status: "limited",
                delivery: "physical",
                image: "img/strains/thors-hammer.jpg",
                additionalImages: [],
                description: "Worthy of the god of thunder himself, Thor's Hammer balances power and finesse with a perfect mix of relaxation and euphoria. Expect lightning-fast growth and thunderous potency.",
                variety: "Photoperiod",
                rating: "25-27% THC",
                origin: "Wedding Cake × Mjolnir OG",
                rarity: "Limited Edition",
                details: "Flowering Time: 9 weeks\nStretch: Medium\nYield: High\nHeight: Medium\nTHC: 25-27%\nCBD: 0.1%\nEffects: Balanced, Euphoric, Social, Relaxing\nFlavors: Sweet, Vanilla, Earthy",
                notes: "A perfectly balanced hybrid with exceptional bag appeal and flavor. Limited quantities available.",
                packOptions: [
                    { size: "3 Pack", regularPrice: 40, salePrice: 35 },
                    { size: "6 Pack", regularPrice: 70, salePrice: 60 },
                    { size: "10 Pack", regularPrice: 100, salePrice: 90 }
                ]
            },
            "runefire-haze": {
                id: "runefire-haze",
                name: "Runefire Haze",
                type: "Forge Collection",
                dominance: "sativa",
                status: "coming-soon",
                delivery: "physical",
                image: "img/strains/runefire-haze.jpg",
                additionalImages: [],
                description: "Inscribed with the ancient runes of energy and creativity, Runefire Haze delivers an uplifting, cerebral experience with notes of tropical fruit and spice.",
                variety: "Photoperiod",
                rating: "22-24% THC",
                origin: "Super Silver Haze × Forge Fuel",
                rarity: "Rare",
                details: "Flowering Time: 10-11 weeks\nStretch: High\nYield: Medium-High\nHeight: Tall\nTHC: 22-24%\nCBD: 0.1%\nEffects: Energetic, Creative, Focused, Uplifting\nFlavors: Citrus, Spice, Tropical",
                notes: "Coming soon! Join our waiting list to be notified when this energizing sativa becomes available.",
                packOptions: [
                    { size: "6 Pack", regularPrice: 60, salePrice: 55 }
                ]
            },
            "mountain-forge": {
                id: "mountain-forge",
                name: "Mountain Forge",
                type: "Forge Collection",
                dominance: "indica",
                status: "sold-out",
                delivery: "physical",
                image: "img/strains/mountain-forge.jpg",
                additionalImages: [],
                description: "A rugged strain forged in the mountain halls, this autoflowering indica produces dense, crystal-covered nugs with remarkable speed. Perfect for stealth grows or quick harvests.",
                variety: "Autoflower",
                rating: "20-22% THC",
                origin: "Anvil Kush × Ruderalis",
                rarity: "Standard",
                details: "Flowering Time: 65-70 days from seed\nStretch: Low\nYield: Medium\nHeight: Short\nTHC: 20-22%\nCBD: 0.2%\nEffects: Relaxing, Sleep-inducing, Stress Relief\nFlavors: Earthy, Kush, Diesel",
                notes: "Currently sold out. New stock expected in the coming months.",
                packOptions: [
                    { size: "6 Pack", regularPrice: 55, salePrice: 50 }
                ]
            },
            "ancient-relic": {
                id: "ancient-relic",
                name: "Ancient Relic",
                type: "Heirloom Treasures",
                dominance: "hybrid",
                status: "sold-out",
                delivery: "physical",
                image: "img/strains/ancient-relic.jpg",
                additionalImages: [],
                description: "Preserved from the ancient world, this heirloom strain carries the pure genetics of cannabis from another age. Experience a balanced effect with complex terpene profiles lost to modern hybridization.",
                variety: "Photoperiod",
                rating: "16-18% THC",
                origin: "Hindu Kush Landrace × Thai Landrace",
                rarity: "Very Rare",
                details: "Flowering Time: 10-11 weeks\nStretch: Medium\nYield: Medium\nHeight: Medium-Tall\nTHC: 16-18%\nCBD: 0.5%\nEffects: Meditative, Clear-headed, Relaxing\nFlavors: Spicy, Sandalwood, Floral",
                notes: "These rare regular seeds produce both male and female plants, perfect for breeders.",
                packOptions: [
                    { size: "12 Pack", regularPrice: 85, salePrice: 75 }
                ]
            },
            "allfather-kush": {
                id: "allfather-kush",
                name: "Allfather Kush",
                type: "Heirloom Treasures",
                dominance: "indica",
                status: "limited",
                delivery: "physical",
                image: "img/strains/allfather-kush.jpg",
                additionalImages: [],
                description: "Descended from ancient Afghan mountains, Allfather Kush brings wisdom and deep relaxation with traditional hash-plant characteristics and exceptional resin production.",
                variety: "Photoperiod",
                rating: "20-22% THC",
                origin: "Hindu Kush × Afghan #1",
                rarity: "Rare",
                details: "Flowering Time: 9-10 weeks\nStretch: Low\nYield: Medium-High\nHeight: Short\nTHC: 20-22%\nCBD: 0.4%\nEffects: Relaxing, Sedative, Euphoric, Meditative\nFlavors: Hash, Spice, Earthy",
                notes: "Perfect for hash production. These regular seeds allow for breeding and selection.",
                packOptions: [
                    { size: "5 Pack", regularPrice: 50, salePrice: 45 },
                    { size: "10 Pack", regularPrice: 90, salePrice: 80 }
                ]
            },
            "growing-guide": {
                id: "growing-guide",
                name: "Dwarven Growing Guide",
                type: "Digital Product",
                dominance: "hybrid",
                status: "available",
                delivery: "digital",
                digitalContent: "https://www.example.com/downloads/growing-guide.pdf",
                image: "img/growing-guide.jpg",
                additionalImages: [],
                description: "Our complete growing guide with tips and tricks from the Dwarven master growers. Learn how to maximize yields and potency with our step-by-step instructions.",
                variety: "Comprehensive Guide",
                rating: "5/5",
                origin: "DwarvenForged Research",
                rarity: "Essential",
                details: "Over 100 pages of growing information including:\n- Nutrient schedules\n- Lighting tips\n- Environmental control\n- Strain-specific advice\n- Troubleshooting common issues",
                notes: "Digital product - instant access after purchase. Perfect companion for our genetics."
            }
        }
    },
    navigation: [
        {
            name: "Collections",
            url: "#catalog"
        },
        {
            name: "Seed Catalog",
            url: "#seed-catalog"
        },
        {
            name: "Genetics Explorer",
            url: "#genetics-explorer"
        },
        {
            name: "Our Forge",
            url: "#about"
        }
    ],
    friendLinks: [
        {
            name: "StrainNavigator",
            url: "https://www.strainnavigator.com"
        },
        {
            name: "BuildASoil",
            url: "https://buildasoil.com"
        },
        {
            name: "GrowDiaries",
            url: "https://growdiaries.com"
        }
    ],
    advanced: {
        enableShop: true,
        enableLocalStorage: true,
        checkoutMethod: "email",
        externalCheckoutUrl: "",
        analyticsId: "",
        orderEmail: "orders@dwarvenforged.com"
    }
};