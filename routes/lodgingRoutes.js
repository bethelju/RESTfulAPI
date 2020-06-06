const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const lcont = require('../controller/lodgings')
const gcont = require('../controller/guests')
const checkJwt = require('../config/jwt')

router.use(bodyParser.json());

/****************************************************************************************
 * Description: Endpoint creates a particular lodging in the database
 * Parameter: JSON req body containing specifications for name, type, size of lodging
 ****************************************************************************************/
router.post('/', function(req, res){
    if(!('name' in req.body) || !('type' in req.body) || !('size' in req.body)){
        res.status(400).send({"Error": "The requested property is missing attributes"});
    }
    else{
        lcont.post_lodging(req.body.name, req.body.type, req.body.size)
        .then( key => {
            return lcont.get_lodging_by_id(key.id)
        }).then( result => {res.status(201).send(result[0])} );
    }
});

/****************************************************************************************
 * Description: Returns all the guests stored at a specified lodging
 * Parameter: Lodging ID
 ****************************************************************************************/
router.get('/:id/guests', function(req, res){
    lcont.get_lodging_by_id(req.params.id)
    .then( result => {
        if(!result.length){
            throw "No matching lodging"
        }
        else{
            return lcont.get_lodging_guests(req, req.params.id)
        }
    })
	.then( (guests) => {
        res.status(200).json(guests);
    })
    .catch(err => {
        console.log(err)
        res.status(404).send({"Error": "No lodging with this lodging_id exists"})
    })
});

/****************************************************************************************
 * Description: Endpoint for returning a specified lodging from the database
 * Parameter: Lodging ID
 ****************************************************************************************/
router.get('/:id', function(req, res){
    lcont.get_lodging_by_id(req.params.id)
    .then((lodging) => {
        if(!lodging.length){
            res.status(404).json({"Error": "No lodging with this lodging_id exists"})
        }
        else{
            res.status(200).json(lodging[0]);
        }
    });
});

/****************************************************************************************
 * Description: Endpoint for deleting a specified guest from a specified lodging
 * Parameter: Lodging ID
 ****************************************************************************************/
router.delete('/:lid/guests/:gid', function(req, res){
    lcont.get_lodging_by_id(req.params.lid)
    .then((lodging) => {
        if(!lodging.length){
            throw "No matching lodging/guest"
        }
        else{
            return gcont.get_guest_by_id(req.params.gid)
        }
    })
    .then((guest) => {
        if(!guest.length){
            throw "No matching lodging/guest"
        }
        else{
            return gcont.remove_lodging_link_from_guest(req.params.lid, req.params.gid)
        }
    })
    .then(() => {
        return lcont.remove_guest_link_from_lodging(req.params.lid, req.params.gid)
    })
    .then(() => {
        res.status(204).end();
    })
    .catch(err => {
        res.status(404).send({"Error": err})
    })
});

/****************************************************************************************
 * Description: Endpoint for placing a guest in a particular lodging in the database
 * Parameter: Lodging ID, Guest ID
 ****************************************************************************************/
router.put('/:lid/guests/:gid', function(req, res){
    lcont.get_lodging_by_id(req.params.lid)
    .then((lodging) => {
        console.log("1")
        if(!lodging.length){
            throw "No matching guest with that guest_id or lodging with that lodging_id"
        }
        else{
            return gcont.get_guest_by_id(req.params.gid)
        }
    })
    .then((guest) => {
        console.log("2")
        if(!guest.length){
            throw "No matching guest with that guest_id or lodging with that lodging_id"
        }
        else if(guest[0].carrier != null){
            throw "This guest is already assigned"
        }
        else{
            console.log("Here!")
            return gcont.put_guest(req.params.lid, req.params.gid)
        }
    })
    .then(key => {console.log("3");res.status(204).end()})
    .catch((err) => {
        if(err === "No matching guest with that guest_id or lodging with that lodging_id"){
            res.status(404).send({"Error": "The specified guest and/or lodging don’t exist"})
        }
        if(err === "This guest is already assigned"){
            res.status(403).send({"Error": "This guest is already assigned"})
        }
    })
});

/****************************************************************************************
 * Description: Endpoint for returning all lodgings currently in the database
 * Parameter: Lodging ID
 ****************************************************************************************/
router.get('/', function(req, res){
    const Lodgings = lcont.get_lodgings(req)
	.then( (lodgings) => {
        res.status(200).json(lodgings);
    });
});

/****************************************************************************************
 * Description: Endpoint for completely editing a lodging
 * Parameter: Lodging ID
 ****************************************************************************************/
router.put('/:id', function(req, res){
    if(!('name' in req.body) || !('type' in req.body) || !('size' in req.body)){
        res.status(400).send({"Error": "The request property is missing attributes"});
    }
    else{
        const ourLodging = lcont.get_lodging_by_id(req.params.id)
        .then((lodging) => {
            if(!lodging.length){
                throw "No matching lodging"
            }
            return lcont.post_lodging(req.body.name, req.body.type, req.body.length, req.params.id)
        })
        .then(result => {return lcont.get_lodging_by_id(req.params.id)})
        .then(modifiedLodging => {res.status(200).send(modifiedLodging)})
        .catch(err => res.status(404).send({"Error": "No Lodging with this id"}))
    }
});

/****************************************************************************************
 * Description: Endpoint for partially editing a lodging
 * Parameter: Lodging ID
 ****************************************************************************************/
router.patch('/:id', function(req, res){
    if(!('name' in req.body) && !('type' in req.body) & !('size' in req.body)){
        res.status(400).send({"Error": "The request property must have at least one attribute"});
    }
    else{
        const ourlodging = lcont.get_lodging_by_id(req.params.id)
        .then((lodging) => {
            if(!lodging.length){
                throw "No matching lodging"
            }
            let name = req.body.name ? req.body.name : lodging[0].name
            let type = req.body.type ? req.body.type : lodging[0].type
            let length = req.body.length ? req.body.length : lodging[0].length
            return lcont.post_lodging(name, type, length, req.params.id)
        })
        .then(result => {return lcont.get_lodging_by_id(req.params.id)})
        .then(modifiedLodging => {res.status(200).send(modifiedLodging)})
        .catch(err => res.status(404).send({"Error": "No Lodging with this id"}))
    }
});

/****************************************************************************************
 * Description: Endpoint for deleting a specified lodging from the database
 * Parameter: Lodging ID
 ****************************************************************************************/
router.delete('/:id', function(req, res){
    lcont.get_lodging_by_id(req.params.id)
    .then(lodging => {
        if(!lodging.length){
            throw "No matching lodging"
        }
        else {
            return lcont.remove_lodging_links_from_lodging(req.params.id)
        }
    })
    .then(() => {
        return lcont.delete_lodging(req.params.id)
    })
    .then(() => {res.status(204).end()})
    .catch((err) => {
        console.log(err)
        res.status(404).json({"Error": "No matching Lodging with that Lodging_id"})
    })
});

module.exports = router;