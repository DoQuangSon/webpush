require('dotenv').config({ path: 'variables.env' });
const express = require('express')
const cors = require('cors')
const webPush = require('web-push');
const bodyParser = require('body-parser');
const app = express()
// const consola = require('consola')

import consola from 'consola'

app.use(cors())

app.use(bodyParser.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails('mailto:test@example.com', publicVapidKey, privateVapidKey);

app.get("/api", (req, res) => {
    res.json("testttttttttttttttt")
})
app.post('/subscribe', (req, res) => {
    const subscription = req.body
    consola.info("subscription", subscription)

    res.status(201).json({});

    // create payload
    const payload = JSON.stringify({
        title: 'Tesssssssssssssssssssssssst',
    });

    consola.info("subscription", subscription)
    consola.info("payload", payload)

    webPush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
});


module.exports = {
    path: '/api',
    handler: app
}