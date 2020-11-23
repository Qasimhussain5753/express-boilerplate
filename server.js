const express = require('express')
const admin = require("firebase-admin");
const app = express()
const path = require('path')
const PORT = 5000;

const serviceAccount = require("./google-services.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

//load routes
const Auth = require('./routes/Auth')
const Location = require("./routes/locationRoute");
//middlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use((req, res, next)=> {
    req.db = db
})

app.use('/auth/', Auth)
app.use('/location/', Location);
//listen server
const server = app.listen(process.env.PORT || PORT, (err) => {
    if (!err) console.log(`server listening at PORT ${process.env.PORT || PORT}`)
    else console.log(err)
})
