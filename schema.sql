-- ============================================================================
-- SITEPACKAGES - Supabase Schema
-- ============================================================================
-- General-purpose store template for physical or digital products
-- Cart functionality can be enabled/disabled via config.js
--
-- Run this in your Supabase SQL Editor to set up all required tables
--
-- REQUIRED TABLES (for auth to work):
--   - user_profiles
--   - user_roles
--
-- OPTIONAL TABLES (enable what you need):
--   - products (if storing products in DB vs config.js)
--   - orders, order_items (if processing orders server-side)
--   - community_listings, user_badges
--   - boards, posts, replies (forum)
--
-- STORAGE:
--   - product-images bucket (for backup storage, not live serving)
-- ============================================================================

-- ============================================================================
-- REQUIRED: Core Auth Tables
-- ============================================================================

-- User profiles - extends Supabase auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name VARCHAR(24),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    is_public BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles for permission system
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('USER', 'MODERATOR', 'ADMIN', 'OWNER')),
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges (optional recognition system)
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_type VARCHAR(50) NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- ============================================================================
-- OPTIONAL: Products Table
-- ============================================================================
-- Use this if you want to store products in database instead of config.js
-- For simple stores, config.js products work fine
-- Database is better for: dynamic inventory, multiple admins, API access

CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(50) UNIQUE,  -- user-friendly ID like 'product-1'
    name VARCHAR(200) NOT NULL,
    type VARCHAR(100),  -- category/collection
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'sold-out', 'coming-soon', 'hidden')),
    description TEXT,
    details TEXT,
    notes TEXT,
    image_url TEXT,  -- primary image (external URL recommended)
    additional_images TEXT[] DEFAULT '{}',  -- array of image URLs
    rating VARCHAR(20),
    origin VARCHAR(100),
    variety VARCHAR(100),
    is_digital BOOLEAN DEFAULT false,  -- physical vs digital product
    download_url TEXT,  -- for digital products
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product pricing options (multiple pack sizes/variants)
CREATE TABLE IF NOT EXISTS product_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    option_name VARCHAR(100) NOT NULL,  -- e.g., '3 Pack', 'Small', 'Digital'
    regular_price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock_quantity INTEGER,  -- NULL = unlimited
    sku VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OPTIONAL: Orders (if processing orders server-side)
-- ============================================================================
-- For simple stores, you might just use PayPal/Stripe directly
-- These tables are for stores that need order history, admin dashboard, etc.

CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),  -- NULL for guest checkout
    order_number VARCHAR(50) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal DECIMAL(10,2),
    tax DECIMAL(10,2) DEFAULT 0,
    shipping DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_id VARCHAR(100),  -- PayPal/Stripe transaction ID
    customer_email VARCHAR(255),
    customer_name VARCHAR(200),
    shipping_address JSONB,
    billing_address JSONB,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    product_name VARCHAR(200),  -- snapshot at time of order
    option_name VARCHAR(100),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    is_digital BOOLEAN DEFAULT false,
    download_url TEXT,  -- for digital items
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OPTIONAL: Community Features
-- ============================================================================

-- Community listings (seller/breeder showcase)
CREATE TABLE IF NOT EXISTS community_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    image_url TEXT,
    tagline VARCHAR(255),
    instagram VARCHAR(100),
    twitter VARCHAR(100),
    discord VARCHAR(100),
    website VARCHAR(255),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User media gallery
CREATE TABLE IF NOT EXISTS user_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(20) DEFAULT 'image',
    title VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OPTIONAL: Forum/Discussion Tables
-- ============================================================================

-- Discussion boards
CREATE TABLE IF NOT EXISTS boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Post replies
CREATE TABLE IF NOT EXISTS replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_product_options_product_id ON product_options(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_community_listings_user_id ON community_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_community_listings_public ON community_listings(is_public);
CREATE INDEX IF NOT EXISTS idx_user_media_user_id ON user_media(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_board_id ON posts(board_id);
CREATE INDEX IF NOT EXISTS idx_replies_post_id ON replies(post_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- ============================================================================
-- Note: The proxy uses service_role key which bypasses RLS
-- These policies are for direct Supabase client access if needed

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Public profiles are viewable by all
CREATE POLICY "Public profiles are viewable" ON user_profiles
    FOR SELECT USING (is_public = true);

-- Products are publicly viewable (if not hidden)
CREATE POLICY "Products are publicly viewable" ON products
    FOR SELECT USING (status != 'hidden');

-- Users can view their own orders
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

-- ============================================================================
-- STORAGE BUCKET SETUP
-- ============================================================================
-- Run this in Supabase Dashboard > Storage > New Bucket
--
-- Bucket: product-images
-- Public: false (use for backup, not live serving)
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp
--
-- NOTE: Images should be stored here for BACKUP purposes only.
-- For live serving, use external URLs (your own hosting, Cloudinary, etc.)
-- This keeps Supabase bandwidth costs down.

-- ============================================================================
-- INITIAL DATA (Optional)
-- ============================================================================

-- Create a default board for discussions
INSERT INTO boards (name, description)
VALUES ('General Discussion', 'General chat and community discussion')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- NOTES FOR TEMPLATE USERS
-- ============================================================================
--
-- 1. REQUIRED: user_profiles and user_roles tables must exist for auth to work
--
-- 2. PRODUCTS: You can either:
--    a) Use config.js products (simpler, no DB needed for products)
--    b) Use the products table (better for dynamic inventory, multiple admins)
--    The choice depends on your needs - config.js is fine for most small stores
--
-- 3. ORDERS: Only needed if you want server-side order processing
--    For simple PayPal/Stripe checkout, you might not need these tables
--
-- 4. ENVIRONMENT VARIABLES: Set these in Netlify:
--    - SUPABASE_URL (your project URL)
--    - SUPABASE_ANON_KEY (public anon key)
--    - SUPABASE_SERVICE_ROLE_KEY (service role key - keep secret!)
--
-- 5. UPDATE THE REDIRECT URL: In supabase-proxy.js, find the resetPassword
--    action and change the redirectTo URL to your domain
--
-- 6. CART: Enable/disable cart in config.js:
--    siteConfig.cart.enabled = true/false
--
-- 7. DIGITAL PRODUCTS: Set is_digital=true and provide download_url
--    The cart/checkout handles digital vs physical differently
--
-- ============================================================================
