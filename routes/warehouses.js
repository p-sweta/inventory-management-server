const express = require("express");
const router = express.Router();
const knex = require("knex");
const db = knex(require("../knexfile"));
require("dotenv").config();

router.get("/", async (req, res) => {
  try {
    const warehouses = await db("warehouses");
    res.status(200).json(warehouses);
  } catch (err) {
    res.status(500).json({ message: "Failed to get warehouses" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const findWarehouse = await db("warehouses")
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .where({ id: req.params.id });

    if (findWarehouse.length === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID: ${req.params.id} not found` });
    }

    const warehouseData = findWarehouse[0];

    res.status(200).json(warehouseData);
  } catch (err) {
    res.status(500).json({ message: "Failed to get details" });
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
    const warehouse = await db("warehouses")
      .where({ id: req.params.id })
      .update({
        id: req.params.id,
        warehouse_name: req.body.warehouse_name,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country,
        contact_name: req.body.contact_name,
        contact_position: req.body.contact_position,
        contact_phone: req.body.contact_phone,
        contact_email: req.body.contact_email,
      });

    if (warehouse === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID: ${req.params.id} not found` });
    }

    res.status(200).json({ message: "Warehouse updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update warehouse" });
  }
});

router.post("/", async (req, res) => {
  try{
    const warehouse = await db("warehouses").insert({
      id: req.params.id,
      warehouse_name: req.body.warehouse_name,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      contact_name: req.body.contact_name,
      contact_position: req.body.contact_position,
      contact_phone: req.body.contact_phone,
      contact_email: req.body.contact_email,
    });
    res.status(201).json(warehouse);
  } catch(err) {
    res.status(500).json({message: "Failed to create warehouse, try again later!"})
  }
});

router.delete("/:id", async (req, res)=>{
  try{
    const deleteWarehouse = await db("warehouses")
      .where({ id: req.params.id })
      .del();

      if (deleteWarehouse === 0){
        return res
          .status(404)
          .json({message:`Warehouse with ID: ${req.params.id} cannot be deleted because it does not exist`});
      }

    res.sendStatus(204)
  } catch(err){
    res.status(500).json({ message: `Unable to delete warehouse` });
  }
})

module.exports = router;
