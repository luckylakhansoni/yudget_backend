
const Joi = require('joi');
module.exports = {
    solution: {
        post: {
            create: {
                body: {
                    name: Joi.string().required(),
                    description: Joi.string().required(),
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
    network: { 
        post: {
            create: {
                body: {
                    gas_station_name: Joi.string().required(),
                    fuel_type: Joi.string().required(),
                    lat: Joi.string().required(),
                    long: Joi.string().required(),

                }
            },
           
        },
        put: {
            update: {
                body: {
                    gas_station_name: Joi.string().optional(),
                    fuel_type: Joi.string().optional(),
                    lat: Joi.string().optional(),
                    long: Joi.string().optional(),
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
    company: { 
        post: {
            create: {
                body: {
                    name: Joi.string().required(),
                    description: Joi.string().required(),
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
            }
        },
        get: {
            getData: {
                path:{
                    id: Joi.number().required()
                }
            }
        },
        delete: {
            deleteData: {
                path:{
                    id: Joi.number().required()
                }
            }
        }
        
    },
    car: {
        put: {
            updateAcar:{
                body: {
                    car_plate: Joi.string().optional(),
                    type: Joi.string().optional(),
                    fuel_type: Joi.string().valid('95', '91', '0').optional(),
                    brand: Joi.string().optional(),
                    year: Joi.number().optional(),
                    branch_id: Joi.number().optional()
    
                },
                path: {
                    id: Joi.number().required()
                }
            }
            
        },
        get: {
            listCar: {
                query: {
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                    search_key: Joi.string().optional() 

                }
            },
            getCar: {
                path:{
                    id: Joi.number().required()
                }
            }

        },
        delete: {
            deleteCar: {
                path:{
                    id: Joi.number().required()
                }
            }
        }
    },
    branch: {
        post:{           
            createBranch: {
                branch_name: Joi.string().required(),
                city: Joi.string().required(),
                district: Joi.string().required(),
                branch_manager: Joi.string().required(),
            }
        },
        put: {
            updateBranch: {
                body:{
                    branch_name: Joi.string().optional(),
                    city: Joi.string().optional(),
                    district: Joi.string().optional(),
                    branch_manager: Joi.string().optional(),       
                },
                path: {
                    id: Joi.number().required()
                }
            }
        },
        get: {
            listBranch: {
                query: {
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                    search_key: Joi.string().optional() 

                }
            },
            getBranch: {
                path:{
                    id: Joi.number().required()
                }
            }

        },
        delete: {
            deleteBranch: {
                id: Joi.number().required()
            }
        }
    },
    gasAndCar: {
        post:{           
            createGasAndCar: {
                
            }
        },
        put: {
            updateGasAndCar: {
                body:{
                   
                },
                path: {
                    id: Joi.number().required()
                }
            }
        },
        get: {
            listGasAndCar: {
                query: {
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                    search_key: Joi.string().optional() 

                }
            },
            getGasAndCar: {
                path:{
                    id: Joi.number().required()
                }
            }

        },
        delete: {
            deleteGasAndCar: {
                id: Joi.number().required()
            }
        }
    },
    users: {
        post:{           
            createUser: {
                
            }
        },
        put: {
            updateUser: {
                body:{
                   
                },
                path: {
                    id: Joi.number().required()
                }
            }
        },
        get: {
            listUser: {
                query: {
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                    search_key: Joi.string().optional() 

                }
            },
            getUser: {
                path:{
                    id: Joi.number().required()
                }
            }

        },
        delete: {
            deleteUser: {
                id: Joi.number().required()
            }
        }
    },
    price: {
        post:{           
            createPrice: {
                body: {
                    name: Joi.string().required(),
                    description: Joi.string().required()
                }
            }
        },
        put: {
            updatePrice: {
                body:{
                    body: {
                        name: Joi.string().optional(),
                        description: Joi.string().optional()
                    }
                },
                path: {
                    id: Joi.number().required()
                }
            }
        },
        get: {
            listPrice: {
                query: {
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                    search_key: Joi.string().optional() 

                }
            },
            getPrice: {
                path:{
                    id: Joi.number().required()
                }
            }

        },
        delete: {
            deletePrice: {
                id: Joi.number().required()
            }
        }
    },
    about: {
        post:{           
            createAbout: {
                body: {
                    name: Joi.string().required(),
                    description: Joi.string().required()
                }
            }
        },
        put: {
            updateAbout: {
                body:{
                    body: {
                        name: Joi.string().optional(),
                        description: Joi.string().optional()
                    }
                },
                path: {
                    id: Joi.number().required()
                }
            }
        },
        get: {
            listAbout: {
                query: {
                    limit: Joi.number().required(),
                    offset: Joi.number().required(),
                    search_key: Joi.string().optional() 

                }
            },
            getAbout: {
                path:{
                    id: Joi.number().required()
                }
            }

        },
        delete: {
            deleteAbout: {
                id: Joi.number().required()
            }
        }
    },
    

  
};