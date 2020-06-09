let checkAcceptHeader = function(req,res, next){
    if (!req.accepts('json')) {
        res.status(406).send({ error: 'Accept header must allow for json responses'});
    }
    else{
        next()
    }
}

module.exports = checkAcceptHeader