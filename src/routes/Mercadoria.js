const express = require("express");
const Router = express.Router();
const Mercadoria = require("../models/Mercadoria");
const autenticacao = require("../config/Autenticacao");
const sequelize = require("../config/database");
const { QueryTypes } = require('sequelize');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage })
const fs = require("fs")

Router.get("/", async (req, res) => {
    const mercadorias = await Mercadoria.findAll();
    res.json({ success: true, mercadorias: mercadorias })
})

Router.get("/:id/:token", async (req, res) => {
    try {
        const mercadoria = await Mercadoria.findOne({ where: { id: req.params.id } });
        if (mercadoria) {
            res.json({ sucess: true, mercadoria: mercadoria })
        } else {
            res.json({ success: false })
        }
    } catch (error) {
        res.json({ erro: error })
    }
})

Router.get("/limite", async (req, res) => {
    const mercadorias = await sequelize.query("SELECT * FROM mercadorias LIMIT 10 OFFSET " + req.query.pulos);
    res.json({mercadorias:mercadorias})
})

Router.post("/", autenticacao ,upload.single("img"), async (req, res) => {
    if (req.file) {
        const mercadoria = await Mercadoria.create({ nome: req.body.nome, precoCompra: req.body.precoCompra, precoVenda: req.body.precoVenda, nomeImg: req.file.filename });
        if (mercadoria) {
            res.json({ success: true, mercadoria: mercadoria })
        } else {
            res.json({ success: false })
        }
    } else {
        const mercadoria = await Mercadoria.create({ nome: req.body.nome, precoCompra: req.body.precoCompra, precoVenda: req.body.precoVenda });
        if (mercadoria) {
            res.json({ success: true, mercadoria: mercadoria })
        } else {
            res.json({ success: false })
        }
    }

})

Router.post("/alterarItem", upload.single("img"), async (req, res) => {
    if (req.file) {
        fs.unlink("uploads/" + req.body.nomeImg, (err) => {
            if (err) throw err;
        });
        const mercadoria = await Mercadoria.update({ nome: req.body.nome, precoCompra: req.body.precoCompra, precoVenda: req.body.precoVenda, nomeImg: req.file.filename }, { where: { id: req.body.id } })
        if (mercadoria) {
            res.json({ success: true, mercadoria: mercadoria })
        } else {
            res.json({ success: false })
        }
    } else {
        const mercadoria = await Mercadoria.update({ nome: req.body.nome, precoCompra: req.body.precoCompra, precoVenda: req.body.precoVenda, nomeImg: req.body.nomeImg }, { where: { id: req.body.id } })
        if (mercadoria) {
            res.json({ success: true, message: "Item alterado com sucesso" })
        } else {
            res.json({ success: false })
        }
    }
})

Router.delete("/:id", async (req, res) => {
    const mercadoria = await Mercadoria.findOne({ where: { id: req.params.id } });
    if (mercadoria) {
        if (mercadoria.nomeImg) {
            fs.unlink("uploads/" + mercadoria.nomeImg, (err) => {
                if (err) throw err;
            });
        }
        const deleteMercadoria = await Mercadoria.destroy({ where: { id: req.params.id } });
        if (deleteMercadoria) {
            res.json({ success: true, message: "Item deletado com successo" });
        } else {
            res.json({ success: false })
        }
    } else {
        res.json({ success: false, message: "Item nao encontrado" })
    }
})

module.exports = Router;