const express = require('express')
const app = express()

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Now listening on ${PORT}`)
})