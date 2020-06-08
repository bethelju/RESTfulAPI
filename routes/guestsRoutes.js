const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const gcont = require('../controller/guests')
const lcont = require('../controller/lodgings')
router.use(bodyParser.json());
const checkJwt = require('../config/jwt')

let checkAcceptHeader = function(req,res,next){
    if (!req.accepts('application/json')) {
        res.status(406).send({ error: 'Accept header must allow for json responses'});
    }
    else{
        next()
    }
}

/****************************************************************************************
 * Description: Endpoint for returning all lodgings currently in the database
 * Parameter: Request Protocol, Request URL Optional: Pagination Cursor
 ****************************************************************************************/
router.get('/', checkAcceptHeader, function(req, res){
    const guests = gcont.get_guests(req)
	.then( (guests) => {
        res.status(200).json(guests);
    });
});

/****************************************************************************************
 * Description: Endpoint for creating a guest in the database
 * Parameter: JSON body with 3 required parameters
 ****************************************************************************************/
router.post('/', checkAcceptHeader, function(req, res){
    if(!('f_name' in req.body) || !('l_name' in req.body) || !('diet_restrictions' in req.body)){
        res.status(400).send({"Error": "The requested property is missing attributes"});
    }
    else{
        gcont.post_guest(req.body.f_name, req.body.l_name, req.body.diet_restrictions)
        .then( key => {
            return lcont.get_lodging_by_id(key.id)
        }).then( result => {res.status(201).send(result[0])} );
    }
});

/****************************************************************************************
 * Description: Endpoint for returning a specified guest currently in the database
 * Parameter: Guest ID
 ****************************************************************************************/
router.get('/:id', checkAcceptHeader, function(req, res){
    gcont.get_guest_by_id(req.params.id)
    .then((guest) => {
        if(!guest.length){
            res.status(404).json({"Error": "No guest with this guest_id exists"})
        }
        else{
            res.status(200).json(guest[0]);
        }
    });
});

/****************************************************************************************
 * Description: Endpoint for deleting a specified guest from the database
 * Parameter: Guest ID
 ****************************************************************************************/
router.delete('/:id', function(req, res){
    gcont.get_guest_by_id(req.params.id)
    .then((guest) => {
        if(!guest.length){
            throw "No matching guest with that guest_id"
        }
        else if(guest[0].carrier){
            gcont.remove_guest_link_from_boat(guest[0].carrier.id, req.params.id)
        }
        return
    })
    .then(() => {
        return gcont.delete_guest(req.params.id)
    })
    .then(() => {res.status(204).end()})
    .catch(err => {
        res.status(404).send({"Error": err})
    })
});

/****************************************************************************************
 * Description: Endpoint for completely editing a guest
 * Parameter: Guest ID
 ****************************************************************************************/
router.put('/:id', checkAcceptHeader, function(req, res){
    if(!('l_name' in req.body) || !('f_name' in req.body) || !('diet_restrictions' in req.body)){
        res.status(400).send({"Error": "The request property is missing attributes"});
    }
    else{
        const ourGuest = gcont.get_guest_by_id(req.params.id)
        .then((guest) => {
            if(!guest.length){
                throw "No matching lodging"
            }
            return gcont.post_guest(req.body.f_name, req.body.l_name, req.body.diet_restrictions, req.params.id)
        })
        .then(result => {return gcont.get_guest_by_id(req.params.id)})
        .then(modifiedGuest => {res.status(200).send(modifiedGuest)})
        .catch(err => res.status(404).send({"Error": "No Lodging with this id"}))
    }
});

/****************************************************************************************
 * Description: Endpoint for partially editing a guest
 * Parameter: Guest ID
 ****************************************************************************************/
router.patch('/:id', checkAcceptHeader, function(req, res){
    if(!('l_name' in req.body) && !('f_name' in req.body) && !('diet_restrictions' in req.body)){
        res.status(400).send({"Error": "The request property is missing attributes"});
    }
    else{
        const ourGuest = gcont.get_guest_by_id(req.params.id)
        .then((guest) => {
            if(!guest.length){
                throw "No matching lodging"
            }
            let f_name = req.body.f_name ? req.body.f_name : guest[0].f_name
            let l_name = req.body.l_name ? req.body.l_name : guest[0].l_name
            let diet_restrictions = req.body.diet_restrictions ? req.body.diet_restrictions : guest[0].diet_restrictions
            return gcont.post_guest(f_name, l_name, diet_restrictions, req.params.id)
        })
        .then(result => {return gcont.get_guest_by_id(req.params.id)})
        .then(modifiedGuest => {res.status(200).send(modifiedGuest)})
        .catch(err => {res.status(404).send({"Error": "No Lodging with this id"})})
    }
});

router.all('/:id', function(req,res){
    res.status(405).json({"Accepted Requests" : ['GET', 'PATCH', 'PUT', 'DELETE']})
})

router.all('/', function(req,res){
    res.status(405).json({"Accepted Requests" : ['GET', 'POST']})
})

module.exports = router;