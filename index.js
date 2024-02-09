const express = require("express");
const app = express();
const cors = require("cors");
const warehousesRoutes = require("./routes/warehouses");
const inventoryRoutes = require("./routes/inventories");

require("dotenv").config();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.use("/warehouses", warehousesRoutes);
app.use("/inventories", inventoryRoutes);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
}); 
 