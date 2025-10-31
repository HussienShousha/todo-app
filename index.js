const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const methodOverride = require("method-override");
const swagger = require("swagger-ui-express");

const todosRoutes = require("./Routes/todos.routes");
const usersRoutes = require("./Routes/users.routes");
const swaggerDocs = require("./swagger.json");

dotenv.config();

const app = express();

app.use(cors({ origin: "*", methods: "*" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

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

module.exports = app; 
