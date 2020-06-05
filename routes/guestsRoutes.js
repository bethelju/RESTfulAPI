const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const gcont = require('../controller/guests')
const lcont = require('../controller/lodgings')
router.use(bodyParser.json());

/****************************************************************************************
 * Description: Endpoint for returning all lodgings currently in the database
 * Parameter: Request Protocol, Request URL Optional: Pagination Cursor
 ****************************************************************************************/
router.get('/', function(req, res){
    const guests = gcont.get_guests(req)
	.then( (guests) => {
        res.status(200).json(guests);
    });
});

/****************************************************************************************
 * Description: Endpoint for creating a guest in the database
 * Parameter: JSON body with 3 required parameters
 ****************************************************************************************/
router.post('/', function(req, res){
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
router.get('/:id', function(req, res){
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

module.exports = router;