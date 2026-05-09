const express = require("express");//recebe json
const cors = require("cors");//permite conversar com front
const db = require("./database");
const app = express();
app.use(cors());
app.use(express.json());

app.post("/produtos", (req, res) => {

});