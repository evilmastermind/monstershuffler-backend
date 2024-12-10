-- postgresql
UPDATE monstershuffler.users 
SET password = '$2b$10$EEuUdFeahX0xHszktCAFCePx.dUMoDQZVwxz5cehL2CziMnmchaEm',
    email = 'admin@admin.com'
WHERE id = 0;

-- mysql
UPDATE users 
SET password = '$2b$10$EEuUdFeahX0xHszktCAFCePx.dUMoDQZVwxz5cehL2CziMnmchaEm',
    email = 'admin@admin.com'
WHERE id = 0;
