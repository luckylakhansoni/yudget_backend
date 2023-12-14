const router = require('express').Router();
const validate = require('express-validation'); // server side validation

const {support, passwordCheck, saleReports, transaction, signin, logout, stationIds} = require('../controllers/station.controller')
const {mobile} = require('../validation/mobile')
const  {searchCarPlate} = require('../controllers/users.controller')
const { isAuthenticate, isActiveCompany } = require('../middleware/auth') // JWT middleware
router.post('/login',  signin)
router.post('/car-search', isAuthenticate, isActiveCompany,  searchCarPlate)
router.post('/password', isAuthenticate, isActiveCompany,  passwordCheck)
router.post('/support', isAuthenticate, isActiveCompany,  support)
router.get('/report',  isAuthenticate, isActiveCompany,  saleReports)
router.post('/transaction',  isAuthenticate, isActiveCompany, validate(mobile.post.create),  transaction)
router.delete('/session',  isAuthenticate, isActiveCompany, logout)
router.get('/stations',  isAuthenticate, isActiveCompany, stationIds)



module.exports = router;