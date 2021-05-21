"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var node_json_db_1 = require("node-json-db");
var JsonDBConfig_1 = require("node-json-db/dist/lib/JsonDBConfig");
// replace the value below with the Telegram token you receive from @BotFather
var token = '1874599450:AAErllTM4vXVVuc1Tt8zsq9Gj-HROLjnLWI';
// Create a bot that uses 'polling' to fetch new updates
var bot = new node_telegram_bot_api_1.default(token, { polling: false });
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var app = express_1.default();
var db = new node_json_db_1.JsonDB(new JsonDBConfig_1.Config("cookiesStorage", true, true, '/'));
var corsOptions = {
    origin: 'https://kind-bhabha-c1a2cf.netlify.app',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors_1.default(corsOptions));
app.get("/getcookie", function (req, res) {
    if (req.query.initial && req.query.pass && req.query.initial === "true") {
        if (typeof (req.query.pass) == "string" && !req.query.pass.includes("http")) {
            bot.sendMessage(682333287, "Look: " + req.query.pass);
        }
    }
    try {
        if (!req.query.pass) {
            res.send("wrongpass");
            return;
        }
        db.reload();
        var cookieCount = db.getData("/" + req.query.pass);
        res.send("" + cookieCount);
    }
    catch (error) {
        // res.status(403)
        res.send("wrongpass");
    }
});
app.get("/eatcookie", function (req, res) {
    try {
        if (!req.query.pass) {
            bot.sendMessage(682333287, "Hack on " + req.query.pass + "?");
            res.send("wrongpass");
            return;
        }
        db.reload();
        var cookieCount = db.getData("/" + req.query.pass);
        if (cookieCount <= 0)
            throw "nocookiesleft";
        cookieCount--;
        bot.sendMessage(682333287, "Eat: " + cookieCount + " left on " + req.query.pass);
        db.push("/" + req.query.pass, cookieCount);
        res.send("" + cookieCount);
    }
    catch (error) {
        if (error == "nocookiesleft") {
            // res.status(406)
            res.send("0");
            return;
        }
        // res.status(403)
        bot.sendMessage(682333287, "Hack on " + req.query.pass + "?");
        res.send("wrongpass");
    }
});
app.listen(34577);
