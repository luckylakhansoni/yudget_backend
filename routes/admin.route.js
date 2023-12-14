const router = require('express').Router();
const validate = require('express-validation'); // server side validation
const {user} = require('../validation/user')
const {solution, company, car, network, branch, gasAndCar, users, price, about  } = require('../validation/admin') 

const  {register, signin, forget, resetPassword,  } = require('../controllers/users.controller')
const { isAuthenticate, isAdmin, isActiveCompany } = require('../middleware/auth'); // JWT middleware

const { addSolution, addCompany, uploadImage, imageList, branchList, userList, carList,userDetail, userUpdate, empDetail, empUpdate, empDelete, empList, branchDetail, carDetail, carDelete, branchUpdate, branchDelete, carUpdate, updateCompany, listCompany,getCompany,deleteCompany, updateSolution,addNetwork, updateNetwork, listNetwork, deleteNetwork, getNetwork, listSolution, getSolution,  deleteSolution, addCarOrGasCompany, getCarOrGasCompany, listCarOrGasCompany, updateCarOrGasCompany, deleteCarOrGasCompany, addPartnerImage, addAbout, listAbout, getAbout, updateAbout, deleteAbout, addPrice, listPrice, getPrice, updatePrice, deletePrice, addHome, listHome, getHome, updateHome, deleteHome, getPartner, listPartnerImage, updatePartner, deletePartner, getImage, updateImage, deleteImage, updateCompanyProfile, addContact, listContact, getContact, updateContact, deleteContact, addPrivacy, updatePrivacy, getPrivacy, listPrivacy, deletePrivacy, addGetInTouch, updateGetInTouch, getGetInTouch, listGetInTouch, deleteGetInTouch, addNotification, getNotification, listNotification, deleteNotification, updateNotification, listNotificationForAll, addFuelPrice, updateFuelPrice, getFuelPrice, listFuelPrice, deleteFuelPrice, approvedUser, addDistrict, addCity, getCityFromDistrict, adminDashboard, addYear, addBrand, addCarType, commonList, supportList, emp, addDefaultFee, updateDefaultFee, getDefaultFee, listDefaultFee, deleteDefaultFee, addPackage, updatePackage, getPackage, listPackage, deletePackage, adminList, supportUpdate, adminUpdate, adminDelete, adminDetails, transferBalance, userDelete, billForcredit, resetAccount, saveCarWithCsv, saveStationWithCsv, companyName, paymentProcessList, paymentProceed, paymentList, CompaniesSummary, gasStationSummary, gasStationSails, companySales, invoiceCall, adminDashboardSale, invoiceCallData, AddCompanyUser  } = require('../controllers/admin.controller');

router.post('/register', isAuthenticate, validate(user.post.createUser), register);
router.post('/login', validate(user.post.signin), signin)
router.post('/forget', validate(user.post.forget), forget)
router.post('/reset-password', validate(user.post.reset), resetPassword)
router.get('/admin-user', isAuthenticate, isActiveCompany,  adminList)
router.put('/admin-user/:id',  isAuthenticate, isActiveCompany, adminUpdate)
router.delete('/admin-user/:id', isAuthenticate, isActiveCompany,  adminDelete)
router.get('/admin-user/:id',isAuthenticate, isAdmin, isActiveCompany,  adminDetails)

router.post('/solution',validate(solution.post.create), isAuthenticate, isAdmin, isActiveCompany, addSolution)
router.put('/solution/:id',validate(solution.put.update), isAuthenticate, isAdmin, isActiveCompany, updateSolution)
router.get('/solution/:id', validate(solution.get.getData), isAuthenticate, isAdmin, isActiveCompany, getSolution)
router.get('/solution', isAuthenticate, isAdmin, isActiveCompany, listSolution)
router.delete('/solution/:id', validate(solution.delete.deleteData), isAuthenticate, isAdmin, isActiveCompany, deleteSolution)

