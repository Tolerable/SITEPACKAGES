// Product Data
// SITEPACKAGES - The store template that sells itself
// These are the package tiers sold through sitepackages.net

const products = {
    'starter-package': {
        id: 'starter-package',
        name: 'Starter',
        type: 'Package',
        status: 'available',
        // Text-based card with gradient
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardIcon: '📦',
        description: 'Perfect for simple stores. Static products, no database required.',
        details: 'The Starter package includes everything you need for a basic storefront: responsive product grid, detail modals, visual effects, and our setup wizard. Ideal for creators selling a small catalog of digital or physical products.',
        notes: 'One-time purchase. Includes all future updates. Deploy to any static hosting (Netlify, Vercel, GitHub Pages).',
        features: [
            'Full storefront template',
            'Product grid & detail pages',
            'Visual effects library',
            'Setup wizard',
            'Mobile responsive'
        ],
        variety: 'Basic',
        delivery: 'digital',
        isDigital: true,
        promotional: {
            enabled: true,
            type: 'new',
            value: null
        },
        packOptions: [
            { size: 'License', regularPrice: 29, salePrice: null }
        ]
    },
    'pro-package': {
        id: 'pro-package',
        name: 'Pro',
        type: 'Package',
        status: 'available',
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        cardIcon: '🚀',
        description: 'Full-featured store with user accounts and shopping cart.',
        details: 'Everything in Starter plus Supabase integration for user authentication, shopping cart, order management, and Netlify Functions for serverless backend. Perfect for stores that need user accounts and persistent carts.',
        notes: 'Requires Supabase account (free tier available). Includes migration scripts and backend setup guide.',
        features: [
            'Everything in Starter',
            'User authentication',
            'Supabase integration',
            'Shopping cart system',
            'Order management',
            'Netlify functions'
        ],
        variety: 'Professional',
        delivery: 'digital',
        isDigital: true,
        promotional: {
            enabled: true,
            type: 'sale',
            value: null
        },
        packOptions: [
            { size: 'License', regularPrice: 99, salePrice: 79 }
        ]
    },
    'business-package': {
        id: 'business-package',
        name: 'Business',
        type: 'Package',
        status: 'available',
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        cardIcon: '💼',
        description: 'Enterprise features for serious stores and communities.',
        details: 'Everything in Pro plus community features: forum system, user badges, role management, and priority support. Includes 1 hour of setup consultation. Ideal for brands building communities around their products.',
        notes: 'Includes 1 hour setup call, priority email support for 30 days, and custom branding consultation.',
        features: [
            'Everything in Pro',
            'Community features',
            'Forum system',
            'User badges & roles',
            'Priority support',
            'Custom branding help'
        ],
        variety: 'Enterprise',
        delivery: 'digital',
        isDigital: true,
        promotional: {
            enabled: true,
            type: 'limited',
            value: null
        },
        packOptions: [
            { size: 'License', regularPrice: 149, salePrice: null }
        ]
    },
    'addon-effects': {
        id: 'addon-effects',
        name: 'Effects Pack',
        type: 'Add-on',
        status: 'available',
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        cardIcon: '✨',
        description: 'Extra visual effects for your storefront.',
        details: 'Expand your visual effects library with particle systems, animated backgrounds, custom cursor effects, scroll animations, and loading screens. Works with any package tier.',
        notes: 'Compatible with Starter, Pro, and Business packages.',
        features: [
            'Particle systems',
            'Animated backgrounds',
            'Custom cursors',
            'Scroll effects',
            'Loading animations'
        ],
        variety: 'Enhancement',
        delivery: 'digital',
        isDigital: true,
        promotional: {
            enabled: false,
            type: 'none',
            value: null
        },
        packOptions: [
            { size: 'Add-on', regularPrice: 19, salePrice: null }
        ]
    },
    'addon-themes': {
        id: 'addon-themes',
        name: 'Theme Pack',
        type: 'Add-on',
        status: 'coming-soon',
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        cardIcon: '🎨',
        description: 'Pre-built color themes and style variations.',
        details: '10+ professional color schemes including dark/light modes, industry-specific presets (gaming, fashion, tech, nature), and one-click theme switching.',
        notes: 'Coming Q1 2025. Pre-order to lock in current pricing.',
        features: [
            '10+ color schemes',
            'Dark/light modes',
            'Industry presets',
            'One-click apply',
            'Customizable'
        ],
        variety: 'Cosmetic',
        delivery: 'digital',
        isDigital: true,
        promotional: {
            enabled: false,
            type: 'none',
            value: null
        },
        packOptions: [
            { size: 'Add-on', regularPrice: 29, salePrice: null }
        ]
    },
    'support-tier': {
        id: 'support-tier',
        name: 'Setup Support',
        type: 'Service',
        status: 'available',
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardIcon: '🛟',
        description: 'Get help setting up your store from the developer.',
        details: 'One-on-one setup assistance includes a 1-hour video call, config file review, deployment help, and 30 days of email support. Perfect if you want your store set up correctly the first time.',
        notes: 'Scheduling within 7 days of purchase. Video call via Discord or Google Meet.',
        features: [
            '1-hour setup call',
            'Config file review',
            'Deployment help',
            'Email support',
            '30-day assistance'
        ],
        variety: 'Support',
        delivery: 'digital',
        isDigital: true,
        promotional: {
            enabled: true,
            type: 'percentage',
            value: 20
        },
        packOptions: [
            { size: 'Session', regularPrice: 49, salePrice: 39 }
        ]
    }
};

// Make products available globally
window.products = products;
