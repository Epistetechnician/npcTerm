-- Protocol metrics table
CREATE TABLE protocol_metrics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tvl NUMERIC,
  volume_24h NUMERIC,
  fees_24h NUMERIC,
  users_24h INTEGER,
  chains TEXT[],
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Token metrics table
CREATE TABLE token_metrics (
  id BIGSERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  symbol TEXT NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC,
  volume_24h NUMERIC,
  market_cap NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chain metrics table
CREATE TABLE chain_metrics (
  id BIGSERIAL PRIMARY KEY,
  chain TEXT NOT NULL,
  tvl NUMERIC,
  transactions_24h INTEGER,
  fees_24h NUMERIC,
  active_addresses_24h INTEGER,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DEX metrics table
CREATE TABLE dex_metrics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  volume_24h NUMERIC,
  tvl NUMERIC,
  trades_24h INTEGER,
  unique_traders_24h INTEGER,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lending metrics table
CREATE TABLE lending_metrics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  tvl NUMERIC,
  total_borrowed NUMERIC,
  total_supplied NUMERIC,
  borrow_apy NUMERIC,
  supply_apy NUMERIC,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Derivatives metrics table
CREATE TABLE derivatives_metrics (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  volume_24h NUMERIC,
  open_interest NUMERIC,
  trades_24h INTEGER,
  unique_traders_24h INTEGER,
  timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_protocol_metrics_timestamp ON protocol_metrics(timestamp);
CREATE INDEX idx_token_metrics_timestamp ON token_metrics(timestamp);
CREATE INDEX idx_chain_metrics_timestamp ON chain_metrics(timestamp);
CREATE INDEX idx_dex_metrics_timestamp ON dex_metrics(timestamp);
CREATE INDEX idx_lending_metrics_timestamp ON lending_metrics(timestamp);
CREATE INDEX idx_derivatives_metrics_timestamp ON derivatives_metrics(timestamp);

-- Create views for easy querying of latest metrics
CREATE VIEW latest_protocol_metrics AS
SELECT DISTINCT ON (name)
  *
FROM protocol_metrics
ORDER BY name, timestamp DESC;

CREATE VIEW latest_token_metrics AS
SELECT DISTINCT ON (address)
  *
FROM token_metrics
ORDER BY address, timestamp DESC;

CREATE VIEW latest_chain_metrics AS
SELECT DISTINCT ON (chain)
  *
FROM chain_metrics
ORDER BY chain, timestamp DESC;

CREATE VIEW latest_dex_metrics AS
SELECT DISTINCT ON (name)
  *
FROM dex_metrics
ORDER BY name, timestamp DESC;

CREATE VIEW latest_lending_metrics AS
SELECT DISTINCT ON (name)
  *
FROM lending_metrics
ORDER BY name, timestamp DESC;

CREATE VIEW latest_derivatives_metrics AS
SELECT DISTINCT ON (name)
  *
FROM derivatives_metrics
ORDER BY name, timestamp DESC; 