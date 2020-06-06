const GUEST = "Guest";
const LODGING = "Lodging";
const ds = require('../datastore');

const datastore = ds.datastore;

/****************************************************************************************
 * Name: remove_lodging_link_from_guest
 * Description: For a specified guest, remove a specified lodging from carrier field
 * Parameters: Guest ID, Lodging ID
 ****************************************************************************************/
let remove_lodging_link_from_guest = function(lid, gid){
    const key = datastore.key([GUEST, parseInt(gid, 10)]);
    const q = datastore.createQuery(GUEST).filter('__key__', '=', key);
    return datastore.runQuery(q).then( (entities) => {
        if(entities[0][0].carrier != null && entities[0][0].carrier == lid){
            entities[0][0].carrier = null
            return datastore.save({"key":key, "data":entities[0][0]});
        }
        else{
            return
        }
    })
}

/****************************************************************************************
 * Name: get_guest_by_id
 * Description: Get a guest from datastore by their ID and return specified guest
 * Parameter: Guest ID
 ****************************************************************************************/
let get_guest_by_id = function(id){
    const key = datastore.key([GUEST, parseInt(id, 10)]);
    const q = datastore.createQuery(GUEST).filter('__key__', '=', key);
    return datastore.runQuery(q).then( (entities) => {
        return entities[0].map(ds.fromDataStoreGuest)
    });
}

/****************************************************************************************
 * Name: put_guest
 * Description: Puts a guest in a specified lodging and returns the key for the guest
 * Parameter: Lodging ID, Guest ID
 ****************************************************************************************/
let put_guest = function(lid, gid){
    console.log("2.1")
    const l_key = datastore.key([LODGING, parseInt(lid,10)]);
    const g_key = datastore.key([GUEST, parseInt(gid,10)]);
    return datastore.get(l_key)
    .then( (lodging) => {
        console.log("2.2")
        lodging[0].guests.push(gid);
        return datastore.save({"key":l_key, "data":lodging[0]});
    })
    .then(() => {
        console.log("2.3")
        return datastore.get(g_key)
    })
    .then((guest) => {
        console.log("2.4")
        guest[0].carrier = lid
        return datastore.save({"key":g_key, "data":guest[0]});
    })
}

/****************************************************************************************
 * Name: post_guest
 * Description: Posts a new guest to the database
 * Parameter: Lodging ID, Guest ID
 ****************************************************************************************/
let post_guest = function(f_name, l_name, dietary_restrictions, id=null){
    let key;
    if(id){
        key = datastore.key([GUEST, parseInt(id,10)]);
    }
    else{
        key = datastore.key(GUEST);
    }
    const new_guest = {"f_name": f_name, "l_name": l_name, "dietary_restrictions": dietary_restrictions,
        "carrier": null};
	return datastore.save({"key":key, "data":new_guest}).then(() => {return key});
}

/****************************************************************************************
 * Name: delete_guest
 * Description: Deletes a guest from the database
 * Parameter: Guest ID
 ****************************************************************************************/
let delete_guest = function(id){
    const key = datastore.key([GUEST, parseInt(id,10)]);
    return datastore.delete(key);
}

/****************************************************************************************
 * Name: get_guests
 * Description: Gets all guests from the database and returns with pagination
 * Parameter: Request
 ****************************************************************************************/
let get_guests = function(req){
    var q = datastore.createQuery(GUEST).limit(3);
    const results = {};
    var prev;
    if(Object.keys(req.query).includes("cursor")){
        prev = req.protocol + "://" + req.get("host") + req.baseUrl + "?cursor=" + req.query.cursor;
        q = q.start(req.query.cursor);
    }
	return datastore.runQuery(q).then( (entities) => {
            console.log(entities[0])
            results.results = entities[0].map(ds.fromDataStoreGuest);
            if(typeof prev !== 'undefined'){
                results.previous = prev;
            }
            if(entities[1].moreResults !== ds.Datastore.NO_MORE_RESULTS ){
                results.next = req.protocol + "://" + req.get("host") + req.baseUrl + "?cursor=" + entities[1].endCursor;
            }
			return results;
		});
}

module.exports = {
    remove_lodging_link_from_guest: remove_lodging_link_from_guest,
    get_guest_by_id: get_guest_by_id,
    put_guest: put_guest,
    post_guest: post_guest,
    delete_guest: delete_guest,
    get_guests: get_guests
}