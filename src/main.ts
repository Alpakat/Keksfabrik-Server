import TelegramBot from 'node-telegram-bot-api'

import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'


const token = ''; //API Token

const bot = new TelegramBot(token, { polling: false });

import cors from "cors"

import express from "express"
const app = express();

const db = new JsonDB(new Config("cookiesStorage", true, true, '/'));

const corsOptions = {
    origin: 'https://kind-bhabha-c1a2cf.netlify.app',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.get("/getcookie", (req, res) => {

    if (req.query.initial && req.query.pass && req.query.initial === "true") {
        if (typeof(req.query.pass) == "string" && !req.query.pass.includes("http")) {
            bot.sendMessage(/* chatid */0, `Look: ${req.query.pass}`);
        }
    }

    try {
        if (!req.query.pass) {
            res.send(`wrongpass`)
            return
        }

        db.reload()
        const cookieCount = db.getData(`/${req.query.pass}`)
        res.send(`${cookieCount}`)
    } catch (error) {
        // res.status(403)
        res.send("wrongpass")
    }
})

app.get("/eatcookie", (req, res) => {

    try {
        if (!req.query.pass) {
            bot.sendMessage(/* chatid */0, `Hack on ${req.query.pass}?`);
            res.send(`wrongpass`)
            return
        }

        db.reload()
        let cookieCount = db.getData(`/${req.query.pass}`)

        if (cookieCount <= 0) throw "nocookiesleft";

        cookieCount--

        bot.sendMessage(/* chatid */0, `Eat: ${cookieCount} left on ${req.query.pass}`);

        db.push(`/${req.query.pass}`, cookieCount)

        res.send(`${cookieCount}`)
    } catch (error) {
        if (error == "nocookiesleft") {
            // res.status(406)
            res.send("0")
            return
        }
        // res.status(403)
        bot.sendMessage(/* chatid */0, `Hack on ${req.query.pass}?`);
        res.send("wrongpass")
    }
})

app.listen(34577)