const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const { JWT, USER_TYPE } = require("../utils/constant");
const getAuthToken = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    req.authToken = req.headers.authorization.split(" ")[1];
  } else {
    req.authToken = null;
  }
  next();
}
exports.isAuthenticate = async (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      let decoded = jwt.verify(req.authToken, JWT.tokenString);
      console.log({ decoded })

      if (decoded.user_id) {
        let userDetails = await User.findOne({
          where: {
            user_id: decoded.user_id,
          },
        });
        if (userDetails) {
          req.userId = userDetails.user_id;
          req.userType = userDetails.user_type;
          req.isActive = userDetails.isActive;
          req.isApproved = userDetails.isApproved;


          return next();
        } else {
          return res
            .status(401)
            .json({ message: { en: "You are not authorized to make this request", ar: 'أنت غير مخول لتقديم هذا الطلب' } });
        }
      } else if (decoded.station_id) {
        let stationDetails = await db.station_emp.findOne({
          where: {
            station_id: decoded.station_id,
          },
        });
        if (stationDetails) {
          req.userId = stationDetails.station_id;
          req.isActive = stationDetails.isActive;
          return next();
        } else {
          return res
            .status(401)
            .json({ message: { en: "You are not authorized to make this request", ar: 'أنت غير مخول لتقديم هذا الطلب' } });
        }
      } else if (decoded.branch_id) {
        let branchDetails = await db.branch.findOne({
          where: {
            branch_id: decoded.branch_id,
          },
        });
        if (branchDetails) {
          req.branch_id = branchDetails.branch_id;
          req.isBranch = true,
            req.userId = branchDetails.user_id
          req.isActive = branchDetails.isActive
          return next();
        } else {
          return res
            .status(401)
            .json({ message: { en: "You are not authorized to make this request", ar: 'أنت غير مخول لتقديم هذا الطلب' } });
        }
      } else {
        return res
          .status(401)
          .json({ message: { en: "You are not authorized to make this request", ar: 'أنت غير مخول لتقديم هذا الطلب' } });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(401)
        .json({ message: { en: "Jwt session expired", ar: 'انتهت صلاحية جلسة Jwt' } });
    }
  });
};
exports.isStationEmp = async (req, res, next) => {
  try {
    if (req.userType === USER_TYPE.station_emp) {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "You are not station employee to make this request" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "You are not station employee to make this request" });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.userType === USER_TYPE.admin) {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "You are not Admin to make this request" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "You are not Admin to make this request" });
  }
};

exports.isUser = async (req, res, next) => {
  try {
    if (req.userType === USER_TYPE.user) {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: { en: "You are not User to make this request", ar: 'أنت لست مستخدم لتقديم هذا الطلب' } });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: { en: "You are not User to make this request", ar: 'أنت لست مستخدم لتقديم هذا الطلب' } });
  }
};
exports.isStationEmp = async (req, res, next) => {
  try {
    if (req.userType === USER_TYPE.station_emp) {
      return next();
    } else {
      return res
        .status(401)
        .json({ message: "You are not Station emp to make this request" });
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: "You are not Station emp to make this request" });
  }
};

exports.isActiveCompany = async (req, res, next) => {
  try {
    if (req.isActive === 0 || req.isActive === false) {
      return res
        .status(401)
        .json({ message: "Your Account is deactivated by admin" });

    } else {
      return next();

    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: { en: "You are not Station emp to make this request", ar: 'تم إلغاء تنشيط حسابك من قبل المسؤول' } });
  }
};
exports.isApprovedAccount = async (req, res, next) => {
  try {
    if (req.isApproved === 0 || req.isApproved === false) {
      return res
        .status(401)
        .json({ message: { en: "Your account is not approved by admin", ar: 'لم تتم الموافقة على حسابك من قبل المسؤول' } });

    } else {
      return next();
    }
  } catch (error) {
    return res
      .status(401)
      .json({ message: { en: "Your account is not approved by admin", ar: 'لم تتم الموافقة على حسابك من قبل المسؤول' } });

  }
};


