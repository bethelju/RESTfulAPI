const express = require('express')
const app = express()
const hbs = require('express-handlebars');

app.engine('handlebars', hbs());
app.set('view engine', 'handlebars')

app.use('/', require('./routes/index'));

app.use(function(req, res, next){
    res.status(404);
    res.format({
        html: function () {
          res.render('404', { url: req.url })
        },
        json: function () {
          res.json({ error: 'Not found' })
        },
        default: function () {
          res.type('txt').send('Not found')
        }
      })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Now listening on ${PORT}`)
})