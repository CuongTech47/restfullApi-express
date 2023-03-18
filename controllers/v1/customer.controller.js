const customerModel = require("../../models/v1/customer.model");
const ErrorResponse = require("../../utils/errorResponse");
const { OAuth2Client } = require("google-auth-library");
class CustomerController {
  async login(req, res, next) {
    try {
      const id = req.body.result.user.uid;
      const displayName = req.body.result.user.displayName;
      const email = req.body.result.user.email;
      const emailVerified = req.body.result.user.emailVerified;

      const photoUrl = req.body.result.user.photoURL;

      const newCustomer = { id, displayName, email, emailVerified, photoUrl };

      const customer = await customerModel.findOne({ email});

      

      if (!customer) {
        
        const addCustomer = new customerModel(newCustomer);
        await addCustomer.save();
        const customer1 = await customerModel.findOne({ email});
        const token  = customer1.getSignedJwtToken()
        console.log(token)
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
            ),
            httpOnly: true,
        }

        res.status(200).cookie("token" , token , options).json({
            success: true,
            token,
        })
        
      }
      if(customer){
        console.log(customer)
        const token  = customer.getSignedJwtToken()
        console.log(token)
        const options = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 1000
            ),
            httpOnly: true,
        }

        res.status(200).cookie("token" , token , options).json({
            success: true,
            token
        })
      }

      
      
    } catch (error) {
      next(error);
    }

    // const CLIENT_ID = "110879865288915770407"

    // async function verifyAccessToken(accessToken) {
    //     const client = new OAuth2Client(CLIENT_ID);
    //     const ticket = await client.verifyIdToken({
    //       idToken: accessToken,
    //       audience: CLIENT_ID, // Client ID của ứng dụng Google API của bạn
    //     });
    //     const payload = ticket.getPayload();
    //     const userid = payload['sub'];
    //     console.log(userid)
    //   }

    //   verifyAccessToken(req.body.result.user.stsTokenManager.accessToken)
  }

  async getAllCustomer(req, res, next) {
    res.status(200).json(res.advancedResults);
  }

  async getCustomer(req, res, next) {
    try {
      const customerId = req.params.id;

      const customer = await customerModel.findById(customerId);

      console.log(customer);
      if (!customer) {
        return next(
          new ErrorResponse(`Không tồn tại customer trong hệ thống`, 400)
        );
      }

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (err) {
      return next(
        new ErrorResponse(`Không tồn tại customerId trong hệ thống`, 400)
      );
    }
  }
}

module.exports = new CustomerController();
