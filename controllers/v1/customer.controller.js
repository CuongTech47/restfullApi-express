const customerModel = require('../../models/v1/customer.model')
const ErrorResponse = require('../../utils/errorResponse')
class CustomerController {
    async login(req , res , next){
        console.log(req.body.result.user)
        const id =  req.body.result.user.udId
        const displayName = req.body.result.user.displayName
        const email = req.body.result.user.email
        const emailVerified = req.body.result.user.emailVerified
       
        const photoUrl = req.body.result.user.photoURL
        

        const newCustomer = {displayName , email ,  emailVerified  ,photoUrl }

        console.log(newCustomer)

        const customer = await customerModel.findOne({email : email})

        if(!customer){
            const addCustomer = new customerModel(newCustomer)
            await addCustomer.save()
            res.status(200).json({
                success : true,
                data : addCustomer
            })
        }else{
            res.status(200).json({
                success : true,
            })
        }
        
        

        


        
        
    }

    async getAllCustomer (req , res , next) {
        res.status(200).json(
            res.advancedResults
          );
    }

    async getCustomer (req , res , next) {
        try {
            const customerId = req.params.id



        const customer = await customerModel.findById(customerId)

        console.log(customer)
        if(!customer) {
            return next(
                new ErrorResponse(`Không tồn tại customer trong hệ thống`, 400)
            )
        }

        res.status(200).json({
            success: true,
            data : customer
        })
            
        } catch (err) {
            return next(
                new ErrorResponse(`Không tồn tại customerId trong hệ thống`, 400)
            )
        }
        
    }
}

module.exports = new CustomerController()