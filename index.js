const express = require("express");
const { connectWithMongoose } = require("./src/database/databseConnect");
const { userRoutes } = require("./src/modules/user/UserRoutes");
const app = express();
const cors = require("cors");
const { recipesRoutes } = require("./src/modules/recipe/RecipeRoutes");
const { homeRoutes } = require("./src/modules/homePage/HomePageRoutes");
const { default: mongoose } = require("mongoose");

require("dotenv").config();

const port = 3000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://recipe-task.web.app", // Add your frontend origin here
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Explicitly handle preflight requests
app.options("*", cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
const url = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.d8yzbln.mongodb.net/TaskDB?retryWrites=true&w=majority&appName=Cluster0`;
async function main() {
  try {
    await mongoose.connect(url);

    console.log("Connected to MongoDB with Mongoose");

    app.use("/user", userRoutes);
    app.use("/recipe", recipesRoutes);
    app.use("/home", homeRoutes);

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
