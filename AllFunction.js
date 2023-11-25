const alldata = require("./AllData.json");
const { v4: uuidv4 } = require('uuid');
const fs=require("fs")
const SearchFunction = (field, element, resp) => {
  let flag = 1;
  alldata.map((item) => {
    if (item[field] === element) {
      flag = 0;
      resp.status(200).send({ Data: item });
    }
  });
  if (flag === 1) {
    resp.status(404).send({ message: "data not found" });
  }
};

const handleValidation=(email, phone, firstName, lastName, resp)=>{
  if (!email && !firstName && !lastName && !phone) {
    resp.status(404).send({ message: "Data is empty" });
  }
  if (!email) {
    resp.status(404).send({ message: "email is required" });
  } else if (!phone) {
    resp.status(404).send({ message: "phone is required" });
  } else if (!firstName) {
    resp.status(404).send({ message: "firstName is required" });
  } else if (!lastName) {
    resp.status(404).send({ message: "lastName is required" });
  } else if (phone.length != 10) {
    resp.status(404).send({ message: "phone number must be 10 digit" });
  }
}

const AllDataFunction = (email, phone, firstName, lastName, resp) => {
  try {
    if (email) {
      SearchFunction("email", email, resp);
    } else if (firstName) {
      SearchFunction("firstName", firstName, resp);
    } else if (lastName) {
      SearchFunction("lastName", lastName, resp);
    } else if (phone) {
      SearchFunction("phone", phone, resp);
    } else {
      resp.status(200).send({ Data: alldata });
    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
};

const HandleDataFn = (email, phone, firstName, lastName, resp,req) => {
  try {
    handleValidation(email, phone, firstName, lastName, resp)
    if (email && firstName && lastName && phone && phone.length == 10) {
        const filePath = 'AllData.json'
        let existingData = [];
        try {
            existingData = JSON.parse(fs.readFileSync(filePath));
          } catch (error) {
           console.log(error);
          }
          existingData.push( {
            id: uuidv4(), 
            email,
            phone,
            firstName,
            lastName,
            ...req.body,
          });
          fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
      resp.status(200).send({ message: "Data created successfully" });
    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
};
const handleUpdateData=(id,email, phone, firstName, lastName,resp,req)=>{
  try {
    handleValidation(email, phone, firstName, lastName, resp)
     if(email && firstName && lastName && phone && phone.length == 10){
       const filePath = 'AllData.json'
       const Data=JSON.parse(fs.readFileSync(filePath));
       Data.map((item)=>{
         if(item.id===id){
           item.email=email;
           item.firstName=firstName
           item.lastName=lastName
           item.phone=phone
         }
       })
       fs.writeFileSync(filePath, JSON.stringify(Data, null, 2));
      resp.status(200).send({ message: "Data updated successfully" });

    }
  } catch (error) {
    resp.status(500).send({ error: error });
  }
}
const handleDeleteData=(id,resp)=>{
  try {
       const filePath = 'AllData.json'
       const Data=JSON.parse(fs.readFileSync(filePath));
       const DeleteItemTrue=Data.filter((item)=>{
       return item.id==id
       })
       if(Object.keys(DeleteItemTrue).length>0){
         let deleteData = Data.filter((item) => item.id !== id);
         fs.writeFileSync(filePath, JSON.stringify(deleteData, null, 2));
        resp.status(200).send({ message: "Data Deleted successfully" });
       }
       else{
        resp.status(404).send({ message: "id must be currect" });

       }

  } catch (error) {
    resp.status(500).send({ error: error });
  }
  
}
module.exports = { AllDataFunction, HandleDataFn,handleUpdateData,handleDeleteData };