router.post('/network',validate(network.post.create),  addNetwork)
router.put('/network/:id',validate(network.put.update), isAuthenticate, isAdmin, isActiveCompany, updateNetwork)
router.get('/network/:id', validate(network.get.getData), isAuthenticate, isAdmin, isActiveCompany, getNetwork)
router.get('/network', isAuthenticate, isAdmin, isActiveCompany, listNetwork)
router.delete('/network/:id', validate(network.delete.deleteData), isAuthenticate, isAdmin, isActiveCompany, deleteNetwork)

router.post('/company', validate(company.post.create), isAuthenticate, isAdmin, isActiveCompany, addCompany)
router.put('/company/:id', validate(company.put.update), isAuthenticate, isAdmin, isActiveCompany, updateCompany)
router.get('/company/:id', validate(company.get.getData), isAuthenticate, isAdmin, isActiveCompany, getCompany)
router.get('/company', isAuthenticate, isAdmin, isActiveCompany, listCompany)
router.delete('/company/:id', validate(company.delete.deleteData), isAuthenticate, isAdmin, isActiveCompany, deleteCompany)

router.post('/partner',isAuthenticate, isAdmin, isActiveCompany, addPartnerImage)
router.get('/partner',isAuthenticate, isAdmin, isActiveCompany, listPartnerImage)
router.get('/partner/:id',isAuthenticate, isAdmin, isActiveCompany, getPartner)
router.put('/partner/:id',isAuthenticate, isAdmin, isActiveCompany, updatePartner)
router.delete('/partner/:id',isAuthenticate, isAdmin, isActiveCompany, deletePartner)

router.post('/image', isAuthenticate, isAdmin, isActiveCompany, uploadImage)
router.get('/imagelist',isAuthenticate, isAdmin, isActiveCompany, imageList)
router.get('/image/:id',isAuthenticate, isAdmin, isActiveCompany, getImage)
router.put('/image/:id',isAuthenticate, isAdmin, isActiveCompany, updateImage)
router.delete('/image/:id',isAuthenticate, isAdmin, isActiveCompany, deleteImage)

router.get('/branch', validate(branch.get.listBranch), isAuthenticate, isAdmin, isActiveCompany, branchList)
router.get('/branch/:id', validate(branch.get.listBranch), isAuthenticate, isAdmin, isActiveCompany, branchDetail)
router.put('/branch/:id', validate(branch.put.updateBranch), isAuthenticate, isAdmin, isActiveCompany, branchUpdate)
router.delete('/branch/:id', validate(branch.delete.deleteBranch), isAuthenticate, isAdmin, isActiveCompany, branchDelete)

router.get('/car', validate(car.get.listCar), isAuthenticate, isAdmin, isActiveCompany, carList)
router.get('/car/:id', validate(car.get.getCar), isAuthenticate, isAdmin, isActiveCompany, carDetail)
router.delete('/car/:id', validate(car.delete.deleteCar), isAuthenticate, isAdmin, isActiveCompany, carDelete)
router.put('/car/:id', validate(car.put.updateAcar), isAuthenticate, isAdmin, isActiveCompany, carUpdate)

router.get('/employee', isAuthenticate, isAdmin, isActiveCompany, empList)
router.post('/employee', isAuthenticate, isAdmin, isActiveCompany, emp)
router.get('/employee/:id', isAuthenticate, isAdmin, isActiveCompany, empDetail)
router.put('/employee/:id', isAuthenticate, isAdmin, isActiveCompany, empUpdate)
router.delete('/employee/:id', isAuthenticate, isAdmin, isActiveCompany, empDelete)

router.post('/car-companies', isAuthenticate, isAdmin, isActiveCompany, addCarOrGasCompany)
router.get('/car-companies', validate(gasAndCar.get.listGasAndCar), isAuthenticate, isAdmin, isActiveCompany, listCarOrGasCompany)
router.get('/car-companies/:id', validate(gasAndCar.get.getGasAndCar), isAuthenticate, isAdmin, isActiveCompany, getCarOrGasCompany)
router.put('/car-companies/:id', validate(gasAndCar.put.updateGasAndCar), isAuthenticate, isAdmin, isActiveCompany, updateCarOrGasCompany)
router.delete('/car-companies/:id', validate(gasAndCar.delete.deleteGasAndCar), isAuthenticate, isAdmin, isActiveCompany, deleteCarOrGasCompany)
router.put('/approved-request/:id', isAuthenticate, isAdmin, isActiveCompany, approvedUser)

