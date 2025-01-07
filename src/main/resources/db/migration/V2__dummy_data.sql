-- Insert Categories
INSERT INTO product_categories (category_name, description) VALUES
                                                                ('Processors', 'CPUs from various manufacturers'),
                                                                ('Graphics Cards', 'GPU cards for gaming and professional use'),
                                                                ('Memory', 'RAM modules and memory solutions'),
                                                                ('Storage', 'Hard drives, SSDs, and storage solutions'),
                                                                ('Motherboards', 'Motherboards for different CPU sockets'),
                                                                ('Power Supplies', 'Power supply units');

-- Insert Tags
INSERT INTO product_tags (name, description) VALUES
                                                 ('Gaming', 'Suitable for gaming purposes'),
                                                 ('Professional', 'For professional/workstation use'),
                                                 ('Budget', 'Cost-effective options'),
                                                 ('High-End', 'Premium performance products'),
                                                 ('Refurbished', 'Professionally restored products'),
                                                 ('Best Seller', 'Popular among customers');

-- Insert Products
INSERT INTO products (name, description, price, stock_quantity, status, condition) VALUES
-- Processors
('Used Intel i9-12900K', '16-core processor, excellent gaming performance', 449.99, 3, 'ACTIVE', 'excellent'),
('Used Intel i7-11700K', '8-core processor, great for gaming', 299.99, 5, 'ACTIVE', 'good'),
('Used AMD Ryzen 9 5900X', '12-core powerhouse processor', 399.99, 2, 'ACTIVE', 'excellent'),
('Used AMD Ryzen 7 5800X', '8-core processor', 279.99, 4, 'ACTIVE', 'good'),
('Used Intel i5-10400F', 'Budget 6-core processor', 129.99, 8, 'ACTIVE', 'good'),

-- Graphics Cards
('Used NVIDIA RTX 4080', '16GB GDDR6X flagship GPU', 899.99, 2, 'ACTIVE', 'excellent'),
('Used NVIDIA RTX 3080', '10GB GDDR6X graphics card', 599.99, 3, 'ACTIVE', 'good'),
('Used NVIDIA RTX 3070', '8GB GDDR6 graphics card', 399.99, 4, 'ACTIVE', 'excellent'),
('Used AMD RX 6800 XT', '16GB GDDR6 graphics card', 549.99, 2, 'ACTIVE', 'good'),
('Used AMD RX 6700 XT', '12GB GDDR6 graphics card', 349.99, 5, 'ACTIVE', 'good'),
('Used GTX 1660 Super', '6GB GDDR6 budget gaming card', 179.99, 6, 'ACTIVE', 'fair'),

-- Memory
('Used Corsair 32GB DDR4', '32GB (2x16GB) 3200MHz RAM kit', 89.99, 10, 'ACTIVE', 'good'),
('Used G.Skill 32GB DDR4', '32GB (2x16GB) 3600MHz RAM', 99.99, 8, 'ACTIVE', 'excellent'),
('Used Crucial 16GB DDR4', '16GB (2x8GB) 3000MHz RAM', 49.99, 15, 'ACTIVE', 'good'),
('Used Kingston 16GB DDR4', '16GB (2x8GB) 3200MHz RAM', 54.99, 12, 'ACTIVE', 'good'),

-- Storage
('Used Samsung 2TB 970 EVO', '2TB NVMe SSD', 159.99, 5, 'ACTIVE', 'excellent'),
('Used WD Black 2TB', '2TB 7200RPM HDD', 49.99, 12, 'ACTIVE', 'good'),
('Used Crucial 1TB MX500', '1TB SATA SSD', 69.99, 8, 'ACTIVE', 'good'),
('Used Seagate 4TB HDD', '4TB 7200RPM HDD', 79.99, 6, 'ACTIVE', 'good'),

-- Motherboards
('Used ASUS ROG Z690', 'Intel Z690 gaming motherboard', 249.99, 3, 'ACTIVE', 'excellent'),
('Used MSI B550 Gaming', 'AMD B550 gaming motherboard', 129.99, 5, 'ACTIVE', 'good'),
('Used Gigabyte B660M', 'Intel B660 motherboard', 89.99, 7, 'ACTIVE', 'good'),
('Used ASRock X570', 'AMD X570 motherboard', 159.99, 4, 'ACTIVE', 'good'),

-- Power Supplies
('Used Corsair RM850x', '850W Gold certified PSU', 89.99, 6, 'ACTIVE', 'good'),
('Used EVGA 750W G3', '750W Gold certified PSU', 79.99, 8, 'ACTIVE', 'good'),
('Used Seasonic 650W', '650W Bronze certified PSU', 59.99, 10, 'ACTIVE', 'good');

-- Connect Products with Categories
WITH categories AS (SELECT * FROM product_categories),
     products AS (SELECT * FROM products)
INSERT INTO product_categories_mapping (product_id, category_id)
SELECT p.product_id, c.category_id
FROM products p
         CROSS JOIN categories c
WHERE
    (p.name LIKE '%Intel%' OR p.name LIKE '%AMD%' AND p.name LIKE '%core%' AND c.category_name = 'Processors')
   OR (p.name LIKE '%RTX%' OR p.name LIKE '%GTX%' OR p.name LIKE '%RX%' AND c.category_name = 'Graphics Cards')
   OR (p.name LIKE '%DDR4%' AND c.category_name = 'Memory')
   OR ((p.name LIKE '%SSD%' OR p.name LIKE '%HDD%' OR p.name LIKE '%970%' OR p.name LIKE '%MX500%') AND c.category_name = 'Storage')
   OR ((p.name LIKE '%ROG%' OR p.name LIKE '%MSI%' OR p.name LIKE '%Gigabyte%' OR p.name LIKE '%ASRock%') AND c.category_name = 'Motherboards')
   OR ((p.name LIKE '%W%' AND (p.name LIKE '%Corsair%' OR p.name LIKE '%EVGA%' OR p.name LIKE '%Seasonic%')) AND c.category_name = 'Power Supplies');

-- Connect Products with Tags
WITH products AS (SELECT * FROM products),
     tags AS (SELECT * FROM product_tags)
INSERT INTO product_tags_mapping (product_id, tag_id)
SELECT p.product_id, t.tag_id
FROM products p
         CROSS JOIN tags t
WHERE
   -- High-end products
    ((p.name LIKE '%i9%' OR p.name LIKE '%Ryzen 9%' OR p.name LIKE '%4080%' OR p.name LIKE '%3080%' OR p.name LIKE '%ROG%')
        AND t.name IN ('High-End', 'Gaming', 'Professional'))
   -- Mid-range gaming products
   OR ((p.name LIKE '%i7%' OR p.name LIKE '%Ryzen 7%' OR p.name LIKE '%3070%' OR p.name LIKE '%6700%')
    AND t.name IN ('Gaming', 'Best Seller'))
   -- Budget products
   OR ((p.name LIKE '%i5%' OR p.name LIKE '%1660%' OR p.name LIKE '%B660%')
    AND t.name IN ('Budget', 'Gaming'))
   -- Storage
   OR ((p.name LIKE '%970 EVO%' OR p.name LIKE '%WD Black%')
    AND t.name IN ('Professional', 'Best Seller'))
   -- All used products
   OR (p.name LIKE '%Used%' AND t.name = 'Refurbished');