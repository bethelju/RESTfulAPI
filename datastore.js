const {Datastore} = require('@google-cloud/datastore');

function fromDataStoreGuestInLodging(id){
    item = {}
    item.id = id
    item.self = "http://localhost:8080/guests/" + id
    return item;
}

function fromDataStoreLodgingInGuest(id){
    item = {}
    item.id = id
    item.self = "http://localhost:8080/lodgings/" + id
    return item;
}

module.exports.Datastore = Datastore;
module.exports.datastore = new Datastore();
module.exports.fromDatastoreLodging = function fromDatastoreLodging(item){
    item.id = item[Datastore.KEY].id;
    if(Array.isArray(item.Guests) && item.Guests.length){
        item.Guests = item.Guests.map(fromDataStoreGuestInLodging)
    }
    item.self = "https://ourintermediateapi.wm.r.appspot.com/lodgings/" + item.id
    return item;
}
module.exports.fromDataStoreGuest = function fromDataStoreGuest(item){
    console.log("In datastore Guest")
    item.id = item[Datastore.KEY].id;
    if(item.carrier){
        item.carrier = fromDataStoreLodgingInGuest(item.carrier)
    }
    item.self = "https://ourintermediateapi.wm.r.appspot.com/guests/" + item.id
    return item;
}
module.exports.fromDataStoreGuestInLodging = fromDataStoreGuestInLodging
