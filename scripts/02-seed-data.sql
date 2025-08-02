-- Insert sample users
INSERT INTO users (email, password_hash, full_name, role) VALUES
('admin@quickdesk.com', '$2b$10$hash', 'Admin User', 'admin'),
('agent@quickdesk.com', '$2b$10$hash', 'Agent Smith', 'agent'),
('user@quickdesk.com', '$2b$10$hash', 'John User', 'user')
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description, color) VALUES
('Technical Support', 'Hardware and software issues', '#3b82f6'),
('Billing', 'Payment and subscription issues', '#10b981'),
('Feature Request', 'New feature suggestions', '#f59e0b'),
('Bug Report', 'Software bugs and errors', '#ef4444'),
('Account Management', 'User account related issues', '#8b5cf6')
ON CONFLICT DO NOTHING;

-- Insert sample tickets
INSERT INTO tickets (subject, description, status, priority, category_id, created_by) VALUES
('Login issues with mobile app', 'Users are experiencing login failures on the mobile application', 'open', 'high', 1, 3),
('Payment processing error', 'Credit card payments are failing during checkout', 'in_progress', 'urgent', 2, 3),
('Feature request: Dark mode', 'Request to add dark mode theme option', 'open', 'medium', 3, 3);
