const activeData=require("./activeUser.json")
const customMiddlewareForToken = (req, resp, next) => {
   if(!req.headers.token ){
       resp.status(400).send({ message: "please provide token" });
    }
    else if(req.headers.token){
       const checkToken=activeData.filter((item)=>{
       return  item.token==req.headers.token
       })
       if(Object.keys(checkToken).length>0){
           return next()
       }
       else{
       resp.status(400).send({ message: "please provide right token" });

       }
    }
};
module.exports = { customMiddlewareForToken };
