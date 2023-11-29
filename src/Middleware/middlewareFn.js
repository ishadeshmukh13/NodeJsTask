const customMiddlewareForToken = (req, resp, next) => {
   if(!req.headers.token ){
       resp.status(400).send({ message: "please provide token" });
    }
    return next()
};
module.exports = { customMiddlewareForToken };
