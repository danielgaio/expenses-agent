-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'adult', 'child', 'viewer');
CREATE TYPE transaction_type AS ENUM ('expense', 'income', 'investment');
CREATE TYPE transaction_status AS ENUM ('realized', 'planned');
CREATE TYPE provenance_type AS ENUM ('ai', 'user', 'mixed');
CREATE TYPE frequency_type AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'custom');
