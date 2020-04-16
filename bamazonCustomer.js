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

    console.log(chalk.cyan("************************************** \n*****     WELCOME TO BAMAZON     ***** \n**************************************"));
    
    
    
    start();
});

function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "What would you like to do today?",
            choices: ["Make a purchase from the store", "Sell a product to the store"]
        }
    ]).then(function(selection) {
        if (selection.options === "Make a purchase from the store") {
            console.log();
        }
        else if (selection.options === "Sell a product to the store") {
            console.log("You want to sell");
        }
        else {
            connection.end();
        }
    });
}

// connection.query("select * from products", function(err, res) {
//     if (err) {
//         throw err;
//     }
//     console.log(res);
// })