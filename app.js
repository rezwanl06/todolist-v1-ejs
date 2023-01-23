const express = require("express");

const app = express();

// Use body-parser
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// For EJS
app.use(express.static("public"));
app.set("view engine", "ejs");  // Use EJS with express

// Use mongoose
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://0.0.0.0:27017/todolistDB", (err, db) => {
    console.log("Connected to todolistDB!");
});

const itemSchema = new mongoose.Schema({
    name: String
});

const HomeItem = new mongoose.model("homeitem", itemSchema);

const today = new Date();
const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
}


// Route for "/"
app.route("/")
    .get("/", function(req, res) {
        HomeItem.find({}, (err, foundItems) => {
            res.render("list", {
                listTitle: `${today.toLocaleDateString("en-US", options)}`,
                place: "Home",
                newListItem: foundItems
            });
        });
    })
    .post("/", function(req, res) {
        const newitem = new HomeItem({
            name: req.body.newItem,
        });
        newitem.save().then(() => console.log("New item added to To Do List!"));
        
        res.redirect("/");
    });

// Route for "/delete"
app.route("/delete")
    .post("/delete", function(req, res) {
        HomeItem.findByIdAndRemove(`${req.body.check}`, (err) => {
            if (err) {
                console.log("Could not delete checked object");
            } else {
                console.log("Deletion success!");
            }
        });
        res.redirect("/");
    });


// Active port
app.listen(3000, function() {
    console.log("Server Port 3000 open");
});

