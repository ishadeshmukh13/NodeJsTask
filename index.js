const express = require("express");
const app = express();
const Controller = require("./src/Controller");
const middlewareFn = require("./src/Middleware/middlewareFn");
const path=require("path")
app.use(express.json());
//both functionality done in this api (all data show and search functionality)

app.get("/listOfUser", (req, resp) => {
  const { email, phone, firstName, lastName } = req.query;
  Controller.listOfData(email, phone, firstName, lastName, resp);
});
//create Data
app.post("/createUser", (req, resp) => {
  const { email, phone, firstName, lastName,password } = req.body;
  Controller.createUserFn(
    email,
    phone,
    firstName,
    lastName,
    password,
    resp,
    req
  );
});
//updateData
app.put("/updateUser/:id", (req, resp) => {
  const { email, phone, firstName, lastName,password } = req.body;
  const id = req.params.id;
  console.log(id);
  Controller.updateUserData(id, email, phone, firstName, lastName, password,resp, req);
});

//DeleteData
app.delete("/removeUser/:id", (req, resp) => {
  const id = req.params.id;
  Controller.deleteUserData(id, resp);
});
app.post("/login", (req, resp) => {
  const { email, password } = req.body;
  Controller.loginUserFn(email,password,resp)
});
app.post("/logout", middlewareFn.customMiddlewareForToken, (req, resp) => {
  const { token } = req.headers;
  Controller.logoutUserfn(req,resp,token)
});
app.listen(4000);
