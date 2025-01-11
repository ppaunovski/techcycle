INSERT INTO public.users (username, email, first_name, last_name, created_at, account_status, password)
VALUES
    ('john_doe', 'john.doe@example.com', 'John', 'Doe', '2023-01-01', 'ACTIVE', ''),
    ('jane_smith', 'jane.smith@example.com', 'Jane', 'Smith', '2023-01-02', 'ACTIVE', ''),
    ('alice_williams', 'alice.williams@example.com', 'Alice', 'Williams', '2023-01-03', 'ACTIVE', ''),
    ('bob_brown', 'bob.brown@example.com', 'Bob', 'Brown', '2023-01-04', 'ACTIVE', ''),
    ('charlie_davis', 'charlie.davis@example.com', 'Charlie', 'Davis', '2023-01-05', 'ACTIVE', '');

INSERT INTO public.addresses (user_id, postal_code, city, country, state, street_address)
VALUES
-- Addresses for user_id 1
(1, '1000', 'Skopje', 'Macedonia', 'Skopje', 'Ilindenska bb'),
(1, '1000', 'Skopje', 'Macedonia', 'Skopje', 'Partizanski Odredi 23'),
(1, '1000', 'Skopje', 'Macedonia', 'Skopje', 'Bul. Jane Sandanski 47'),

-- Addresses for user_id 3
(3, '2000', 'Bitola', 'Macedonia', 'Bitola', 'Shirok Sokak 15'),
(3, '2000', 'Bitola', 'Macedonia', 'Bitola', 'Kliment Ohridski 10'),
(3, '2000', 'Bitola', 'Macedonia', 'Bitola', 'Marksova 6'),

-- Addresses for user_id 4
(4, '1300', 'Kumanovo', 'Macedonia', 'Kumanovo', 'Leninova 22'),
(4, '1300', 'Kumanovo', 'Macedonia', 'Kumanovo', 'Goce Delchev 33'),
(4, '1300', 'Kumanovo', 'Macedonia', 'Kumanovo', 'Dimitar Vlahov 12'),

-- Addresses for user_id 5
(5, '1200', 'Prilep', 'Macedonia', 'Prilep', 'Mosa Pijade 5'),
(5, '1200', 'Prilep', 'Macedonia', 'Prilep', 'Ilindenska 20'),
(5, '1200', 'Prilep', 'Macedonia', 'Prilep', 'Boris Kidrich 11'),

-- Addresses for user_id 7
(2, '7000', 'Ohrid', 'Macedonia', 'Ohrid', 'Jana Sandanski 2'),
(2, '7000', 'Ohrid', 'Macedonia', 'Ohrid', 'St. Kliment Ohridski 8'),
(2, '7000', 'Ohrid', 'Macedonia', 'Ohrid', 'Marshal Tito 7');


insert into users (username, email, first_name, last_name, created_at, account_status, password)
values
    ('delivery_1', 'delivery_1@techcycle.com', 'Delivery', '1', '2022-01-01', 'ACTIVE', ''),
    ('delivery_2', 'delivery_2@techcycle.com', 'Delivery', '2', '2022-01-01', 'ACTIVE', ''),
    ('delivery_3', 'delivery_3@techcycle.com', 'Delivery', '3', '2022-01-01', 'ACTIVE', ''),
    ('delivery_4', 'delivery_4@techcycle.com', 'Delivery', '4', '2022-01-01', 'ACTIVE', ''),
    ('delivery_5', 'delivery_5@techcycle.com', 'Delivery', '5', '2022-01-01', 'ACTIVE', '');