const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors")
require('dotenv').config()
require("../models/Associations");

app.use(cors());
app.use(express.static("uploads"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const adminRoutes = require("../routes/Admin");
const mercadoriasRoutes = require("../routes/Mercadoria");
const notasRoutes = require("../routes/Nota");
const vendasRoutes = require("../routes/Venda");

app.use("/admin",adminRoutes);
app.use("/mercadoria",mercadoriasRoutes);
app.use("/notas",notasRoutes)
app.use("/vendas",vendasRoutes)

app.listen(process.env.PORT || 3000);