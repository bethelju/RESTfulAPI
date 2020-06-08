require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const url = require('url');
const request = require('request');
const jwtDecode = require('jwt-decode');

router.get('/', function(req, res){
    res.render('home')
})

router.get('/authenticate', (req, res) => {
    let responseType = "response_type=code&"
    let clientID = `client_id=${process.env.CLIENT_ID}&`
    let redirect_uri = `redirect_uri=${process.env.REDIRECT_URI}&`
    let ourSecret = Math.random().toString(36).slice(2)
    let secret = "state=" + ourSecret + "&"
    let scope = "scope=profile&"
    res.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + responseType + clientID + redirect_uri + secret + scope)
})

router.get('/oauth', (req, response) => {
    const queryObject = url.parse(req.url,true).query;
    if("error" in queryObject){
        res.send("There was an error!")
    }
    request({
        url : "https://oauth2.googleapis.com/token",
        method : "POST",
        form : {
            "client_id" : process.env.CLIENT_ID,
            "code" : queryObject.code,
            "grant_type" : "authorization_code",
            "redirect_uri": process.env.REDIRECT_URI,
            "client_secret": process.env.CLIENT_SECRET
        }
    },function(err,res,body){
        console.log(JSON.parse(body))
        let id_token = JSON.parse(body).id_token
        console.log(jwtDecode(id_token))
        response.render('hello', {id_token: id_token})
    });  
})

module.exports = router;