router.post('/about', validate(about.post.createAbout), isAuthenticate, isAdmin, isActiveCompany, addAbout)
router.get('/about', validate(about.get.listAbout), isAuthenticate, isAdmin, isActiveCompany, listAbout)
router.get('/about/:id', validate(about.get.getAbout), isAuthenticate, isAdmin, isActiveCompany, getAbout)
router.put('/about/:id', validate(about.put.updateAbout), isAuthenticate, isAdmin, isActiveCompany, updateAbout)
router.delete('/about/:id', validate(about.delete.deleteAbout), isAuthenticate, isAdmin, isActiveCompany, deleteAbout)

router.post('/price', validate(price.post.createPrice), isAuthenticate, isAdmin, isActiveCompany, addPrice)
router.get('/price', validate(price.get.listPrice),     isAuthenticate, isAdmin, isActiveCompany, listPrice)
router.get('/price/:id', validate(price.get.getPrice), isAuthenticate, isAdmin, isActiveCompany, getPrice)
router.put('/price/:id', validate(price.put.updatePrice), isAuthenticate, isAdmin, isActiveCompany, updatePrice)
router.delete('/price/:id', validate(price.delete.deletePrice), isAuthenticate, isAdmin, isActiveCompany, deletePrice)

router.post('/home', isAuthenticate, isAdmin, isActiveCompany, addHome)
router.get('/home', isAuthenticate, isAdmin, isActiveCompany, listHome)
router.get('/home/:id',  isAuthenticate, isAdmin, isActiveCompany, getHome)
router.put('/home/:id',  isAuthenticate, isAdmin, isActiveCompany, updateHome)
router.delete('/home/:id', isAuthenticate, isAdmin, isActiveCompany, deleteHome)

router.post('/contact', isAuthenticate, isAdmin, isActiveCompany, addContact)
router.get('/contact', isAuthenticate, isAdmin, isActiveCompany, listContact)
router.get('/contact/:id',  isAuthenticate, isAdmin, isActiveCompany, getContact)
router.put('/contact/:id',  isAuthenticate, isAdmin, isActiveCompany, updateContact)
router.delete('/contact/:id', isAuthenticate, isAdmin, isActiveCompany, deleteContact)

router.post('/privacy', isAuthenticate, isAdmin, isActiveCompany, addPrivacy)
router.put('/privacy/:id', isAuthenticate, isAdmin, isActiveCompany, updatePrivacy)
router.get('/privacy/:id', isAuthenticate, isAdmin, isActiveCompany, getPrivacy)
router.get('/privacy', isAuthenticate, isAdmin, isActiveCompany, listPrivacy)
router.delete('/privacy/:id', isAuthenticate, isAdmin, isActiveCompany, deletePrivacy)

router.post('/contact-info', isAuthenticate, isAdmin, isActiveCompany, addGetInTouch)
router.put('/contact-info/:id', isAuthenticate, isAdmin, isActiveCompany, updateGetInTouch)
router.get('/contact-info/:id', isAuthenticate, isAdmin, isActiveCompany, getGetInTouch)
router.get('/contact-info',  listGetInTouch)
router.delete('/contact-info/:id', isAuthenticate, isAdmin, isActiveCompany, deleteGetInTouch)

router.post('/notification', isAuthenticate, isAdmin, isActiveCompany, addNotification)
router.put('/notification/:id',isAuthenticate, isAdmin, isActiveCompany, updateNotification)
router.get('/notification/:id',  getNotification)
router.get('/notification',isAuthenticate, isAdmin, isActiveCompany, listNotification)
router.delete('/notification/:id',isAuthenticate, isAdmin, isActiveCompany, deleteNotification)
router.get('/all-notificaton', listNotificationForAll)

