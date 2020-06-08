const ds = require('../datastore');
const USER = "User";
const datastore = ds.datastore;

/****************************************************************************************
 * Name: post_user
 * Description: Posts a new user to the database
 * Parameters: Lodging ID, Guest ID
 ****************************************************************************************/
let post_user = function(token_sub){
    key = datastore.key(USER);
    const new_user = {"sub": token_sub}
    return datastore.save({"key":key, "data": new_user})
}

/****************************************************************************************
 * Name: get_user
 * Description: Gets all users in the database
 * Parameters: None
 ****************************************************************************************/
let get_users = function(){
    const q = datastore.createQuery(USER)
    return datastore.runQuery(q).then(entities => {
        return entities[0].map((item) => {return ds.fromDatastoreUser(item)})
    })
}

/****************************************************************************************
 * Name: get_user_by_sub
 * Description: Posts a new user to the database
 * Parameters: User token sub
 ****************************************************************************************/
let get_user_by_sub = function(token_sub){
    const q = datastore.createQuery(USER).filter('sub', '=', token_sub)
    return datastore.runQuery(q)
}

module.exports = {
    post_user: post_user,
    get_users: get_users,
    get_user_by_sub: get_user_by_sub
}