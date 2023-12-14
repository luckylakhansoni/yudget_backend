const router = require('express').Router();
const validate = require('express-validation'); // server side validation
const {user, branch, car} = require('../validation/user')

const  {register, signin, forget, resetPassword, userDashboard, addBranch, bracnhes, addCar, cars, branchStatusUpdate, carStatusUpdate, addAmountToCar , addAmountToBranch, changePassword, carList, assignCarToBranch, branchUpdate, carUpdate, removeAmountToBranch, removeAmountToCar, bulkBalanceAddtoBranch, revertAmountToUserCredit, bulkAddbranchToCarAmount, bulkRevertBranchToCarAmount, getUserCredit, updateProfile, CarBulkSearch, userProfile, BranchBulkReset, carBulkReset, getAllBranch, reportFilter, billList, vatBilList, saveCarWithCsv, fuelTypeList, allTransactions, billForcredit, invoiceList, logout, emp, userEmpList, saveEmpWithCsv, empEmailSend, empUpdate, empDelete, vatBillDetails, saveData, districtData, vatInvoiceList, getVatInvoiseDetails, testApi} = require('../controllers/users.controller')

const adminController = require('../controllers/admin.controller')
const { isAuthenticate, isUser, isActiveCompany, isApprovedAccount } = require('../middleware/auth') // JWT middleware

router.post('/register', validate(user.post.createUser), register);
router.post('/login', validate(user.post.signin), signin)
router.post('/forget', validate(user.post.forget), forget)
router.post('/reset-password', validate(user.post.reset), resetPassword)
router.post('/change-password', validate(user.post.change), isAuthenticate, isActiveCompany, isUser,  changePassword)


router.get('/dashboard', isAuthenticate, isAuthenticate, isActiveCompany, userDashboard)
router.post('/branch',validate(branch.post.create), isAuthenticate, isAuthenticate, isActiveCompany, addBranch)
router.get('/branch',isAuthenticate, isActiveCompany, isApprovedAccount, bracnhes)
router.put('/branch/:id',  isAuthenticate,  isActiveCompany, isApprovedAccount, isUser, branchUpdate)

router.put('/branch-status/:id',  isAuthenticate,  isActiveCompany, isApprovedAccount, isUser, branchStatusUpdate)
router.post('/branch/amount', validate(branch.post.addAmount), isAuthenticate,  isActiveCompany,isApprovedAccount, isUser, addAmountToBranch)
router.post('/branch/revert-amount', validate(branch.post.addAmount), isAuthenticate,  isActiveCompany, isUser, removeAmountToBranch)
router.post('/car',validate(car.post.create), isAuthenticate,  isApprovedAccount, isActiveCompany, addCar )
router.put('/car/:id',validate(car.put.statusUpdate), isAuthenticate, isApprovedAccount, isActiveCompany, carUpdate )
router.put('/car-status/:id',validate(car.put.statusUpdate), isAuthenticate,  isApprovedAccount, isActiveCompany, isUser, carStatusUpdate )
router.post('/car/amount/', validate(car.post.addAmount), isAuthenticate,   isActiveCompany, addAmountToCar)
router.post('/car/revert-amount', validate(car.post.addAmount), isAuthenticate, isApprovedAccount, isActiveCompany, removeAmountToCar)
router.get('/car',  isAuthenticate, isApprovedAccount, isActiveCompany, cars)
router.get('/cars', isAuthenticate, isActiveCompany, isApprovedAccount, isUser, carList)
router.post('/assign-car', isAuthenticate, isActiveCompany, isApprovedAccount, isUser, assignCarToBranch )
router.post('/branch/bulk-amount', isAuthenticate, isApprovedAccount, isActiveCompany, bulkBalanceAddtoBranch )
router.post('/branch/bulk-amount-reset', isAuthenticate, isApprovedAccount, isActiveCompany, isUser, BranchBulkReset )



router.post('/branch/bulk-revert', isAuthenticate, isActiveCompany, isApprovedAccount, isUser, revertAmountToUserCredit)
router.post('/car/balance',isAuthenticate, isActiveCompany, isApprovedAccount, bulkAddbranchToCarAmount)
router.post('/car/revert-balance', isAuthenticate, isApprovedAccount, isActiveCompany, bulkRevertBranchToCarAmount)
router.post('/car/bulk-amount-reset', isAuthenticate, isApprovedAccount, isActiveCompany, carBulkReset)

router.put('/update-profile', isAuthenticate, isActiveCompany, isUser, updateProfile)
router.get('/credit', isAuthenticate, isActiveCompany, getUserCredit)
router.get('/profile', isAuthenticate, isActiveCompany, userProfile)

router.get('/car/search', isAuthenticate, isApprovedAccount, isActiveCompany, isUser, CarBulkSearch)
router.get('/all-branch', isAuthenticate, isApprovedAccount, isActiveCompany, getAllBranch)
router.get('/report', isAuthenticate, isApprovedAccount, isActiveCompany, isUser, reportFilter)
router.get('/bill', isAuthenticate, isApprovedAccount, isActiveCompany, isUser, billList)
router.get('/vat-bill', isAuthenticate, isApprovedAccount, isActiveCompany, isUser, vatBilList)
router.post('/car-csv',  isAuthenticate, isApprovedAccount, isActiveCompany, saveCarWithCsv)
router.post('/car-type',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, fuelTypeList)
router.get('/all-transcation',  isAuthenticate, isApprovedAccount, isActiveCompany, allTransactions)
router.get('/bills',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, billForcredit)
router.get('/invoice',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, invoiceList)
router.delete('/session',  isAuthenticate, isActiveCompany, isUser, logout)
router.delete('/session',  isAuthenticate, isActiveCompany, isUser, logout)
router.post('/employee',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, emp)
router.get('/employee',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, userEmpList)
router.post('/employee/massupload',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, saveEmpWithCsv)
router.post('/employee/email',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, empEmailSend)
router.put('/employee/:id', isAuthenticate, isApprovedAccount, isActiveCompany, isUser, empUpdate)
router.delete('/employee/:id',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser, empDelete)
router.get('/vat-bills/:id',  isAuthenticate, isApprovedAccount, isActiveCompany, isUser,vatBillDetails)
router.post('/save',  districtData)
router.get('/vat-invoice',isAuthenticate, isApprovedAccount, isActiveCompany, isUser, vatInvoiceList)
router.get('/vatinvoice-detail', isAuthenticate, isApprovedAccount, isActiveCompany, isUser,getVatInvoiseDetails)


router.get('/email', testApi)










module.exports = router;