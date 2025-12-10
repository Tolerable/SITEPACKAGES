// Product Data
// SITEPACKAGES - The store template that sells itself
// These are the package tiers sold through sitepackages.net

const products = {
    'starter-package': {
        id: 'starter-package',
        name: 'Starter',
        type: 'Package',
        status: 'available',
        // Text-based card properties (no image needed)
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cardIcon: '📦',
        description: 'Perfect for simple stores. Static products, no database required.',
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
        checkoutUrl: '', // Set your Ko-fi/PayPal link
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
        checkoutUrl: '', // Set your Ko-fi/PayPal link
        packOptions: [
            { size: 'License', regularPrice: 79, salePrice: null }
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
        features: [
            'Everything in Pro',
            'Community features',
            'Forum system',
            'User badges',
            'Priority support',
            'Custom branding help'
        ],
        variety: 'Enterprise',
        delivery: 'digital',
        isDigital: true,
        checkoutUrl: '', // Set your Ko-fi/PayPal link
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
        checkoutUrl: '', // Set your Ko-fi/PayPal link
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
        checkoutUrl: '',
        packOptions: [
            { size: 'Add-on', regularPrice: 29, salePrice: null }
        ]
    },
    'support-tier': {
        id: 'support-tier',
        name: 'Support',
        type: 'Service',
        status: 'available',
        cardStyle: 'text',
        cardBackground: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        cardIcon: '🛟',
        description: 'Get help setting up your store.',
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
        checkoutUrl: '', // Set your Ko-fi/PayPal link
        packOptions: [
            { size: 'Session', regularPrice: 49, salePrice: null }
        ]
    }
};

// Example of image-based product (for reference/template users)
// Uncomment and modify for traditional image-based products:
/*
const imageProductExample = {
    'sample-product': {
        id: 'sample-product',
        name: 'Sample Product',
        type: 'Category Name',
        status: 'available',
        // Image-based card (default behavior)
        cardStyle: 'image', // or just omit this property
        image: 'img/product.jpg',
        cardImage: 'img/product-square.jpg',
        description: 'Product description here.',
        details: 'Detailed information about the product.',
        notes: 'Additional notes.',
        variety: 'Type',
        rating: '5/5',
        origin: 'Source',
        images: [
            'img/product-detail1.jpg',
            'img/product-detail2.jpg'
        ],
        packOptions: [
            { size: 'Small', regularPrice: 25, salePrice: 20 },
            { size: 'Large', regularPrice: 45, salePrice: 40 }
        ]
    }
};
*/
