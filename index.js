const express = require("express");
const { connectWithMongoose } = require("./src/database/databseConnect");
const { userRoutes } = require("./src/modules/user/UserRoutes");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await connectWithMongoose();

    app.use("/user", userRoutes);

    // Send a ping to confirm a successful connection

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
