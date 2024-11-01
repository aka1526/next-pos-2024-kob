const prisma = require("../models/prismaClient");
const Joi = require("joi");
const pdfkit = require("pdfkit");
const fs = require("fs");
const dayjs = require("dayjs");
const jwt = require('jsonwebtoken');
const donenv = require("dotenv");
donenv.config();

const UPLOADS_INV = process.env.UPLOADS_INV;
const UPLOADS_BILL = process.env.UPLOADS_BILL;

exports.signIn = async (req, res) => {    
    try {
        const u = req.body.username;
        const p = req.body.password;

        const user = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                level: true
            },
            where: {
                username: u,
                password: p,
                status: 'use'
            }
        })

        if (user != null) {
            const key = process.env.SECRET_KEY;
            const token = jwt.sign(user, key, { expiresIn: '30d' });

            return res.send({ token: token, name: user.name, id: user.id });
        } else {
            return res.status(401).send();
        }
    } catch (e) {
    return res.status(500).send({ error: e.message,user :"" });
    }
};

exports.create = async (req, res) => {      
    try {
        await prisma.user.create({
            data: {
                name: req.body.name,
                username: req.body.username,
                password: req.body.password,
                level: req.body.level
            }
        });

        return res.send({ message: 'success' });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};

//list: async (req, res) => {
exports.list = async (req, res) => { 
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                level: true
            },
            where: {
                status: 'use'
            },
            orderBy: {
                id: 'asc'
            }
        });

        return res.send({ results: users });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};

//update: async (req, res) => {
exports.update = async (req, res) => {     
    try {
        await prisma.user.update({
            where: {
                id: req.body.id
            },
            data: {
                name: req.body.name,
                username: req.body.username,
                level: req.body.level
            }
        });

        return res.send({ message: 'success' });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};
//remove: async (req, res) => {
exports.remove = async (req, res) => {      
    try {
        await prisma.user.update({
            where: {
                id: parseInt(req.params.id)
            },
            data: {
                status: 'delete'
            }
        });

        return res.send({ message: 'success' });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};

//getLevelByToken: async (req, res) => {
exports.getLevelByToken = async (req, res) => {      
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, process.env.SECRET_KEY);

        return res.send({ level: user.level });
    } catch (e) {
        return res.status(500).send({ error: e.message });
    }
};
