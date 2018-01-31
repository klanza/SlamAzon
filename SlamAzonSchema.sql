DROP DATABASE IF EXISTS SlamAzon_db;

CREATE DATABASE SlamAzon_db;

USE SlamAzon_db;

CREATE TABLE products(
item_id INT NOT NULL,
product_name VARCHAR(200) NOT NULL,
department_name VARCHAR(100) NOT NULL,
price DECIMAL (10,2) NOT NULL,
stock_quantity INT NOT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (235, 'HTC Vive', 'Electronics', 599.99, 15);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (325, 'GTX 1080ti', 'Computer parts', 50000.00, 1);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (574, 'Pandemic', 'Board Games', 34.95, 25);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (943, 'Gloomhaven', 'Board Games', 119.95, 0);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (743, 'Dark Souls', 'Video Games', 19.99, 50);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (830, 'ANOVA Sous Vide', 'Kitchen', 149.95, 20);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (620, 'Le Creuset Dutch Oven', 'Kitchen', 324.95, 5);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (548, 'Hoodie Sweatshirt', 'Clothing', 29.95, 75);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (772, 'Slamazon Alexa', 'Surveillance', 59.95, 100);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity)
VALUES (193, 'Beard Hat', 'Clothing', 29.95, 20);

SELECT * FROM slamazon_db.products;