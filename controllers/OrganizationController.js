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
  //  create: async (req, res) => {
exports.create = async (req, res) => { 
        try {
            const oldOrganization = await prisma.organization.findMany();
            const payload = {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address,
                email: req.body.email,
                website: req.body.website,
                promptpay: req.body.promptpay,
                logo: req.body.logo,
                taxCode: req.body.taxCode
            }

            if (oldOrganization.length == 0) {
                await prisma.organization.create({
                    data: payload
                })
            } else {
                await prisma.organization.update({
                    where: { id: oldOrganization[0].id },
                    data: payload
                })
            }

            return res.send({ message: 'success' })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    };
  //  info: async (req, res) => {
exports.info = async (req, res) => { 
        try {
            const organization = await prisma.organization.findFirst();
            return res.send({ result: organization })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    };
    //upload: async (req, res) => {
exports.upload = async (req, res) => { 
        try {
            const file = req.files.file;
            const extension = file.name.split('.').pop();
            const fileName = `logo_${Date.now()}.${extension}`;

            file.mv(`./uploads/${fileName}`);

            const organization = await prisma.organization.findFirst();

            if (organization) {
                const fs = require('fs');
                fs.unlinkSync(`./uploads/${organization.logo}`);

                await prisma.organization.update({
                    where: {
                        id: organization.id
                    },
                    data: {
                        logo: fileName
                    }
                })
            }

            return res.send({ fileName: fileName })
        } catch (err) {
            return res.status(500).send({ message: err.message })
        }
    };
 
