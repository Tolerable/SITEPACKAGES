-- ============================================================================
-- SITEPACKAGES - Customer Licenses Migration
-- ============================================================================
-- Run this in Supabase SQL Editor to add license management
-- This allows customers to have unique IDs and manage their purchases
-- ============================================================================

-- Customer licenses table - tracks purchases and access
CREATE TABLE IF NOT EXISTS customer_licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    license_key VARCHAR(50) UNIQUE NOT NULL,  -- Unique key like 'SP-XXXXXXXX'
    product_id VARCHAR(50) NOT NULL,  -- References product from product-data.js
    package_tier VARCHAR(50) NOT NULL,  -- 'starter', 'pro', 'business'
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'expired', 'revoked')),

    -- Payment info
    order_id UUID REFERENCES orders(id),
    payment_provider VARCHAR(50),  -- 'kofi', 'paypal', 'stripe', 'manual'
    payment_id VARCHAR(100),  -- External transaction ID
    amount_paid DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',

    -- License details
    download_url TEXT,  -- Secure download link for template files
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 10,  -- Limit re-downloads

    -- Activation
    activated_at TIMESTAMPTZ,
    activation_domain VARCHAR(255),  -- Domain where template is deployed

    -- Support entitlement
    support_expires_at TIMESTAMPTZ,  -- When support access ends

    -- Timestamps
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,  -- NULL = lifetime license
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- License activations - track where licenses are used
CREATE TABLE IF NOT EXISTS license_activations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES customer_licenses(id) ON DELETE CASCADE,
    domain VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    activated_at TIMESTAMPTZ DEFAULT NOW(),
    deactivated_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true
);

-- License activity log - audit trail
CREATE TABLE IF NOT EXISTS license_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    license_id UUID REFERENCES customer_licenses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    action VARCHAR(50) NOT NULL,  -- 'purchased', 'activated', 'downloaded', 'deactivated', 'renewed', 'upgraded'
    details JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON customer_licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON customer_licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_licenses_status ON customer_licenses(status);
CREATE INDEX IF NOT EXISTS idx_license_activations_license_id ON license_activations(license_id);
CREATE INDEX IF NOT EXISTS idx_license_activity_license_id ON license_activity(license_id);

-- RLS Policies
ALTER TABLE customer_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_activations ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_activity ENABLE ROW LEVEL SECURITY;

-- Users can view their own licenses
CREATE POLICY "Users can view own licenses" ON customer_licenses
    FOR SELECT USING (auth.uid() = user_id);

-- Users can view their own license activations
CREATE POLICY "Users can view own activations" ON license_activations
    FOR SELECT USING (
        license_id IN (SELECT id FROM customer_licenses WHERE user_id = auth.uid())
    );

-- Users can view their own license activity
CREATE POLICY "Users can view own license activity" ON license_activity
    FOR SELECT USING (
        license_id IN (SELECT id FROM customer_licenses WHERE user_id = auth.uid())
    );

-- ============================================================================
-- HELPER FUNCTION: Generate License Key
-- ============================================================================

CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS VARCHAR(50)
LANGUAGE plpgsql
AS $$
DECLARE
    key_chars VARCHAR(36) := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result VARCHAR(50) := 'SP-';
    i INTEGER;
BEGIN
    -- Generate 4 groups of 4 characters: SP-XXXX-XXXX-XXXX-XXXX
    FOR group_num IN 1..4 LOOP
        IF group_num > 1 THEN
            result := result || '-';
        END IF;
        FOR i IN 1..4 LOOP
            result := result || substr(key_chars, floor(random() * 36 + 1)::integer, 1);
        END LOOP;
    END LOOP;
    RETURN result;
END;
$$;

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- License Keys Format: SP-XXXX-XXXX-XXXX-XXXX
--
-- Package Tiers:
--   - starter: Basic storefront template ($29)
--   - pro: Full store with auth + cart ($79)
--   - business: Enterprise with community features ($149)
--   - addon-effects: Visual effects expansion ($19)
--   - addon-themes: Theme pack ($29)
--   - support: Setup assistance ($49)
--
-- Flow:
-- 1. Customer purchases via Ko-fi/PayPal
-- 2. Webhook creates order + generates license
-- 3. Customer receives license key in email
-- 4. Customer logs in to sitepackages.net/account.html
-- 5. Customer sees their licenses + download links
-- 6. Customer activates license on their domain
-- 7. System tracks activations for support
--
-- ============================================================================
