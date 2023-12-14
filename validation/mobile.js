const Joi = require('joi');
module.exports = {
    mobile: {
        post: {
            create: {
                body: {
                    amount: Joi.number().required(),
                    car_plate: Joi.string().required(),
                    emp_code: Joi.number().required()
                }
            },
           
        },
        put: {
            update: {
                body: {
                    name: Joi.string().optional(),
                    description: Joi.string().optional(),
                },
                path: {
                    id: Joi.number().required()
                }
            },
        },
        delete: {
            deleteData: {
                path : {
                    id: Joi.number().required(),
                }
            },
        },
        get: {
            getData: {
                path : {
                    id: Joi.number().required(),
                }
            },
        }
        
    },
}