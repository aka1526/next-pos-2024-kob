const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

module.exports = {
    create: async (req, res) => {
        try {
            // check row saleTemp
            const rowSaleTemp = await prisma.saleTemp.findFirst({
                where: {
                    userId: req.body.userId,
                    tableNo: req.body.tableNo,
                    foodId: req.body.foodId
                }
            })

            if (!rowSaleTemp) {
                await prisma.saleTemp.create({
                    data: {
                        userId: req.body.userId,
                        tableNo: req.body.tableNo,
                        foodId: req.body.foodId,
                        qty: 1
                    }
                })
            } else {
                await prisma.saleTemp.update({
                    where: {
                        id: rowSaleTemp.id
                    },
                    data: {
                        qty: rowSaleTemp.qty + 1
                    }
                })
            }

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    list: async (req, res) => {
        try {
            const saleTemps = await prisma.saleTemp.findMany({
                include: {
                    SaleTempDetails: {
                        include: {
                            Food: true,
                            Taste: true,
                            FoodSize: true
                        }
                    },
                    Food: true
                },
                orderBy: {
                    id: 'desc'
                }
            })

            return res.send({ results: saleTemps })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    remove: async (req, res) => {
        try {
            await prisma.saleTempDetail.delete({
                where: {
                    id: parseInt(req.params.id)
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    removeAll: async (req, res) => {
        try {
            const saleTemp = await prisma.saleTemp.findFirst({
                where: {
                    userId: parseInt(req.body.userId),
                    tableNo: parseInt(req.body.tableNo)
                }
            })

            await prisma.saleTempDetail.deleteMany({
                where: {
                    saleTempId: saleTemp.id
                }
            })

            await prisma.saleTemp.delete({
                where: {
                    id: saleTemp.id
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    updateQty: async (req, res) => {
        try {
            await prisma.saleTemp.update({
                where: {
                    id: req.body.id
                },
                data: {
                    qty: req.body.qty
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    }
}