import {Router} from 'express';
import {signupRecords,Login,getItems, detailedItems, itemsPrice, totalSalary} from '../controllers/employeeRecord.controllers'
import Utility from "../common/utility"
const router=Router();
router.post('/AddRecords',signupRecords)
router.post('/login',Login)
router.post('/Items',Utility.authenticateJwt,getItems)
router.get("/details",Utility.authenticateJwt,detailedItems)
router.post("/cost",itemsPrice)
router.post("/salary",Utility.authenticateJwt,totalSalary)
export default router;