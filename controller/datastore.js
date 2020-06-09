const {Datastore} = require('@google-cloud/datastore');
require('dotenv').config();

function fromDataStoreLodgingInGuest(id){
    item = {}
    item.id = id
    item.self = `${process.env.ROOT_URL}` + "lodgings/" + id
    return item;
}

let fromDataStoreGuestInLodging = function fromDataStoreGuestInLodging(id){
    item = {}
    item.id = id
    item.self = `${process.env.ROOT_URL}` + "guests/" + id
    return item;
}

let fromDatastoreLodging = function fromDatastoreLodging(item){
    item.id = item[Datastore.KEY].id;
    if(Array.isArray(item.Guests) && item.Guests.length){
        item.Guests = item.Guests.map(fromDataStoreGuestInLodging)
    }
    item.self = `${process.env.ROOT_URL}` + "lodgings/" + item.id
    return item;
}

let fromDatastoreUser = function fromDatastoreUser(item){
    item.id = item[Datastore.KEY].id;
    return item;
}

let fromDataStoreGuest = function fromDataStoreGuest(item){
    item.id = item[Datastore.KEY].id;
    if(item.carrier){
        item.carrier = fromDataStoreLodgingInGuest(item.carrier)
    }
    item.self = `${process.env.ROOT_URL}` + "guests/" + item.id
    return item;
}
let getUserKey = function getUserKey(item){
    console.log(item)
    return item[Datastore.KEY].id
}

module.exports = {
    Datastore: Datastore,
    datastore: new Datastore(),
    fromDatastoreLodging: fromDatastoreLodging,
    fromDatastoreUser: fromDatastoreUser,
    fromDataStoreGuest: fromDataStoreGuest,
    getUserKey: getUserKey,
    fromDataStoreGuestInLodging: fromDataStoreGuestInLodging
}
