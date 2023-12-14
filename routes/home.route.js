const router = require('express').Router();
const validate = require('express-validation'); // server side validation
const {contact} = require('../validation/user') 
const  { gethomeData, contactUs } = require('../controllers/users.controller')

router.get('/active-user', gethomeData);
router.post('/contactus',  validate(contact.post.createContact), contactUs)

module.exports = router;