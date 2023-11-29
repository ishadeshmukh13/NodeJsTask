const alldata = require("./users.json");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const userFile = path.join(__dirname, "users.json");
const activeUserFile = path.join(__dirname, "activeUser.json");
const handleValidation = (
  email,
  phone,
  firstName,
  lastName,
  password,
  resp
) => {
  if (!email && !firstName && !lastName && !phone && !password) {
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
  } else if (!password) {
    resp.status(400).send({ message: "password is required" });
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    resp.status(400).send({ message: "password is not right format" });
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
      if (data.length > 0) {
        resp.status(200).send({ Data: data });
      } else {
        resp
          .status(203)
          .send({ message: "this element is not added in database" });
      }
    } else {
      if (alldata.length == 0) {
        resp.status(203).send({ Data: alldata });
      } else {
        resp.status(200).send({ Data: alldata });
      }
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
};

const createUserFn = (
  email,
  phone,
  firstName,
  lastName,
  password,
  resp,
  req
) => {
  try {
    handleValidation(email, phone, firstName, lastName, password, resp);
    if (email && firstName && lastName && phone && phone.length == 10) {
      const filePath = userFile;
      let existingData = [];
      try {
        existingData = JSON.parse(fs.readFileSync(filePath));
      } catch (error) {
        console.log(error.message);
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
    resp.status(500).send({ error: error.message });
  }
};
const updateUserData = (
  id,
  email,
  phone,
  firstName,
  lastName,
  password,
  resp,
  req
) => {
  try {
    handleValidation(email, phone, firstName, lastName, password, resp);

    if (email && firstName && lastName && phone && phone.length === 10) {
      const filePath = userFile;
      const Data = JSON.parse(fs.readFileSync(filePath));
      const userUserTrue = Data.filter((item) => {
        return item.id == id;
      });
      if (Object.keys(userUserTrue).length > 0) {
      Data.map((item) => {
        if (item.id === id) {
          item.email = email;
          item.firstName = firstName;
          item.lastName = lastName;
          item.phone = phone;
          item.password=password
        }
      });

        fs.writeFileSync(filePath, JSON.stringify(Data, null, 2));
        resp.status(200).send({ message: "Data updated successfully" });
      } else {
        resp.status(400).send({ message: "Please provide a valid user ID" });
      }
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
};

const deleteUserData = (id, resp) => {
  try {
    const filePath = userFile;
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
    resp.status(500).send({ error: error.message });
  }
};
const generateRandomToken = () => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let token = "";

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};
const loginUserFn = (email, password, resp) => {
  try {
    if (!email || !password) {
      resp.status(400).send({ message: "something is missing please check" });
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      resp.status(400).send({ message: "email is not right format" });
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      resp.status(400).send({ message: "password is not right format" });
    } else {
      try {
        const userData = JSON.parse(fs.readFileSync(userFile));
        const checkUser = userData.filter((item) => {
          return item.email === email && item.password === password;
        });
        if (checkUser.length > 0) {
          const activeUserData = JSON.parse(fs.readFileSync(activeUserFile));
          activeUserData.push({
            id: uuidv4().substring(0, 10),
            token: generateRandomToken(),
            email,
            password,
          });
          fs.writeFileSync(
            activeUserFile,
            JSON.stringify(activeUserData, null, 2)
          );

          resp.status(200).send({
            message: "User successfully logged in.",
            token: activeUserData[activeUserData.length - 1].token,
            id: activeUserData[activeUserData.length - 1].id,
          });
        } else {
          resp
            .status(400)
            .send({ message: "please provide right credentials" });
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
};
const logoutUserfn = (req, resp, token) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      resp.status(400).send({
        message: "something (email or password) is missing please check",
      });
    } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      resp.status(400).send({ message: "email is not right format" });
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      )
    ) {
      resp.status(400).send({ message: "password is not right format" });
    } else if (token && email && password) {
      const activeUserData = JSON.parse(fs.readFileSync(activeUserFile));
      const checkData = activeUserData.filter((item) => {
        return (
          item.email == email &&
          (item.password == password) & (item.token == token)
        );
      });
      if (checkData.length > 0) {
        const filterData = activeUserData.filter((item) => {
          return (
            item.email !== email &&
            (item.password !== password) & (item.token !== token)
          );
        });
        fs.writeFileSync(activeUserFile, JSON.stringify(filterData, null, 2));
        resp.status(200).send({
          message: "User successfully logged out.",
        });
      } else {
        resp.status(400).send({
          message: "please provide right credentials",
        });
      }
    }
  } catch (error) {
    resp.status(500).send({ error: error.message });
  }
};

module.exports = {
  listOfData,
  loginUserFn,
  logoutUserfn,
  createUserFn,
  updateUserData,
  deleteUserData,
  generateRandomToken,
};
