const LODGING = "Lodging";
const GUEST = "Guest";
const ds = require('../datastore');
const gcont = require('../controller/guests')
const datastore = ds.datastore;


/****************************************************************************************
 * Name: post_lodging
 * Description: Put a lodging in the database or update an existing one and return the key
 * Parameter: Lodging name, type, size
 ****************************************************************************************/
let post_lodging = function(name, type, size, id = null){
    let key;
    if(id){
        key = datastore.key([LODGING, parseInt(id,10)]);
    }
    else{
        key = datastore.key(LODGING);
    }
	const new_lodging = {"name": name, "type": type, "size": size, "guests": []};
    return datastore.save({"key":key, "data":new_lodging})
    .then(() => {return key});
}

/****************************************************************************************
 * Name: get_lodgings
 * Description: Gets all lodgings currently in the database 
 * Parameter: Guest ID
 ****************************************************************************************/
let get_lodgings = function(req){
    var q = datastore.createQuery(LODGING).limit(5);
    const results = {};
    if(Object.keys(req.query).includes("cursor")){
        q = q.start(req.query.cursor);
    }
	return datastore.runQuery(q).then( (entities) => {
            results.results = entities[0].map(ds.fromDatastoreLodging);    
            if(entities[1].moreResults !== ds.Datastore.NO_MORE_RESULTS ){
                results.next = req.protocol + "://" + req.get("host")
                results.next += req.baseUrl + "?cursor=" + entities[1].endCursor;
            }
			return results;
		});
}

/****************************************************************************************
 * Name: delete_lodging
 * Description: Deletes a specific lodging from the database
 * Parameter: Lodging ID
 ****************************************************************************************/
let delete_lodging = function(id){
    const key = datastore.key([LODGING, parseInt(id,10)]);
    return datastore.delete(key);
}

/****************************************************************************************
 * Name: get_lodging_by_id
 * Description: Gets the specified lodging from the database and returns to the user
 * Parameter: Lodging ID
 ****************************************************************************************/
let get_lodging_by_id = function(id){
    const key = datastore.key([LODGING, parseInt(id, 10)]);
    const q = datastore.createQuery(LODGING).filter('__key__', '=', key);
    return datastore.runQuery(q).then( (entities) => {
        return entities[0].map(ds.fromDatastoreLodging);
    });
}

/****************************************************************************************
 * Name: remove_lodging_links_from_lodging
 * Description: Removes the links from a particular lodging 
 * Parameter: Lodging ID
 ****************************************************************************************/
let remove_lodging_links_from_lodging = function(lid){
    const key = datastore.key([LODGING, parseInt(lid, 10)]);
    const q = datastore.createQuery(LODGING).filter('__key__', '=', key);
    return datastore.runQuery(q).then( (entities) => {
       entities[0][0].guests.forEach(guest => {
           gcont.remove_lodging_link_from_guest(lid, guest)
       })
    })
}

/****************************************************************************************
 * Name: remove_guest_link_from_lodging
 * Description: Removes the specified guest from the specified lodging
 * Parameter: Lodging ID, Guest ID
 ****************************************************************************************/
let remove_guest_link_from_lodging = function(lid, gid){
    const key = datastore.key([LODGING, parseInt(lid, 10)]);
    const q = datastore.createQuery(LODGING).filter('__key__', '=', key);
    return datastore.runQuery(q).then( (entities) => {
        let index = -1;
        let guestArray = entities[0][0].guests
        for(let i = 0; i < guestArray.length; i++){
            if (guestArray[i].id = gid) index = i
        }
        if(index > -1){
            guestArray.splice(index, 1)
        }
        entities[0][0].guests = guestArray;
        return datastore.save({"key":key, "data":entities[0][0]});
    })
}

/****************************************************************************************
 * Name: get_lodging_guests
 * Description: Removes the links from a particular lodging 
 * Parameter: request, LodgingID
 ****************************************************************************************/
let get_lodging_guests = function (req, lid){
    const key = datastore.key([LODGING, parseInt(lid,10)]);
    return datastore.get(key)
    .then( (lodgings) => {
        const Lodging = lodgings[0];
        if(Lodging.guests.length){
            const guest_keys = Lodging.guests.map( (g_id) => {
                return datastore.key([GUEST, parseInt(g_id,10)]);
            });
            return datastore.get(guest_keys);
        }
        else{
            return []
        }
    })
    .then(guests => {
        if(guests.length){
            return guests[0].map((item) => {return ds.fromDataStoreGuest(item)});
        }
        else{
            return []
        }
    });
}

module.exports = {
    get_lodging_guests: get_lodging_guests,
    remove_guest_link_from_lodging: remove_guest_link_from_lodging,
    remove_lodging_links_from_lodging: remove_lodging_links_from_lodging,
    get_lodging_by_id: get_lodging_by_id,
    delete_lodging: delete_lodging,
    get_lodgings: get_lodgings,
    post_lodging: post_lodging
}