const alldata = require("./users.json");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path=require("path")
const pathname = path.join(__dirname, "users.json");
const handleValidation = (email, phone, firstName, lastName, resp) => {
  if (!email && !firstName && !lastName && !phone) {
    resp.status(400).send({ message: "Data is empty" });
  } else if (!email) {
    resp.status(400).send({ message: "email is required" });
  } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    resp.status(400).send({ message: "email is not right format" });
  } else if (!phone) {
    resp.status(400).send({ message: "phone is required" });
  } else if (!firstName) {
    resp.status(400).send({ message: "firstName is required" });
  } else if (
    !/^(?!.* {2,}).*$/.test(firstName) ||
    !/^[A-Za-z\s]*$/.test(firstName)
  ) {
    resp.status(400).send({ message: "firstName is not right format" });
  } else if (!lastName) {
    resp.status(400).send({ message: "lastName is required" });
  } else if (
    !/^(?!.* {2,}).*$/.test(lastName) ||
    !/^[A-Za-z\s]*$/.test(lastName)
  ) {
    resp.status(400).send({ message: "lastName is not right format" });
  } else if (phone.length != 10) {
    resp.status(400).send({ message: "phone number must be 10 digit" });
  }
};

const listOfData = (email, phone, firstName, lastName, resp) => {
  try {
    if (email || firstName || lastName || phone) {
      const data = alldata.filter((item) => {
        return (
          item.email === email ||
          item.firstName === firstName ||
          item.lastName === lastName ||
          item.phone === phone
        );
      });
      if(data.length>0){

        resp.status(200).send({ Data: data });
      }
      else{
        resp.status(203).send({ message:"this element is not added in database" });
      }
    }
     else {
      if (alldata.length == 0) {
        resp.status(203).send({ Data: alldata });
      } else {
        resp.status(200).send({ Data: alldata });
      }
    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
};

const createUserFn = (email, phone, firstName, lastName, resp, req) => {
  try {
    handleValidation(email, phone, firstName, lastName, resp);
    if (email && firstName && lastName && phone && phone.length == 10) {
      const filePath = pathname;
      let existingData = [];
      try {
        existingData = JSON.parse(fs.readFileSync(filePath));
      } catch (error) {
        console.log(error);
      }
      existingData.push({
        id: uuidv4().substring(0, 10),
        email,
        phone,
        firstName,
        lastName,
        ...req.body,
      });
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      resp.status(201).send({ message: "Data created successfully" });
    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
};
const updateUserData = (id, email, phone, firstName, lastName, resp, req) => {
  try {
    handleValidation(email, phone, firstName, lastName, resp);
    if (email && firstName && lastName && phone && phone.length == 10) {
      const filePath = pathname;
      const Data = JSON.parse(fs.readFileSync(filePath));
      Data.map((item) => {
        if (item.id === id) {
          item.email = email;
          item.firstName = firstName;
          item.lastName = lastName;
          item.phone = phone;
        }
      });
      fs.writeFileSync(filePath, JSON.stringify(Data, null, 2));
      resp.status(200).send({ message: "Data updated successfully" });
    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
};
const deleteUserData = (id, resp) => {
  try {
    const filePath = pathname;
    const Data = JSON.parse(fs.readFileSync(filePath));
    const DeleteItemTrue = Data.filter((item) => {
      return item.id == id;
    });
    if (Object.keys(DeleteItemTrue).length > 0) {
      let deleteData = Data.filter((item) => item.id !== id);
      fs.writeFileSync(filePath, JSON.stringify(deleteData, null, 2));
      resp.status(200).send({ message: "Data Deleted successfully" });
    } else {
      resp.status(400).send({ message: "id must be currect" });
    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
};
module.exports = { listOfData, createUserFn, updateUserData, deleteUserData };
