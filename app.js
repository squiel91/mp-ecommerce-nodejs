var express = require('express');
const mercadopago = require ('mercadopago');

mercadopago.configure({
  access_token: 'TEST-1022381892533663-062814-528b89a3c60c6f7fdb55b20bc2188c04-234836875'
});


var port = process.env.PORT || 3000

var app = express();
 
app.set('view engine', 'ejs');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home.ejs');
});

app.get('/detail', async (req, res, next) => {
    // Crea un objeto de preferencia
    let preference = {
        items: [
            {
                title: 'Mi producto',
                unit_price: 100,
                quantity: 1,
            },
            {
                id: '1234',
                title: 'Lightweight Paper Table',
                description: 'Inspired by the classic foldable art of origami',
                category_id: 'home',
                quantity: 3,
                currency_id: 'UYU',
                unit_price: 55.41
            }
        ]
    };

    try {
        const response = await mercadopago.preferences.create(preference)
        console.log(response)
        // Este valor reemplazará el string "<%= globalId %>" en tu HTML
        const globalId = response.body.id;
        res.render('detail.ejs', { globalId, ...req.query });
    } catch(error) {
        console.log(error);
        next()
    };
    
});

app.post('/pay', function (req, res) {

    

  
    res.redirect('detail', req.query);
});

app.listen(port);