const data = {
    employees: require('../model/employees.json'),
    setEmployees: function (data){this.employees = data}
}


const getAllEmployees = (req,res)=>{
    res.json(data.employees)
}
const createNewEmployee = (req,res)=>{
    //res.json({
        // "firstname":req.body.firstname,
        // "lastname":req.body.lastname
   // })
   const newEmployee = {
    id: data.employees[data.employees.length - 1].id + 1 || 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname
}
if (!newEmployee.firstname || !newEmployee.lastname){
    return res.status(400).json({"message":"Firstname and lastname required"})
}
data.setEmployees([...data.employees, newEmployee])
res.json(data.employees)
}
const updateEmployee = (req,res) =>{
    // res.json({
    //     "firstname":req.body.firstname,
    //     "lastname":req.body.lastname
    // })
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if (!employee){
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`})
    }
    if (req.body.firstname) employee.firstname = req.body.firstname
    if (req.body.lastname) employee.lastname = req.body.lastname
    const filteredArray = data.employees.filter(emp = emp.id !== parseInt(req.body.id))
    const unsortedArrat = [...filteredArray, employee]
    data.setEmployees(unsortedArrat.sort((a,b)=>a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
    res.status(201).json(data.employees)
}
const deleteEmployees = (req,res) => {
    // res.json({"id": req.body.id})
    const employee = data.employees.find(emp => emp.id === parseInt(req.body.id))
    if (!employee){
        return res.status(400).json({"message":`Employee ID ${req.body.id} not found`})    
    }
    const filtereEmployee = data.employees.filter(emp => emp.id !== parseInt(req.body.id))
    data.setEmployees([...filtereEmployee])
    res.status(201).json(data.employees)
}

const getEmployee = (req,res) => {
    //res.status(201).json({"id":req.params.id})
    const employee = data.employees.find(emp => emp.id === req.params.id)
    if (!employee){
        return res.status(400).json({"message":`Employee with ID ${req.params.id} not found`})
    }
    res.status(201).json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployees,
    getEmployee
}