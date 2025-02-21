-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'vendor', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  business_id TEXT UNIQUE NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'FI',
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES users(id),
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')
  ),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Booking services junction table
CREATE TABLE IF NOT EXISTS booking_services (
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  price_at_time DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (booking_id, service_id)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partially_refunded')
  ),
  payment_method TEXT NOT NULL CHECK (
    payment_method IN ('card', 'mobilepay', 'invoice')
  ),
  payment_intent_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Vendor wallets table
CREATE TABLE IF NOT EXISTS vendor_wallets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  balance DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
  total_earnings DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_withdrawals DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  total_commissions DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  last_withdrawal_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(vendor_id)
);

-- Wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES vendor_wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (
    type IN ('earning', 'withdrawal', 'commission', 'refund', 'adjustment')
  ),
  amount DECIMAL(12,2) NOT NULL,
  balance_after DECIMAL(12,2) NOT NULL CHECK (balance_after >= 0),
  description TEXT NOT NULL,
  reference TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL
);

-- Bank accounts table
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  account_holder TEXT NOT NULL,
  iban TEXT NOT NULL,
  bic TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  verification_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(vendor_id, iban)
);

-- Withdrawal requests table
CREATE TABLE IF NOT EXISTS withdrawal_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES vendor_wallets(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')
  ),
  processed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  transaction_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Commission settings table
CREATE TABLE IF NOT EXISTS commission_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  percentage DECIMAL(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  applies_from TIMESTAMP WITH TIME ZONE NOT NULL,
  applies_to TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Commission records table
CREATE TABLE IF NOT EXISTS commission_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES vendor_wallets(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  setting_id UUID REFERENCES commission_settings(id),
  amount DECIMAL(12,2) NOT NULL CHECK (amount >= 0),
  percentage DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processed', 'failed')),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Transaction logs table
CREATE TABLE IF NOT EXISTS transaction_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (
    action IN ('payment', 'refund', 'commission', 'invoice')
  ),
  status TEXT NOT NULL CHECK (
    status IN ('success', 'failure')
  ),
  amount DECIMAL(12,2) NOT NULL,
  metadata JSONB,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Wallet audit log
CREATE TABLE IF NOT EXISTS wallet_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wallet_id UUID REFERENCES vendor_wallets(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB NOT NULL,
  performed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_wallet_transactions_wallet_id_created_at 
  ON wallet_transactions(wallet_id, created_at DESC);

CREATE INDEX idx_wallet_transactions_type_created_at 
  ON wallet_transactions(type, created_at DESC);

CREATE INDEX idx_withdrawal_requests_wallet_id_status 
  ON withdrawal_requests(wallet_id, status);

CREATE INDEX idx_commission_records_wallet_id_status 
  ON commission_records(wallet_id, status);

CREATE INDEX idx_bank_accounts_vendor_id 
  ON bank_accounts(vendor_id);

CREATE INDEX idx_wallet_audit_logs_wallet_id_created_at 
  ON wallet_audit_logs(wallet_id, created_at DESC);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendor_wallets_updated_at
    BEFORE UPDATE ON vendor_wallets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_accounts_updated_at
    BEFORE UPDATE ON bank_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_withdrawal_requests_updated_at
    BEFORE UPDATE ON withdrawal_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_settings_updated_at
    BEFORE UPDATE ON commission_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function for wallet balance updates
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        -- Update wallet balance and totals based on transaction type
        UPDATE vendor_wallets
        SET balance = NEW.balance_after,
            total_earnings = CASE 
              WHEN NEW.type = 'earning' THEN total_earnings + NEW.amount
              ELSE total_earnings
            END,
            total_withdrawals = CASE 
              WHEN NEW.type = 'withdrawal' THEN total_withdrawals + ABS(NEW.amount)
              ELSE total_withdrawals
            END,
            total_commissions = CASE 
              WHEN NEW.type = 'commission' THEN total_commissions + ABS(NEW.amount)
              ELSE total_commissions
            END
        WHERE id = NEW.wallet_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_wallet_balance
    AFTER INSERT ON wallet_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_balance();

-- Enable Row Level Security
ALTER TABLE vendor_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Vendor wallets
CREATE POLICY "Vendors can view their own wallet"
    ON vendor_wallets
    FOR SELECT
    USING (vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    ));

-- Wallet transactions
CREATE POLICY "Vendors can view their wallet transactions"
    ON wallet_transactions
    FOR SELECT
    USING (wallet_id IN (
        SELECT id FROM vendor_wallets 
        WHERE vendor_id IN (
            SELECT id FROM vendors WHERE user_id = auth.uid()
        )
    ));

-- Bank accounts
CREATE POLICY "Vendors can manage their bank accounts"
    ON bank_accounts
    USING (vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    ));

-- Withdrawal requests
CREATE POLICY "Vendors can manage their withdrawal requests"
    ON withdrawal_requests
    USING (wallet_id IN (
        SELECT id FROM vendor_wallets 
        WHERE vendor_id IN (
            SELECT id FROM vendors WHERE user_id = auth.uid()
        )
    ));

-- Commission records
CREATE POLICY "Vendors can view their commission records"
    ON commission_records
    FOR SELECT
    USING (wallet_id IN (
        SELECT id FROM vendor_wallets 
        WHERE vendor_id IN (
            SELECT id FROM vendors WHERE user_id = auth.uid()
        )
    ));

-- Wallet audit logs
CREATE POLICY "Vendors can view their wallet audit logs"
    ON wallet_audit_logs
    FOR SELECT
    USING (wallet_id IN (
        SELECT id FROM vendor_wallets 
        WHERE vendor_id IN (
            SELECT id FROM vendors WHERE user_id = auth.uid()
        )
    ));

-- Admin policies
CREATE POLICY "Admins can view all wallets"
    ON vendor_wallets
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all wallet transactions"
    ON wallet_transactions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );

-- Initial commission setting
INSERT INTO commission_settings (
    name,
    percentage,
    applies_from
) VALUES (
    'Standard Commission',
    10.00,
    TIMEZONE('utc'::text, NOW())
) ON CONFLICT DO NOTHING;
