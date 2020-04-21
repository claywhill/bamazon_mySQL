var mysql = require("mysql");
var inquirer = require("inquirer");
var chalk = require("chalk");
var Table = require("cli-table2");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootroot",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err)
        throw err;
    console.log("connected as id " + connection.threadId);

    console.log(chalk.red("************************************\n*****    WELCOME TO BAMAZON    *****\n************************************\nFOR ALL YOUR END-OF-THE-WORLD NEEDS!"));
    
    start();
})

function start() {
    inquirer.prompt([
        {
            name: "options",
            type: "list",
            message: "What would you like to do today?",
            choices: ["Make a purchase from the store",
            "Sell a product to the store"]
        }
    ]).then(function(selection) {
        switch (selection.options) {
        case "Make a purchase from the store":
            makePurchase();
            break;

        case "Sell a product to the store":
            // sellBack();
            break;
        }
    })
}

function makePurchase() {
    connection.query("SELECT * from products", function(err, res) {
        if (err)
            throw err;
        var table = new Table({
            head: ["Item ID", "Product Name", "Department", "Price", "Quantity in stock"],
            colWidths: [10, 15, 18, 10, 20],
            colAligns: ["right", "right", "right", "right", "right"],
            style: {
                head: ["green"],
                border: ["blue"],
                compact: true
            }
        })
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        buyID();
    })
}

// function sellBack();

function sellID() {
    inquirer.prompt([
        {
            name: "sellItem",
            type: "input",
            message: "What is the ID of the item you would like to sell?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantityToSell",
            type: "input",
            message: "How many would you like to sell?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(selling) {
        console.log("You selected item " + selling.sellItem + ".");
        console.log("You want to sell " + selling.quantityToSell + " of these.")
        var query = "SELECT * from buyBack WHERE item_id=?";
        connection.query(query, [selling.sellItem], function(err, res) {
            if (err)
                throw err;
            if (selling.sellItem > res[0].stock_quantity) {
                console.log("Sorry! Only " + res[0].stock_quantity + " in stock.")
            } else {
                var sales = res[0].buyback_price * selling.sellItem;
                console.log("You have successfully sold your item(s). You have received a gift card of $" + sales);
                var newQuantity = res[0].stock_quantity + parseInt(selling.sellItem);
                connection.query("UPDATE buyBack SET ? WHERE ?", [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: selling.sellItem
                }
                ],

                )
            }
        })
        keepShopping();
    })
}

function buyID() {
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "What is the ID of the item you would like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function(purchase) {
        console.log("You selected item " + purchase.product + ".");
        console.log("You want to purchase " + purchase.quantity + " of these.")
        var query = "SELECT * from products WHERE item_id=?";
        connection.query(query, [purchase.product], function(err, res) {
            if (err)
                throw err;
            if (purchase.quantity > res[0].stock_quantity) {
                console.log("Sorry! Only " + res[0].stock_quantity + " in stock.")
            } else {
                var sales = res[0].price * purchase.quantity;
                console.log("Your total is: $" + sales);
                var newQuantity = res[0].stock_quantity - parseInt(purchase.quantity);
                connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: newQuantity
                },
                {
                    item_id: purchase.product
                }
                ],

                )
            }
            keepShopping();
        })
    })
}

function keepShopping() {
    inquirer.prompt([
        {
            name: "continue",
            type: "confirm",
            message: "Would you like to continue Buying/Selling?"
        }
    ]).then(function(continueShop) {
        if (continueShop.continue === true) {
            start();
        } else {
            connection.end();
        }
    })
}