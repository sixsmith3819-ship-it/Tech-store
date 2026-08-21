-- ============================================================================
-- DEMO WALLET SYSTEM - Complete Schema & Functions
-- ============================================================================

-- ============================================================================
-- 1. WALLETS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance DECIMAL(12, 2) NOT NULL CHECK (balance >= 0) DEFAULT 10000.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- ============================================================================
-- 2. WALLET TRANSACTIONS TABLE (Audit Trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('initial_balance', 'purchase', 'reset', 'refund', 'demo_top_up')),
  amount DECIMAL(12, 2) NOT NULL,
  balance_before DECIMAL(12, 2) NOT NULL,
  balance_after DECIMAL(12, 2) NOT NULL,
  reference TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON wallet_transactions(type);

-- ============================================================================
-- 3. ADD PAYMENT METHOD COLUMN TO ORDERS
-- ============================================================================

ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'demo_money' CHECK (payment_method IN ('demo_money', 'card', 'bank_transfer'));

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own wallet" ON wallets;
DROP POLICY IF EXISTS "Service role can read all wallets" ON wallets;
DROP POLICY IF EXISTS "Service role can insert wallets" ON wallets;
DROP POLICY IF EXISTS "Service role can update wallets" ON wallets;
DROP POLICY IF EXISTS "Users can read own transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Service role can read all transactions" ON wallet_transactions;
DROP POLICY IF EXISTS "Service role can insert transactions" ON wallet_transactions;

-- Users can read their own wallet
CREATE POLICY "Users can read own wallet"
  ON wallets FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all wallets
CREATE POLICY "Service role can read all wallets"
  ON wallets FOR SELECT
  USING (auth.role() = 'service_role');

-- Only service role can insert wallets (via function)
CREATE POLICY "Service role can insert wallets"
  ON wallets FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can update wallets (via function)
CREATE POLICY "Service role can update wallets"
  ON wallets FOR UPDATE
  USING (auth.role() = 'service_role');

-- Users can read their own transactions
CREATE POLICY "Users can read own transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can read all transactions
CREATE POLICY "Service role can read all transactions"
  ON wallet_transactions FOR SELECT
  USING (auth.role() = 'service_role');

-- Only service role can insert transactions (via function)
CREATE POLICY "Service role can insert transactions"
  ON wallet_transactions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- 5. TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_wallet_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_wallets_updated_at ON wallets;
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_wallet_updated_at_column();

-- ============================================================================
-- 6. FUNCTION: CREATE USER WALLET
-- ============================================================================

CREATE OR REPLACE FUNCTION create_user_wallet(p_user_id UUID)
RETURNS TABLE(success BOOLEAN, wallet_id UUID, balance DECIMAL) AS $$
DECLARE
  v_wallet_id UUID;
  v_initial_balance DECIMAL := 10000.00;
BEGIN
  -- Check if wallet already exists
  SELECT id INTO v_wallet_id FROM wallets WHERE user_id = p_user_id;
  
  IF v_wallet_id IS NOT NULL THEN
    RETURN QUERY SELECT TRUE, v_wallet_id, v_initial_balance::DECIMAL;
    RETURN;
  END IF;

  -- Create wallet
  INSERT INTO wallets (user_id, balance)
  VALUES (p_user_id, v_initial_balance)
  RETURNING wallets.id INTO v_wallet_id;

  -- Record initial transaction
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, balance_before, balance_after, description)
  VALUES (v_wallet_id, p_user_id, 'initial_balance', v_initial_balance, 0, v_initial_balance, 'Initial demo wallet balance');

  RETURN QUERY SELECT TRUE, v_wallet_id, v_initial_balance::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. FUNCTION: PROCESS DEMO CHECKOUT (Atomic Payment Processing)
-- ============================================================================

CREATE OR REPLACE FUNCTION process_demo_checkout(
  p_user_id UUID,
  p_order_total DECIMAL,
  p_order_data JSONB
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance DECIMAL, required DECIMAL, available DECIMAL) AS $$
DECLARE
  v_wallet_id UUID;
  v_current_balance DECIMAL;
  v_order_number TEXT;
