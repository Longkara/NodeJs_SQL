const express = require("express");
const router = express.Router();

const mysql = require("mysql2");
// tạo connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "LongKaRa",
  password: "1234",
  database: "employee_manage",
});

// connect to the database
connection.connect((err) => {
  if (err) {
    return console.error("Error connecting" + err);
  }
  return console.log("Connected");
});
// Sample data
// let items = [
//   {
//     id: 1,
//     fullName: "John Doe",
//     emailId: "johndoe@example.com",
//     salary: 5000,
//     city: "New York",
//   },
//   {
//     id: 2,
//     fullName: "Jane Smith",
//     emailId: "janesmith@example.com",
//     salary: 6000,
//     city: "Los Angeles",
//   },
//   {
//     id: 3,
//     fullName: "Mike Johnson",
//     emailId: "mikejohnson@example.com",
//     salary: 4500,
//     city: "Chicago",
//   },
// ];

// Xử lý POST request tại /api/submit-form
router.get("/employee/get-all", (req, res) => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) {
      return res.status(500).join({ message: "Error " });
    }
    res.json(results);
  });
});

// // Lấy thông tin nhân viên theo ID
router.get("/employee/get/:id", (req, res) => {
  const id = parseInt(req.params.id);
  connection.query(
    "SELECT * FROM employee WHERE id = ?",
    [id],
    (err, results) => {
      // const item = items.find((item) => item.id === id);
      if (err) {
        res.status(500).send({ message: "err" });
      }
      if (results.length == 0) {
        res.status(404).send({ message: "error" });
      } else {
        res.json(results);
      }
    }
  );
});

// // Tạo mới một nhân viên
router.post("/employee/create", (req, res) => {
  connection.query(
    "INSERT INTO employee(fullName, emailId, salary, city) VALUE (?,?,?,?)",
    [req.body.fullName, req.body.emailId, req.body.salary, req.body.city],
    (err, results) => {
      if (err) {
        res.status(500).send({ message: "err" });
      }
      const newEmployee = {
        id: results.insertId,
        fullName: req.body.fullName,
        emailId: req.body.emailId,
        salary: req.body.salary,
        city: req.body.city,
      };
      res.status(201).json(newEmployee);
    }
  );
});
// // Update item by ID
router.put("/employee/update/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { fullName, emailId, salary, city } = req.body;
  const updatedEmployee = { fullName, emailId, salary, city };
  connection.query(
    "UPDATE employee SET ? WHERE id = ?",
    [updatedEmployee, id],
    (err, results) => {
      if (err) {
        res.status(500).send({ message: "err" });
      }
      if (results.affectedRows == 0) {
        res.status(404).send("Employee not found");
      } else {
        res.json({ id, ...updatedEmployee });
      }
    }
  );
  // Lấy danh sách nhân viên theo phòng ban
  router.get("/department/:id/employees", (req, res) => {
    const departmentId = parseInt(req.params.id);
    connection.query(
      "SELECT employee.* FROM employee JOIN department ON employee.id_department = department.id WHERE department.id = ?",
      [departmentId],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error retrieving employees" });
        }
        if (results.length == 0) {
          return res
            .status(404)
            .json({ message: "No employees found for this department" });
        }
        res.json(results);
      }
    );
  });

  // const index = items.findIndex((i) => i.id === id);
  // if (index !== -1) {
  //   items[index] = {
  //     id: id,
  //     fullName: req.body.fullName,
  //     emailId: req.body.emailId,
  //     salary: req.body.salary,
  //     city: req.body.city,
  //   };
  //   res.json(items[index]);
  // } else {
  //   res.status(404).send({ message: "Employee not found" });
  // }
});

// // Delete item by ID
// router.delete("/employee/delete/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = items.findIndex((i) => i.id === id);
//   if (index !== -1) {
//     const deletedItem = items.splice(index, 1);
//     res.json(deletedItem[0]);
//   } else {
//     res.status(404).send({ message: "Employee not found" });
//   }
// });
module.exports = router;
