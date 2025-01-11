DROP VIEW IF EXISTS monthly_sales_chart;

CREATE OR REPLACE VIEW monthly_sales_chart AS
WITH months AS (
    SELECT 1 AS month_num, 'January' AS month_name
    UNION ALL
    SELECT 2, 'February'
    UNION ALL
    SELECT 3, 'March'
    UNION ALL
    SELECT 4, 'April'
    UNION ALL
    SELECT 5, 'May'
    UNION ALL
    SELECT 6, 'June'
    UNION ALL
    SELECT 7, 'July'
    UNION ALL
    SELECT 8, 'August'
    UNION ALL
    SELECT 9, 'September'
    UNION ALL
    SELECT 10, 'October'
    UNION ALL
    SELECT 11, 'November'
    UNION ALL
    SELECT 12, 'December'
)
SELECT
    p.product_id AS product_id,
    p.name AS product,
    m.month_name AS month,
    EXTRACT(YEAR FROM o.created_at) AS year,
    COALESCE(SUM(oi.quantity), 0) AS total_sales
FROM
    products p
        CROSS JOIN
    months m
        LEFT JOIN
    order_items oi ON p.product_id = oi.product_id
        LEFT JOIN
    public.orders o ON oi.order_id = o.order_id AND EXTRACT(MONTH FROM o.created_at) = m.month_num
GROUP BY
    p.name, m.month_name, m.month_num, p.product_id, EXTRACT(YEAR FROM o.created_at)
ORDER BY
    p.name, m.month_num;
