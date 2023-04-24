const express = require('express')
const router = express.Router()
const employeeController = require('../../controllers/employeesController');
const ROLE_LIST = require('../../config/role_list')
const verifyRoles = require('../../middleware/verifyRoles')

router.route('/')
    .get(employeeController.getAllEmployees)
    .post(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),employeeController.createNewEmployee)
    .put(verifyRoles(ROLE_LIST.Admin, ROLE_LIST.Editor),employeeController.updateEmployee)
    .delete(verifyRoles(ROLE_LIST.Admin),employeeController.deleteEmployees)

router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router