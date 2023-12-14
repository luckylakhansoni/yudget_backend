const db = require("../models");
const gasAndCarCompany = db.gasCompany;

module.exports.createRecord = async (query)=>{
    try {
        let data = await gasAndCarCompany.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await gasAndCarCompany.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await gasAndCarCompany.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}


module.exports.findAllGasCompany = async(query)=> {
    try {
        let data = await gasAndCarCompany.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await gasAndCarCompany.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.recordCount = async(query)=> {
    try {
        let data = await gasAndCarCompany.count(query)
        return data
    } catch (error) {
        throw error
    }
}



