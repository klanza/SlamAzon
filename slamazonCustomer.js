const mysql = require('mysql');
const inquirer = require('inquirer');
const {table} = require('table');

const pw = require('./password.js');

// Connection information for mySQL server
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: pw,
    database: 'slamazon_db',
});

// Questions used in 'inquirer' npm package
const purchaseQuestions = [
    {
        type: 'input',
        name: 'itemID',
        message: 'What is the ID of the item you would like to purchase?',
        validate: function(value) {
            const pass = value.match(/(^\d{3})/g);
            if (pass) {
                return true;
            };
        },
    },
    {
        type: 'input',
        name: 'quantity',
        message: 'Please enter the quantity of items you would like to purchase:',
        validate: function(value) {
            const pass = value.match(/\d/g);
            if (pass) {
                return true;
            };
            return 'Please enter a valid 3 digit item ID.';
        },
    },
];

// Query databse to grab all products
const queryDatabase = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            resolve(res)
        });
    });
};

const queryRow = (answers) => {
    let query = 'SELECT stock_quantity, product_name, price FROM products WHERE ?';
    connection.query(query, {item_id: answers.itemID}, function(err, res) {
        if (parseInt(answers.quantity) <= parseInt(res[0].stock_quantity)) {
            console.log('Success');
            inquirer.prompt({
                type: 'confirm',
                name: 'confirm',
                message: `Confirm your order: Purchasing ${answers.quantity} units of ${res[0].product_name}?`
            }).then((answer) => {
                console.log('yay');
            });
        }
    });
};

// Create table using 'table' npm package
const inventoryTable = (res) => {
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
};

connection.connect(function(err) {
    if (err) throw err;
    console.log('===============================================================');
    console.log('=============== COME ON AND SLAM WITH SLAMAZON ================');
    console.log('===============================================================');
    queryDatabase().then((response) => {
        inventoryTable(response);
        inquirer.prompt(purchaseQuestions).then((answers) => {
            queryRow(answers);
            connection.end();
        });
    });
});
