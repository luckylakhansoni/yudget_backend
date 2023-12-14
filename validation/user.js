const Joi = require("joi");
module.exports = {
  user: {
    post: {
      createUser: {
        body: {
          email: Joi.string().email().required(),
          password: Joi.string()
            .regex(/^[a-zA-Z0-9!@#$%&*]{3,25}$/)
            .required(),
          user_type: Joi.string().required(),
        },
      },
      signin: {
        body: {
          station_id: Joi.string().optional(),     
          password: Joi.string().required(),
        },
      },
      forget: {
        body: {
          station_id: Joi.string().optional(),
          email: Joi.string().optional(),
        },
      },
      reset: {
        body: {
          otp: Joi.number().required(),
          password: Joi.string().required(),
        },
      },
      change: {
        body: {
          current_password: Joi.string().required(),
          password: Joi.string().required(),
        },
      },
    },
    get: {},
    put: {},
    delete: {},
  },
  contact: {
    post: {
      createContact: {
        body: {
          name: Joi.string().required(),
          email: Joi.string().required(),
          message: Joi.string().required(),
        },
      },
    },
  },
  branch: {
    post: {
      create: {
        body: {
          branch_name: Joi.string().required(),
          city_id: Joi.string().required(),
          district_id: Joi.string().required(),
          branch_manager: Joi.string().required(),
          email: Joi.string().email().required(),
          // password: Joi.string().required(),

        },
      },
      addAmount: {
        body: {
          branch_id: Joi.number().required(),
          amount: Joi.number().required(),
        },
      },
    },
    put: {
      updateStatus: {
        path: {
          id: Joi.number().required(),
          isActive: Joi.boolean().required(),
        },
      },
    },
  },
  car: {
    post: {
      create: {
        body: {
          car_plate: Joi.string().required(),
          car_type_id: Joi.string().required(),
          fuel_type_id: Joi.number().required(),
          brand_id: Joi.string().required(),
          year_id: Joi.string().required(),
          // branch_id: Joi.number().required()
        },
      },
      addAmount: {
        body: {
          branch_id: Joi.number().required(),
          car_id: Joi.number().required(),
          amount: Joi.number().required(),
        },
      },
    },
    put: {
      statusUpdate: {
        path: {
          id: Joi.number().required(),
          isActive: Joi.boolean().required(),
        },
      },
    },
  },
  supportValidation: {
    post: {
      createSupport: {
        body: {
          title: Joi.string().required(),
          query: Joi.string().required(),
        },
      },
    },
  },
};
