// isAdmin.js
module.exports = async function (req, res, proceed) {

    if (req.session.role == 'client' || req.session.role == 'admin'  ) {
        return proceed();   //proceed to the next policy,
    }

    //--•
    // Otherwise, this request did not come from a logged-in user.
    return res.forbidden();

};