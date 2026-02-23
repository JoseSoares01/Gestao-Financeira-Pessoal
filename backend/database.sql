-- Supabase Database Schema for FinControl
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category TEXT NOT NULL,
    isEssential BOOLEAN DEFAULT FALSE,
    paymentMethod TEXT DEFAULT 'Cartão',
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    target DECIMAL(10, 2) NOT NULL,
    current DECIMAL(10, 2) DEFAULT 0,
    icon TEXT DEFAULT '🎯',
    color TEXT DEFAULT '#7cb342',
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table (optional, for custom categories)
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT DEFAULT '#7cb342',
    icon TEXT DEFAULT '💰',
    budget DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, type, color, icon) VALUES
    ('Salário', 'income', '#7cb342', '💰'),
    ('Bônus', 'income', '#aed581', '🎁'),
    ('Freelance', 'income', '#558b2f', '💼'),
    ('Investimentos', 'income', '#4caf50', '📈'),
    ('Outros', 'income', '#81c784', '➕'),
    ('Moradia', 'expense', '#ef5350', '🏠'),
    ('Alimentação', 'expense', '#ff7043', '🍽️'),
    ('Transporte', 'expense', '#ffa726', '🚗'),
    ('Saúde', 'expense', '#42a5f5', '❤️'),
    ('Lazer', 'expense', '#ab47bc', '🎮'),
    ('Educação', 'expense', '#5c6bc0', '📚')
ON CONFLICT (name) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (description, amount, type, category, isEssential, paymentMethod, date) VALUES
    ('Salário Fevereiro', 3200, 'income', 'Salário', false, 'Transferência', '2024-02-01'),
    ('Bônus Trimestral', 800, 'income', 'Bônus', false, 'Transferência', '2024-02-05'),
    ('Renda', 950, 'expense', 'Moradia', true, 'Débito', '2024-02-03'),
    ('Supermercado', 420, 'expense', 'Alimentação', true, 'Crédito', '2024-02-04'),
    ('Transporte', 85, 'expense', 'Transporte', true, 'Crédito', '2024-02-06'),
    ('Cinema', 45, 'expense', 'Lazer', false, 'Crédito', '2024-02-08'),
    ('Farmácia', 95, 'expense', 'Saúde', true, 'Débito', '2024-02-10'),
    ('Curso Online', 120, 'expense', 'Educação', false, 'Crédito', '2024-02-12'),
    ('Restaurante', 110, 'expense', 'Alimentação', false, 'Crédito', '2024-02-15'),
    ('Freelance Projeto', 650, 'income', 'Freelance', false, 'Transferência', '2024-02-18'),
    ('Gasolina', 180, 'expense', 'Transporte', true, 'Débito', '2024-02-20'),
    ('Netflix', 15, 'expense', 'Lazer', false, 'Crédito', '2024-02-22'),
    ('Eletricidade', 95, 'expense', 'Moradia', true, 'Débito', '2024-02-25'),
    ('Ginásio', 45, 'expense', 'Saúde', false, 'Débito', '2024-02-26'),
    ('Supermercado', 280, 'expense', 'Alimentação', true, 'Crédito', '2024-02-28'),
    ('Dividendos', 180, 'income', 'Investimentos', false, 'Transferência', '2024-02-28');

-- Insert sample goals
INSERT INTO goals (name, target, current, icon, color, deadline) VALUES
    ('Fundo de Emergência', 10000, 6500, '🛡️', '#7cb342', '2024-12-31'),
    ('Viagem de Férias', 3000, 1200, '✈️', '#42a5f5', '2024-08-15'),
    ('Novo Carro', 25000, 8000, '🚗', '#ffa726', '2025-06-30'),
    ('Entrada Casa', 50000, 15000, '🏠', '#ab47bc', '2026-01-01');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);

-- Enable RLS (Row Level Security) - optional, for multi-user support
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you should use authenticated access
CREATE POLICY "Allow all operations on transactions" 
    ON transactions FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on goals" 
    ON goals FOR ALL 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Allow all operations on categories" 
    ON categories FOR ALL 
    USING (true) 
    WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at 
    BEFORE UPDATE ON transactions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at 
    BEFORE UPDATE ON goals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
