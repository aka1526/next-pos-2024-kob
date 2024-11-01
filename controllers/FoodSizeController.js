const prisma = require("../models/prismaClient");
const Joi = require("joi");
const pdfkit = require("pdfkit");
const fs = require("fs");
const dayjs = require("dayjs");
//const jwt = require('jsonwebtoken');
const donenv = require("dotenv");
donenv.config();

const UPLOADS_INV = process.env.UPLOADS_INV;
const UPLOADS_BILL = process.env.UPLOADS_BILL;

 // exports.signIn = async (req, res) => {  }  
    //create: async (req, res) => {
 exports.create = async (req, res) => { 
        try {
            await prisma.foodSize.create({
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                    moneyAdded: req.body.moneyAdded,
                    status: 'use'
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    };

 // list: async (req, res) => {
exports.list = async (req, res) => { 
        try {
            const rows = await prisma.foodSize.findMany({
                include: {
                    FoodType: true
                },
                where: {
                    status: 'use'
                },
                orderBy: {
                    id: 'desc'
                }
            })

            return res.send({ results: rows })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    };
// remove: async (req, res) => {
exports.remove = async (req, res) => { 
        try {
            await prisma.foodSize.update({
                data: {
                    status: 'delete'
                },
                where: {
                    id: parseInt(req.params.id)
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    };
//update: async (req, res) => {
exports.update = async (req, res) => { 
        try {
            await prisma.foodSize.update({
                data: {
                    foodTypeId: req.body.foodTypeId,
                    name: req.body.name,
                    remark: req.body.remark,
                    moneyAdded: req.body.moneyAdded
                },
                where: {
                    id: req.body.id
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
};