const db = require("../models");


module.exports.createRecord = async (query)=>{
    try {
        let data = await db.solution.create(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.singleRecord = async (query)=>{
    try {
        let data = await db.solution.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllsolution = async(query)=> {
    try {
        let data = await db.solution.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.solution.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteRecord = async(query)=> {
    try {
        let data = await db.solution.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.recordCount = async(query)=> {
    try {
        let data = await db.solution.count(query)
        return data
    } catch (error) {
        throw error
    }
}

