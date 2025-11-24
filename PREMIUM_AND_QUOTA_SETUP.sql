-- ============================================
-- EVENTMAP PREMIUM & QUOTA SYSTEM SETUP
-- Etkinlik Kota Sistemi ve Premium Özellikler
-- ============================================

-- 1. Premium subscription period için enum (isteğe bağlı)
DO $$ BEGIN
    CREATE TYPE subscription_period AS ENUM ('monthly', 'yearly');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Premium subscriptions tablosu (ödeme takibi için)
CREATE TABLE IF NOT EXISTS premium_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    subscription_type subscription_period NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    stripe_subscription_id TEXT, -- Stripe/Iyzico ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Event creation tracking tablosu (kota kontrolü için)
CREATE TABLE IF NOT EXISTS user_event_quota (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL, -- Format: "2025-01"
    event_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month_year)
);

-- 4. Index'ler (performance için)
CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_user_id
ON premium_subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_premium_subscriptions_expires_at
ON premium_subscriptions(expires_at);

CREATE INDEX IF NOT EXISTS idx_user_event_quota_user_month
ON user_event_quota(user_id, month_year);

-- 5. Fonksiyon: Kullanıcının premium olup olmadığını kontrol et
CREATE OR REPLACE FUNCTION is_user_premium(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_premium BOOLEAN;
BEGIN
    -- Check if user has active premium subscription
    SELECT EXISTS (
        SELECT 1 FROM premium_subscriptions
        WHERE user_id = p_user_id
        AND is_active = TRUE
        AND expires_at > NOW()
    ) INTO v_is_premium;

    -- Also check profiles.is_premium (manuel olarak set edilmiş olabilir)
    IF NOT v_is_premium THEN
        SELECT is_premium INTO v_is_premium
        FROM profiles
        WHERE id = p_user_id;
    END IF;

    RETURN COALESCE(v_is_premium, FALSE);
END;
$$ LANGUAGE plpgsql;

-- 6. Fonksiyon: Bu ay kaç etkinlik oluşturuldu?
CREATE OR REPLACE FUNCTION get_monthly_event_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
    v_current_month TEXT;
BEGIN
    -- Get current month in format "YYYY-MM"
    v_current_month := TO_CHAR(NOW(), 'YYYY-MM');

    SELECT COALESCE(event_count, 0) INTO v_count
    FROM user_event_quota
    WHERE user_id = p_user_id
    AND month_year = v_current_month;

    RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql;

-- 7. Fonksiyon: Etkinlik oluşturma kotası kontrolü
CREATE OR REPLACE FUNCTION can_create_event(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_premium BOOLEAN;
    v_event_count INTEGER;
BEGIN
    -- Check if user is premium
    v_is_premium := is_user_premium(p_user_id);

    -- Premium users have unlimited quota
    IF v_is_premium THEN
        RETURN TRUE;
    END IF;

    -- Non-premium users: check monthly quota (max 1 event per month)
    v_event_count := get_monthly_event_count(p_user_id);

    RETURN v_event_count < 1;
END;
$$ LANGUAGE plpgsql;

-- 8. Fonksiyon: Etkinlik oluşturduktan sonra kotayı artır
CREATE OR REPLACE FUNCTION increment_event_quota()
RETURNS TRIGGER AS $$
DECLARE
    v_current_month TEXT;
BEGIN
    -- Get current month
    v_current_month := TO_CHAR(NOW(), 'YYYY-MM');

    -- Insert or update quota
    INSERT INTO user_event_quota (user_id, month_year, event_count)
    VALUES (NEW.creator_id, v_current_month, 1)
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET
        event_count = user_event_quota.event_count + 1,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Trigger: Etkinlik oluşturulunca kotayı artır
DROP TRIGGER IF EXISTS trigger_increment_event_quota ON events;
CREATE TRIGGER trigger_increment_event_quota
AFTER INSERT ON events
FOR EACH ROW
EXECUTE FUNCTION increment_event_quota();

-- 10. Fonksiyon: Expired premium subscriptions'ları deaktif et
CREATE OR REPLACE FUNCTION deactivate_expired_subscriptions()
RETURNS void AS $$
BEGIN
    UPDATE premium_subscriptions
    SET is_active = FALSE,
        updated_at = NOW()
    WHERE expires_at < NOW()
    AND is_active = TRUE;

    -- Also update profiles table
    UPDATE profiles p
    SET is_premium = FALSE
    WHERE is_premium = TRUE
    AND NOT EXISTS (
        SELECT 1 FROM premium_subscriptions ps
        WHERE ps.user_id = p.id
        AND ps.is_active = TRUE
        AND ps.expires_at > NOW()
    );
END;
$$ LANGUAGE plpgsql;

-- 11. RLS Policies
ALTER TABLE premium_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_event_quota ENABLE ROW LEVEL SECURITY;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
ON premium_subscriptions FOR SELECT
USING (auth.uid() = user_id);

-- Users can view their own quota
CREATE POLICY "Users can view own quota"
ON user_event_quota FOR SELECT
USING (auth.uid() = user_id);

-- 12. Helper view for easy quota checking
CREATE OR REPLACE VIEW user_quota_status AS
SELECT
    p.id as user_id,
    p.email,
    p.is_premium,
    is_user_premium(p.id) as has_active_premium,
    get_monthly_event_count(p.id) as events_this_month,
    can_create_event(p.id) as can_create_new_event,
    TO_CHAR(NOW(), 'YYYY-MM') as current_month
FROM profiles p;

-- ============================================
-- TEST QUERIES (optional)
-- ============================================

-- Bir kullanıcının premium olup olmadığını kontrol et:
-- SELECT is_user_premium('user-uuid-here');

-- Bu ay kaç etkinlik oluşturulmuş:
-- SELECT get_monthly_event_count('user-uuid-here');

-- Yeni etkinlik oluşturabilir mi:
-- SELECT can_create_event('user-uuid-here');

-- Tüm kullanıcıların kota durumu:
-- SELECT * FROM user_quota_status;

-- ============================================
-- BAŞARILI! Premium ve Kota Sistemi Hazır
-- ============================================

-- NOT: Frontend'de kullanım örneği:
--
-- 1. Etkinlik oluşturma butonu:
--    - can_create_event() fonksiyonunu kontrol et
--    - False ise Premium modal'ı göster
--
-- 2. Profil sayfasında:
--    - user_quota_status view'ini kullan
--    - "Bu ay X/1 etkinlik oluşturdunuz" göster
--
-- 3. Premium satın alma:
--    - premium_subscriptions tablosuna insert
--    - expires_at'i hesapla (aylık: +30 gün, yıllık: +365 gün)
