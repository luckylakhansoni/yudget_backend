const db = require("../models");

module.exports.createRecord = async (query)=>{
    try {
        let data = await db.emp.create(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.singleRecord = async (query) => {
    try {
        let data = await db.emp.findOne(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.updateRecord = async (body, query) => {
    try {
        let data = await db.emp.update(body, query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.activeUser = async (query) => {
    try {
        let data = await db.emp.count(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.findAllUsers = async(query)=> {
    try {
        let data = await db.emp.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.deleteUser = async(query)=> {
    try {
        let data = await db.emp.destroy(query)
        return data
    } catch (error) {
        throw error
    }
}


module.exports.findAllemp = async(query)=> {
    try {
        let data = await db.emp.findAll(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.findAndCount = async(query)=> {
    try {
        let data = await db.emp.findAndCountAll(query)
        return data
    } catch (error) {
        throw error
    }
}

module.exports.recordCount = async(query)=> {
    try {
        let data = await db.emp.count(query)
        return data
    } catch (error) {
        throw error
    }
}
module.exports.bulCreateRecord = async (body) => {
    try {
        let data = await db.emp.bulkCreate(body, {
            returning: true
        })
        return data
    } catch (error) {
        throw error
    }
}

