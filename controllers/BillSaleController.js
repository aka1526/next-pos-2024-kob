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

 // exports.signIn = async (req, res) => {   

 
//    list: async (req, res) => {
    exports.list = async (req, res) => {   
        try {
            const startDate = dayjs(req.body.startDate).set('hour', 0).set('minute', 0).set('second', 0).toDate();
            const endDate = dayjs(req.body.endDate).set('hour', 23).set('minute', 59).set('second', 59).toDate();

            const billSale = await prisma.billSale.findMany({
                where: {
                    payDate: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: 'use'
                },
                include: {
                    BillSaleDetails: {
                        include: {
                            Food: true,
                            FoodSize: true,
                            Taste: true
                        }
                    },
                    User: true
                },
                orderBy: {
                    id: 'desc'
                }
            });

            res.json({ results: billSale });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

//    remove: async (req, res) => {
    exports.remove = async (req, res) => {          
        try {
            await prisma.billSale.update({
                where: {
                    id: parseInt(req.params.id)
                },
                data: {
                    status: 'delete'
                }
            });

            res.json({ message: 'success' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
 