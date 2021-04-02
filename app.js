const path = require('path');
const mongoose = require('mongoose');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('6066f14088c5890920ae89d5')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
.connect('mongodb+srv://magdalena_a:test123@cluster0.iamgj.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    User.findOne()
    .then(user => {
        if(!user) {
            const user = new User({
                name: 'Magda',
                email: 'magda@magda.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    });
    app.listen(3000);
    console.log('Connected to database!');
})
.catch(err => {
    console.log(err);
});
