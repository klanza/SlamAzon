const mysql = require('mysql');
const inquirer = require('inquirer');
const {table} = require('table');

const pw = require('./password.js');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: pw,
    database: 'slamazon_db',
});

const inventoryTable = () => {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        let arrayTable = [];
        res.forEach((element) => {
            let arrayRow = [];
            arrayRow.push(element.item_id);
            arrayRow.push(element.product_name);
            arrayRow.push(element.department_name);
            arrayRow.push(element.price);
            arrayRow.push(element.stock_quantity);
            arrayTable.push(arrayRow);
        });
        // NPM package utility to create table from arrays
        let output = table(arrayTable);
        console.log(output);
        connection.end();
    });
};

connection.connect(function(err) {
    if (err) throw err;
    console.log('Connected as id: ' + connection.threadId);
    inventoryTable();
});
