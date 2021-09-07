import {Router}from 'express';
import allRecords from './employeeRecord.routes'
const router=Router();
router.use("/Data",allRecords)
export default router;