router.post('/fuel-price', isAuthenticate, isAdmin, isActiveCompany, addFuelPrice)
router.put('/fuel-price/:id',isAuthenticate, isAdmin, isActiveCompany, updateFuelPrice)
router.get('/fuel-price/:id', isAuthenticate, isAdmin, isActiveCompany,  getFuelPrice)
router.get('/fuel-price',isAuthenticate, isAdmin, isActiveCompany, listFuelPrice)
router.delete('/fuel-price/:id',isAuthenticate, isAdmin, isActiveCompany, deleteFuelPrice)

router.get('/user', validate(users.get.listUser), isAuthenticate, isAdmin, isActiveCompany, userList)
router.get('/user/:id', validate(users.get.getUser), isAuthenticate, isAdmin, isActiveCompany, userDetail)
router.put('/user/:id', validate(users.put.updateUser), isAuthenticate, isAdmin, isActiveCompany, userUpdate)
router.post('/user', isAuthenticate, isAdmin, isActiveCompany, AddCompanyUser)

router.delete('/user/:id', isAuthenticate, isAdmin, isActiveCompany, userDelete)

router.put('/company-profile/:id', isAuthenticate, isAdmin, isActiveCompany,  updateCompanyProfile)
router.post('/district', addDistrict)
router.post('/city', addCity)
router.get('/city', getCityFromDistrict)
router.get('/dashboard', adminDashboard)
router.post('/year', addYear)
router.post('/brand', addBrand)
router.post('/car-type', addCarType)
router.get('/common-data', commonList)

router.get('/support', isAuthenticate, isAdmin, isActiveCompany, supportList)
router.put('/support/:id', isAuthenticate, isAdmin, isActiveCompany, supportUpdate)

router.post('/default-fee', isAuthenticate, isAdmin, isActiveCompany, addDefaultFee)
router.put('/default-fee/:id',isAuthenticate, isAdmin, isActiveCompany, updateDefaultFee)
router.get('/defaut-fee/:id', isAuthenticate, isAdmin, isActiveCompany,  getDefaultFee)
router.get('/default-fee',isAuthenticate, isAdmin, isActiveCompany, listDefaultFee)
router.delete('/default-fee/:id',isAuthenticate, isAdmin, isActiveCompany, deleteDefaultFee) 

router.post('/package', isAuthenticate, isAdmin, isActiveCompany, addPackage)
router.put('/package/:id',isAuthenticate, isAdmin, isActiveCompany, updatePackage)
router.get('/defaut-fee/:id', isAuthenticate, isAdmin, isActiveCompany,  getPackage)
router.get('/package',isAuthenticate, isAdmin, isActiveCompany, listPackage)
router.delete('/package/:id',isAuthenticate, isAdmin, isActiveCompany, deletePackage)
router.post('/user/amount',isAuthenticate, isAdmin, isActiveCompany, transferBalance)
router.get('/user/amount',isAuthenticate, isAdmin, isActiveCompany, billForcredit)
router.put('/company/reset/:id',isAuthenticate, isAdmin, isActiveCompany, resetAccount)
router.post('/car/csv',isAuthenticate, isAdmin, isActiveCompany, saveCarWithCsv)
router.post('/company/csv',isAuthenticate, isAdmin, isActiveCompany, saveStationWithCsv)
router.get('/company/name',isAuthenticate, isAdmin, isActiveCompany, companyName)
router.get('/payment',isAuthenticate, isAdmin, isActiveCompany, paymentList)
router.put('/payment/:id',isAuthenticate, isAdmin, isActiveCompany, paymentProceed)

router.get('/companies_summary',isAuthenticate, isAdmin, isActiveCompany, CompaniesSummary)
router.get('/gas-company-summary',isAuthenticate, isAdmin, isActiveCompany, gasStationSummary)
router.get('/gas-station-sales',isAuthenticate, isAdmin, isActiveCompany, gasStationSails)
router.get('/company-sales',isAuthenticate, isAdmin, isActiveCompany, companySales)
router.get('/invoice-list', invoiceCall)
router.get('/dashboard-sales', isAuthenticate, isAdmin, isActiveCompany, adminDashboardSale)
router.get('/generate', invoiceCallData)















module.exports = router;