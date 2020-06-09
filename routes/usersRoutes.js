const express = require('express');
const router = express.Router();
const ucont = require('../controller/users');

/****************************************************************************************
 * Description: Endpoint for returning all users currently in the database
 * Parameters: None
 ****************************************************************************************/
router.get('/', function(req, res){
    const Users = ucont.get_users()
	.then( (users) => {
        res.status(200).json(users);
    });
});

/*****************************************************************************************
 * Description: Below route handles all non-valid HTTP verb requests to root user endpoint
 ****************************************************************************************/
router.all('/', function(req, res){
    res.status(405).json({"Accepted Requests" : ['GET']})
})

module.exports = router;