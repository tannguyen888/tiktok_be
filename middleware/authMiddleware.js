// TODO: import jsonwebtoken
const jwt = require('jsonwebtoken');
// TODO: authMiddleware
//   -> lấy token từ headers.authorization (format: 'Bearer <token>')
//   -> nếu không có token -> trả về 401
//   -> jwt.verify(token, JWT_SECRET) -> gán req.user = decoded -> gọi next()
//   -> nếu token lỗi -> trả về 401
const authMiddleware = (req, res, next) => {
   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
   
   try {
      if (!token) {
         return res.status(401).json({ message: 'No token provided' });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
   } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
   }
}
// TODO: module.exports = authMiddleware
module.exports = authMiddleware;
