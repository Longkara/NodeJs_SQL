const express = require("express"); //lấy thư viện trong node module
const cors = require("cors");
const bodyParser = require("body-parser"); //chuỗi thành JSON
const controller = require("./constroller"); //code chức năng sử lý logic

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/api", controller);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Sever is running on the port ${PORT}`);
});
