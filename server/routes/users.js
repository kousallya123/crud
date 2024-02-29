const { ctrlRegister, ctrlLogin,getUsers,updateUser,deleteUser } = require('../controllers/userControllers')
const { verifyJWT } = require('../middleware/verify')
const router=require('express').Router()


router.post('/register',ctrlRegister)

router.post('/login',ctrlLogin)

router.get('/dashboard',verifyJWT,getUsers)

//for updating single user
router.put('/user/:id',verifyJWT,updateUser)


//for deleting single user
router.delete('/user/:id',verifyJWT,deleteUser)


module.exports=router