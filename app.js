const express = require('express')
const app = express()
const hbs = require('express-handlebars');

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars')

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Now listening on ${PORT}`)
})