/**
 * @module httpErrorhandler
 * @description Helper functions to handle express errors and send response.
 */

 const sendErrorDev = (err, res) => res.status(err.status).json({
   message: err.message,
   stack: err.stack,
 });
 
 const sendErrorProd = (err, res) => res
   .status(err.status || 500)
   .json({ message: err && err.message ? err.message : "Server Error" });
 
 const httpErrorhandler = (err, req, res, next) => {
   if (!res.headersSent) {
     if (process.env.NODE_ENV === 'dev') {
       return sendErrorDev(err, res);
     } return sendErrorProd(err, res);
   }
   return next();
 };
 
 module.exports = httpErrorhandler;
 