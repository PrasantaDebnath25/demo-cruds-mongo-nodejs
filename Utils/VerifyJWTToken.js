import jwt from 'jsonwebtoken';
import config from '../config';
import UserModel from '../Models/userModel';

const verifyToken = (req, res, next) => {
  console.log(req.body);
  let token;
  if (req?.headers?.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req?.cookies?.jwt) {
    token = req.cookies.jwt;
    // console.log(token);
  } else {
    token = req.body.accessToken || req.query.accessToken || req.headers['x-access-token'];
    // console.log(token);
  }
  if (token) {
    new Promise((resolve, reject) => {
      jwt.verify(token, config.SECRET_KEY, function (err, decoded) {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    }).then(async (decoded) => {
      const user = await UserModel.findOne({ _id: decoded._id }, {
        password: 0
      });
      if (!user) {
        return res.status(403).send({
          status: 400,
          errors: 'Invalid user or token'
        });
      }

      // if (user.isAdmin !== true){
      //     return res.status(403).send({
      //         status: 400,
      //         errors: 'Not an admin, unauthorized'
      //     });
      // }

      req.user = JSON.parse(JSON.stringify(user));

      next();

    }).catch((err) => {
      return res.status(401).send({
        status: 400,
        errors: err
      });
    })
  } else {

    return res.status(401).send({
      status: 400,
      errors: 'Missing authorization token'
    });
  }
}

// module.exports = verifyToken;
export default verifyToken;