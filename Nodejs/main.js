$(document).ready(function () {
  getAll();
});

//Get List
function getAll() {
  $.ajax({
    url: "http://localhost:3000/api/employee/get-all",
    type: "GET",
    success: function (products) {
      if ($("#employeeList tbody").length != 0) {
        $("#employeeList tbody").empty();
      }
      renderTable(products);
    },
  });
}
function renderTable(products) {
  for (let i = 0; i < products.length; i++) {
    let ret = `
    <tr>
      <th>${products[i].id}</th>
      <th>${products[i].fullName}</th>
      <th>${products[i].emailId}</th>
      <th>${products[i].salary}</th>
      <th>${products[i].city}City</th>
      <td>
        <a onclick="onEdit(this)"> Edit</a>
        <a onclick="onDelete(${products[i].id})"> Delete</a>
      </td>
    </tr>
    `;
    $("#employeeList tbody").append(ret);
  }
}

var selectedRow = null;

function onFormSubmit() {
  if (validate()) {
    var formData = readFormData();
    if (selectedRow == null) insertNewRecord(formData);
    else updateRecord(formData);
    resetForm();
  }
}

function readFormData() {
  var formData = {};
  if (selectedRow != null) {
    formData["id"] = document.getElementById("id").value;
  }
  formData["fullName"] = document.getElementById("fullName").value;
  formData["emailId"] = document.getElementById("email").value;
  formData["salary"] = document.getElementById("salary").value;
  formData["city"] = document.getElementById("city").value;
  return formData;
}

function insertNewRecord(formData) {
  // Gửi dữ liệu biểu mẫu đến máy chủ
  $.ajax({
    url: "http://localhost:3000/api/employee/create",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function () {
      getAll();
    },
  });
}

function resetForm() {
  document.getElementById("fullName").value = "";
  document.getElementById("email").value = "";
  document.getElementById("salary").value = "";
  document.getElementById("city").value = "";
  selectedRow = null;
}

function onEdit(td) {
  selectedRow = td.parentElement.parentElement;
  document.getElementById("id").value = selectedRow.cells[0].innerHTML;
  document.getElementById("fullName").value = selectedRow.cells[1].innerHTML;
  document.getElementById("email").value = selectedRow.cells[2].innerHTML;
  document.getElementById("salary").value = selectedRow.cells[3].innerHTML;
  document.getElementById("city").value = selectedRow.cells[4].innerHTML;
}
function updateRecord(formData) {
  console.log(formData);
  $.ajax({
    url: "http://localhost:3000/api/employee/update/" + formData.id,

    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function () {
      getAll();
    },
  });
}

function onDelete(td) {
  console.log(td);
  if (confirm("Are you sure to delete this record ?")) {
    $.ajax({
      url: "http://localhost:3000/api/employee/delete/" + td,
      method: "DELETE",
      success: function () {
        getAll();
      },
    });
  }
}

function validate() {
  isValid = true;
  if (document.getElementById("fullName").value == "") {
    isValid = false;
    document.getElementById("fullNameValidationError").classList.remove("hide");
  } else {
    isValid = true;
    if (
      !document
        .getElementById("fullNameValidationError")
        .classList.contains("hide")
    )
      document.getElementById("fullNameValidationError").classList.add("hide");
  }
  return isValid;
}
