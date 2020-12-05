const { response } = require('express');

const express = require('express'),
      app     = express(),
      firebase = require('firebase'),
      bodyParser = require('body-parser');

var firebaseConfig = {
    apiKey: "AIzaSyA8hBEqYFulFeAwyt-wNZFI26RhrwxbA7w",
    authDomain: "banking-system-3b951.firebaseapp.com",
    databaseURL: "https://banking-system-3b951.firebaseio.com",
    projectId: "banking-system-3b951",
    storageBucket: "banking-system-3b951.appspot.com",
    messagingSenderId: "733455917844",
    appId: "1:733455917844:web:3bc1cefa5c979cacf41801",
    measurementId: "G-E0MBSEQDSZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
let selected_user = undefined;

app.get('/', async (req, res) => {
    try {
        let response = [];
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        snapshot.forEach(doc => {
            let wholeuser = doc.data();
            let auser = {
                name: wholeuser.name,
                email: wholeuser.email,
                currentbal: wholeuser.currentbal,
            }
            response.push(auser);
        });
        //res.send(response);
        return res.render('homepage', { response: response });
    } catch(error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

app.get('/all', async (req,res) => {
    try {
        let response = [];
        const userRef = db.collection('users');
        const snapshot = await userRef.get();
        snapshot.forEach(doc => {
            let wholeuser = doc.data();
            let auser = {
                name: wholeuser.name
            }
            response.push(auser);
        });
        return res.status(200).render('allusers', { response: response });
    } catch(error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

app.get('/:currentuser', async (req, res) => {
    try {
        let response = [];
        current_user = req.params.currentuser;
        const userRef = db.collection('users');
        const snapshot = await userRef.get();
        snapshot.forEach(doc => {
            let wholeuser = doc.data();
            let auser = {
                name: wholeuser.name,
                email: wholeuser.email,
                currentbal: wholeuser.currentbal
            }
            if(current_user !== auser.name) {
                response.push(auser);
            }
        });
        //res.send(response);
        return res.status(200).render('transfer', {response: response, current: current_user});
    } catch(error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

app.post('/money', async (req,res) => {
    try {
        let current_user = req.body.current;
    let selected_user = req.body.select;
    let money = req.body.money;
    let bal = 0;
    let newbal = 0;
    console.log(current_user);
    console.log(selected_user);
    console.log(money);
    const userRef = db.collection('users');
    const snapshot = await userRef.get();
    function updation() {
        
        snapshot.forEach(async (doc) => {
            let theuser = doc.data();
            if(current_user == theuser.name) {
                console.log(current_user);
                console.log(theuser.name);
                newbal = parseInt(theuser.currentbal) - parseInt(money);
            }
            console.log(newbal);
            console.log('yes');
            await db.collection('users').doc('/' + current_user + '/')
            .update({
                currentbal: newbal
            })
        })
    };
    updation();

    snapshot.forEach(async (doc) => {
        let wholeuser = doc.data();
        if(selected_user == wholeuser.name) {
            bal = parseInt(wholeuser.currentbal) + parseInt(money);
            const upduser = {
                currentbal: bal
            }
            console.log(bal);
            await db.collection('users').doc('/' + selected_user + '/')
            .update(upduser);
            //console.log(current_user);
            //console.log(bal);
                }
            }
    );
    return res.status(200).redirect('/');
    } catch(error) {
        console.log(error);
        return res.status(400).send(error);
    }
});

app.listen(process.env.PORT,() => {
    console.log('server started running...')
});