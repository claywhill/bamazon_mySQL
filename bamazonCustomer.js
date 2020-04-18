var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");


var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if(err) {
        throw err;
    }
    console.log("connected as id " + connection.threadId);

    console.log(chalk.red("************************************\n*****    WELCOME TO BAMAZON    *****\n************************************\nFOR ALL YOUR END-OF-THE-WORLD NEEDS"));
    
    start();
});

function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do today?",
            choices: ["Make a purchase from the store",
            "Sell a product to the store"]
        }
    ]).then(function(selection) {
        if (selection.options === "Make a purchase from the store") {
            makePurchase();
        }
        else if (selection.options === "Sell a product to the store") {
            // sell function
        }
        else {
            connection.end();
        }
    });
}

function makePurchase() {
    connection.query("select * from products", function(err, res) {
        if (err) {
            throw err;
        }
        console.log("Item ID  Product Name  Department Name  Price  Quantity in Stock");
        console.log("-------  ------------  ---------------  -----  -----------------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + "     " + res[i].product_name + "     " + res[i].department_name + "     " + res[i].price + "     " + res[i].stock_quantity);
        }
    })
}