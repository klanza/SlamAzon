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

// Questions and functions used in 'inquirer' npm package
const purchaseQuestions = [
    {
        type: 'input',
        name: 'itemID',
        message: 'What is the ID of the item you would like to purchase?',
        validate: function(value) {
            const pass = value.match(/(^\d{3}$)/g);
            if (pass) {
                return true;
            };
            return 'Please enter a valid 3 digit item ID.';
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
            return 'Please enter a valid number for quantity.';
        },
    },
];

// Query databse to grab all products
const queryDatabase = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) throw err;
            resolve(res);
        });
    });
};

const inventoryQuery = (answers) => {
    let query = 'SELECT stock_quantity, product_name, price FROM products WHERE ?';
    connection.query(query, {item_id: answers.itemID}, function(err, res) {
        if (res[0] === undefined) {
            console.log('Sorry, your transaction could not be completed: Incorrect ID');
            reloadApplicationFailure();
        } else if (parseInt(answers.quantity) <= parseInt(res[0].stock_quantity)) {
            inquirer.prompt({
                type: 'confirm',
                name: 'confirmOrder',
                message: `Confirm your order: Purchasing ${answers.quantity} units of ${res[0].product_name}?`
            }).then((answer) => {
                console.log(answer);
                console.log(res[0].stock_quantity);
                updateInventory(res[0].stock_quantity, answers.quantity, answers.itemID);
            });
        } else {
            console.log('Sorry, your transaction could not be completed: Insufficient quantity');
            reloadApplicationFailure();
        }
    });
};

const updateInventory = (inStock, orderQuantity, idNumber) => {
    let updatedQuantity = (inStock - orderQuantity);
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [
            {
                stock_quantity: updatedQuantity,
            },
            {
                item_id: idNumber,
            },
        ],
        function(err, res) {
            console.log('We have completed your transaction!');
            console.log('Thank you for Space Jamming with Slamazon!');
            reloadApplicationSuccess();
        }
    );
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

// Reload application if application fails
const reloadApplicationFailure = () => {
    inquirer.prompt({
        type: 'confirm',
        name: 'reload',
        message: 'We could not complete your transaction, would you like to try again?',
    }).then((answer) => {
        if (answer.reload === true) {
            loadStorefront();
        } else {
            connection.end();
        }
    });
};

// Reload application if application fails
const reloadApplicationSuccess = () => {
    inquirer.prompt({
        type: 'confirm',
        name: 'reload',
        message: 'Would you like to make another purchase?',
    }).then((answer) => {
        if (answer.reload === true) {
            loadStorefront();
        } else {
            connection.end();
        }
    });
};


const loadStorefront = () => connection.connect(function(err) {
    // if (err) throw err;
    console.log('===============================================================');
    console.log('=============== COME ON AND SLAM WITH SLAMAZON ================');
    console.log('===============================================================');
    queryDatabase().then((response) => {
        inventoryTable(response);
        inquirer.prompt(purchaseQuestions).then((answers) => {
            inventoryQuery(answers);
        });
    });
});

// Initialize application
loadStorefront();
