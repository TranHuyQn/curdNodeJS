const path = require('path');
const express = require('express');
const hbs = require('hbs');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

const hostname = '127.0.0.1';
const port = 3000;

//Create Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'nodejs'
})

//connect to database
db.connect((err) => {
    if(err) throw err;
    console.log('Mysql connected')
})

app.set('views', path.join(__dirname,'views'));

app.set('view engine', 'hbs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', (req, res) => {
    res.render('index', {
        name: "huy"
    });
})

app.get('/post', (req, res) => {
    res.render('form');
})

app.post('/post', (req, res) => {
    res.render('index', {
        name: req.body.textname
    })
})

//create user
app.get('/users/create', (req, res) => {
    res.render('users/create');
})
app.post('/users', (req, res) => {
    let name = req.body.name;
    let data = {name: name, email: req.body.email};
    let sql = "INSERT INTO nodejs.users SET ?";
    let query = db.query(sql, data, (err, result) => {
        if(err) throw err;
        console.log('Create success');
        res.redirect('/users');
    })
})
//list user
app.get('/users', (req, res) => {
    let sql = "SELECT * FROM users";
    let query = db.query(sql, (err, users) => {
        if(err) throw err;
        res.render('users/index', {
            users: users
        })
    })
})
//delete user
app.get('/users/delete/:id', (req, res) => {
    let userId = req.params.id;
    let sql = `DELETE FROM users WHERE id = ${userId}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.redirect('/users');
    })
})
//edit user
app.get('/users/:id', (req, res) => {
    let userId = req.params.id;
    let sql = `SELECT * FROM users WHERE id = ${userId}`;
    let query = db.query(sql, (err, user) => {
        if(err) throw err;
        res.render('users/edit', {
            user: user[0]
        })
    })
})

app.post('/users/:id', (req, res) => {
    let userId = req.params.id;
    let name = req.body.name;
    let email = req.body.email;
    let sql = `UPDATE users SET name='${name}', email='${email}' WHERE id=${userId}`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log('Edit success');
        res.redirect('/users');
    })
})

app.get('/:name', (req, res) => {
    res.render('index', {
        name: req.params.name
    })
})

app.get('/home', function (req, res) {
    res.send('Welcome to Express');
})

app.get('/about', function (req, res) {
    res.send('This is about page');
})

app.listen(port, hostname, () => {
    console.log(`Server running att http://${hostname}:${port}/`);
});