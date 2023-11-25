const express = require("express");
const app = express();
const alldata = require("./AllData.json");
const AllFunction = require("./AllFunction");

app.use(express.json());
//both functionality done in this api (all data show and search functionality)
app.get("/listOfUser", (req, resp) => {
  const { email, phone, firstName, lastName } = req.query;
  AllFunction.AllDataFunction(email, phone, firstName, lastName, resp);
});
//create Data
app.post("/createUser", (req, resp) => {
  const { email, phone, firstName, lastName } = req.body;
  AllFunction.HandleDataFn(email, phone, firstName, lastName, resp,req)
});
//updateData
app.put("/updateUser/:id", (req, resp) => {
  const { email, phone, firstName, lastName } = req.body;
  const id=req.params.id;
  AllFunction.handleUpdateData(id,email, phone, firstName, lastName, resp,req)
});

//DeleteData
app.delete("/removeUser/:id", (req, resp) => {
  const id=req.params.id;
  AllFunction.handleDeleteData(id, resp)
});
app.listen(4000);
