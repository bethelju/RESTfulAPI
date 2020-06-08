const {Datastore} = require('@google-cloud/datastore');
require('dotenv').config();

function fromDataStoreGuestInLodging(id){
    item = {}
    item.id = id
    item.self = `${process.env.ROOT_URL}` + "guests/" + id
    return item;
}

function fromDataStoreLodgingInGuest(id){
    item = {}
    item.id = id
    item.self = `${process.env.ROOT_URL}` + "lodgings/" + id
    return item;
}

module.exports.Datastore = Datastore;
module.exports.datastore = new Datastore();
module.exports.fromDatastoreLodging = function fromDatastoreLodging(item){
    item.id = item[Datastore.KEY].id;
    if(Array.isArray(item.Guests) && item.Guests.length){
        item.Guests = item.Guests.map(fromDataStoreGuestInLodging)
    }
    item.self = `${process.env.ROOT_URL}` + "lodgings/" + item.id
    return item;
}

module.exports.fromDatastoreUser = function fromDatastoreUser(item){
    item.id = item[Datastore.KEY].id;
    return item;
}

module.exports.fromDataStoreGuest = function fromDataStoreGuest(item){
    item.id = item[Datastore.KEY].id;
    if(item.carrier){
        item.carrier = fromDataStoreLodgingInGuest(item.carrier)
    }
    item.self = `${process.env.ROOT_URL}` + "guests/" + item.id
    return item;
}
module.exports.fromDataStoreGuestInLodging = fromDataStoreGuestInLodging
