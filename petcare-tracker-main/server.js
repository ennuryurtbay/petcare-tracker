const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const express = require("express");
const cors = require("cors");
const db = require("./database/database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Pet Care Tracker API",
      version: "1.0.0",
      description: "API documentation for Pet Care Tracker"
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /pets:
 *   get:
 *     summary: Get all pets
 *     responses:
 *       200:
 *         description: List of pets
 */
app.get("/pets", (req, res) => {
  db.all("SELECT * FROM pets", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

/**
 * @swagger
 * /pets:
 *   post:
 *     summary: Add a new pet
 *     responses:
 *       200:
 *         description: Pet added successfully
 */
app.post("/pets", (req, res) => {
  const {
    petName,
    petType,
    age,
    ownerName,
    phoneNumber,
    vaccinationStatus,
    rabiesDate,
    mixedDate,
    parasiteDate
  } = req.body;

  db.run(
    `INSERT INTO pets 
    (petName, petType, age, ownerName, phoneNumber, vaccinationStatus, rabiesDate, mixedDate, parasiteDate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      petName,
      petType,
      age,
      ownerName,
      phoneNumber,
      vaccinationStatus,
      rabiesDate,
      mixedDate,
      parasiteDate
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({
          id: this.lastID,
          message: "Pet added successfully"
        });
      }
    }
  );
});
/**
 * @swagger
 * /pets/{id}:
 *   get:
 *     summary: Get pet by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet found
 */

app.get("/pets/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM pets WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ message: "Pet not found" });
    } else {
      res.json(row);
    }
  });
});
/**
 * @swagger
 * /pets/{id}:
 *   put:
 *     summary: Update pet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet updated
 */
app.put("/pets/:id", (req, res) => {
  const { id } = req.params;
  const { petName, petType, age, ownerName,phoneNumber, vaccinationStatus, rabiesDate, mixedDate, parasiteDate } = req.body;

  db.run(
    `UPDATE pets
     SET petName = ?, petType = ?, age = ?, ownerName = ?, phoneNumber = ?, vaccinationStatus = ?, rabiesDate = ?, mixedDate = ?, parasiteDate = ?
     WHERE id = ?`,
    [petName, petType, age, ownerName,phoneNumber, vaccinationStatus, rabiesDate, mixedDate, parasiteDate, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ message: "Pet not found" });
      } else {
        res.json({ message: "Pet updated successfully" });
      }
    }
  );
});
/**
 * @swagger
 * /pets/{id}:
 *   delete:
 *     summary: Delete pet
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet deleted
 */
app.delete("/pets/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM pets WHERE id = ?", [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ message: "Pet not found" });
    } else {
      res.json({ message: "Pet deleted successfully" });
    }
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});