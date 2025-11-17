import express from "express";
import sequelize from "./config/database.js";
import "dotenv/config";

import router from "./routes/paymentPlanRoutes.js";

const app = express();
app.use(express.json());
const PORT = process.env.BACKEND_SERVER_PORT || 3000;

app.get("/", (req, res) => {
  res.send("Jiffy Edge PGW API is running!");
});

app.use("/api/plans", router);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    console.log(`Server listening on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
