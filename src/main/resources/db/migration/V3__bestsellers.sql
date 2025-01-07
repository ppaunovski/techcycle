CREATE MATERIALIZED VIEW if not exists bestsellers AS
SELECT
    p.product_id,
    p.name,
    p.price,
    p.description,
    p.condition,
    p.brand_id,
    p.stock_quantity,
    COALESCE(SUM(oi.quantity), 0) as total_units_sold
FROM products p
         LEFT JOIN order_items oi ON p.product_id = oi.product_id
WHERE p.status = 'ACTIVE'
GROUP BY
    p.product_id,
    p.name,
    p.price,
    p.description,
    p.condition,
    p.brand_id,
    p.stock_quantity
ORDER BY total_units_sold DESC;

-- Create a unique index to allow concurrent refreshes
CREATE UNIQUE INDEX if not exists bestsellers_product_id_idx ON bestsellers (product_id);

-- Grant necessary permissions
GRANT SELECT ON bestsellers TO techcycle;