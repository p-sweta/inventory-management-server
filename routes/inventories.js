const express = require("express");
const router = express.Router();
const knex = require("knex");
const db = knex(require("../knexfile"));

router.get("/", async (req, res) => {
  try {
    const inventoryData = await db
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category", 
        "inventories.status",
        "inventories.quantity"
      )
      .from("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id");
    res.status(200).json(inventoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Inventory is not available" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newInventory = {
      "warehouse_id": req.body.warehouse_id,
      "item_name": req.body.item_name,
      "description": req.body.description,
      "category": req.body.category,
      "status": req.body.status,
      "quantity": req.body.quantity,
    };
    await db("inventories").insert(newInventory);
    const inventoryData = await db.select().from("inventories");
    res.status(200).json(inventoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add new inventory item" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const singleInventoryData = await db("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .where({ "inventories.id": req.params.id })
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      );

    if (singleInventoryData.length === 0) {
      return res.status(404).json({
        message: `Inventory item with ID: ${req.params.id} not found`,
      });
    }

    const singleInventory = singleInventoryData[0];

    res.status(200).json(singleInventory);
  } catch (err) {
    res.status(500).json({
      message: `Failed to get inventory item  with ID: ${req.params.id}`,
    });
  }
});

router.get("/:id/inventories", async (req, res) => {
  try {
    const inventory = await db("inventories")
      .select(
        "inventories.id",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .join("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where({ warehouse_id: req.params.id });

    if (inventory.length === 0) {
      return res.status(404).json("Inventory not found");
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(404).json("warehouse not found");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const editInventory = await db("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id")
      .where({ "inventories.id": req.params.id })
      .update({
        "inventories.id": req.params.id,
        "warehouses.warehouse_name": req.body.warehouse_name,
        "inventories.item_name": req.body.item_name,
        "inventories.description": req.body.description,
        "inventories.category": req.body.category,
        "inventories.status": req.body.status,
        "inventories.quantity": req.body.quantity,
      });

    if (editInventory === 0) {
      return res.status(404).json({
        message: `Inventory item with ID: ${req.params.id} not found`,
      });
    }

    if (
      !req.body.warehouse_name ||
      !req.body.item_name ||
      !req.body.description ||
      !req.body.category ||
      !req.body.status ||
      req.body.quantity === undefined
    ) {
      return res.status(400).json({
        message: `Missing properties in the request body`,
      });
    }

    if (!"warehouses.warehouse_id") {
      return res.status(400).json({
        message: `${"inventories.warehouse_id"} value does not exist`,
      });
    }

    if (isNaN(req.body.quantity)) {
      return res.status(400).json({
        message: `The quantity is not a number`,
      });
    }

    res.status(200).json({ message: "Inventory updated successfully" });
  } catch (err) {
    res.status(404).json({
      message: `Failed to get inventory item  with ID: ${req.params.id}`,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteInventory = await db("inventories")
      .where({ id: req.params.id })
      .del();

    if (deleteInventory === 0) {
      return res.status(404).json({
        message: `Inventory item with ID: ${req.params.id} not found`,
      });
    }

    res.status(200).json({ message: "Inventory item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete inventory item" });
  }
});

module.exports = router;