BEGIN
  v_order_number := p_order_data->>'order_number';

  -- Get wallet with row lock
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  -- Check if wallet exists
  IF v_wallet_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Wallet not found', NULL::DECIMAL, p_order_total, 0::DECIMAL;
    RETURN;
  END IF;

  -- Check sufficient balance
  IF v_current_balance < p_order_total THEN
    RETURN QUERY SELECT FALSE, 'Insufficient funds', v_current_balance::DECIMAL, p_order_total, v_current_balance::DECIMAL;
    RETURN;
  END IF;

  -- Deduct from wallet
  UPDATE wallets
  SET balance = balance - p_order_total
  WHERE id = v_wallet_id
  RETURNING balance INTO v_current_balance;

  -- Record transaction
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, balance_before, balance_after, reference, description)
  VALUES (v_wallet_id, p_user_id, 'purchase', p_order_total, v_current_balance + p_order_total, v_current_balance, v_order_number, 'Purchase - Order ' || v_order_number);

  RETURN QUERY SELECT TRUE, 'Payment processed successfully', v_current_balance::DECIMAL, p_order_total, v_current_balance::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. FUNCTION: RESET DEMO WALLET
-- ============================================================================

CREATE OR REPLACE FUNCTION reset_demo_wallet(p_user_id UUID)
RETURNS TABLE(success BOOLEAN, new_balance DECIMAL) AS $$
DECLARE
  v_wallet_id UUID;
  v_old_balance DECIMAL;
  v_new_balance DECIMAL := 10000.00;
BEGIN
  -- Get wallet
  SELECT id, balance INTO v_wallet_id, v_old_balance
  FROM wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::DECIMAL;
    RETURN;
  END IF;

  -- Update balance
  UPDATE wallets
  SET balance = v_new_balance
  WHERE id = v_wallet_id;

  -- Record reset transaction
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, balance_before, balance_after, description)
  VALUES (v_wallet_id, p_user_id, 'reset', v_new_balance - v_old_balance, v_old_balance, v_new_balance, 'Wallet reset to demo balance');

  RETURN QUERY SELECT TRUE, v_new_balance::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. FUNCTION: REFUND WALLET
-- ============================================================================

CREATE OR REPLACE FUNCTION refund_wallet(
  p_user_id UUID,
  p_amount DECIMAL,
  p_reference TEXT
)
RETURNS TABLE(success BOOLEAN, new_balance DECIMAL) AS $$
DECLARE
  v_wallet_id UUID;
  v_old_balance DECIMAL;
  v_new_balance DECIMAL;
BEGIN
  -- Get wallet
  SELECT id, balance INTO v_wallet_id, v_old_balance
  FROM wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::DECIMAL;
    RETURN;
  END IF;

  -- Calculate new balance
  v_new_balance := v_old_balance + p_amount;

  -- Update balance
  UPDATE wallets
  SET balance = v_new_balance
  WHERE id = v_wallet_id;

  -- Record refund transaction
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, balance_before, balance_after, reference, description)
  VALUES (v_wallet_id, p_user_id, 'refund', p_amount, v_old_balance, v_new_balance, p_reference, 'Refund - ' || p_reference);

  RETURN QUERY SELECT TRUE, v_new_balance::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. FUNCTION: TOP UP DEMO WALLET
-- ============================================================================

CREATE OR REPLACE FUNCTION topup_demo_wallet(
  p_user_id UUID,
  p_amount DECIMAL
)
RETURNS TABLE(success BOOLEAN, message TEXT, new_balance DECIMAL) AS $$
DECLARE
  v_wallet_id UUID;
  v_old_balance DECIMAL;
  v_new_balance DECIMAL;
  v_max_topup DECIMAL := 5000.00;
BEGIN
  -- Validate amount
  IF p_amount <= 0 OR p_amount > v_max_topup THEN
    RETURN QUERY SELECT FALSE, 'Top-up amount must be between $1 and $' || v_max_topup || '.00', NULL::DECIMAL;
    RETURN;
  END IF;

  -- Get wallet
  SELECT id, balance INTO v_wallet_id, v_old_balance
  FROM wallets
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_wallet_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Wallet not found', NULL::DECIMAL;
    RETURN;
  END IF;

  -- Calculate new balance
  v_new_balance := v_old_balance + p_amount;

  -- Update balance
  UPDATE wallets
  SET balance = v_new_balance
  WHERE id = v_wallet_id;

  -- Record top-up transaction
  INSERT INTO wallet_transactions (wallet_id, user_id, type, amount, balance_before, balance_after, description)
  VALUES (v_wallet_id, p_user_id, 'demo_top_up', p_amount, v_old_balance, v_new_balance, 'Demo wallet top-up');

  RETURN QUERY SELECT TRUE, 'Top-up successful', v_new_balance::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- END OF WALLET SCHEMA
-- ============================================================================
