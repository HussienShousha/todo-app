const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const swagger = require("swagger-ui-express");
const methodOverride = require ("method-override");

const todosRoutes = require("./Routes/todos.routes");
const usersRoutes = require("./Routes/users.routes");
const swaggerDocs = require("./swagger.json");

const app = express();

// RUN THIS IN A SEPARATE TERMINAL
// E:/MongoDB/bin/mongod.exe --dbpath=E:/MongoDB-Data

// middleware
dotenv.config();

app.use(
    cors({
        origin: "*",
        methods: "*",
    })
);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());

app.use((req, res, next) => {
    console.log("custom middleware");
    next();
});
app.use("/todos", todosRoutes);
app.use("/users", usersRoutes);
app.use(express.static("./Static"));

app.set("view engine", "ejs");
app.set("views", "./View");

app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs));

mongoose
    .connect("mongodb://localhost:27017/keepNotes")
    .then((result) => {
        console.log("connected to database successfuly");
    })
    .catch((err) => {
        console.log(err);
    });

const port = 3330;

app.listen(port, () => {
    console.log("connected successfly");
});

// var validator = require('validator');

// console.log(validator.isEmail('fsfa@fsnfks'));
