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
                },
                include: {
                    SaleTempDetails: true
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
                if (rowSaleTemp.SaleTempDetails.length === 0) {
                    await prisma.saleTemp.update({
                        where: {
                            id: rowSaleTemp.id
                        },
                        data: {
                            qty: rowSaleTemp.qty + 1
                        }
                    })
                }
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
            const saleTempId = parseInt(req.params.id);

            await prisma.saleTempDetail.deleteMany({
                where: {
                    saleTempId: saleTempId
                }
            })

            await prisma.saleTemp.delete({
                where: {
                    id: saleTempId
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    removeAll: async (req, res) => {
        try {
            const saleTemp = await prisma.saleTemp.findMany({
                where: {
                    userId: req.body.userId,
                    tableNo: req.body.tableNo
                }
            })

            for (let i = 0; i < saleTemp.length; i++) {
                const item = saleTemp[i]
                await prisma.saleTempDetail.deleteMany({
                    where: {
                        saleTempId: item.id
                    }
                })
            }

            await prisma.saleTemp.deleteMany({
                where: {
                    userId: req.body.userId,
                    tableNo: req.body.tableNo
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
    },
    generateSaleTempDetail: async (req, res) => {
        try {
            const saleTemp = await prisma.saleTemp.findFirst({
                where: {
                    id: req.body.saleTempId
                },
                include: {
                    SaleTempDetails: true
                }
            })

            // if saleTempDetails is empty then generate saleTempDetail
            if (saleTemp.SaleTempDetails.length === 0) {
                for (let i = 0; i < saleTemp.qty; i++) {
                    await prisma.saleTempDetail.create({
                        data: {
                            saleTempId: saleTemp.id,
                            foodId: saleTemp.foodId,
                        }
                    })
                }
            }

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    info: async (req, res) => {
        try {
            const saleTemp = await prisma.saleTemp.findFirst({
                where: {
                    id: parseInt(req.params.id)
                },
                include: {
                    Food: {
                        include: {
                            FoodType: {
                                include: {
                                    Tastes: {
                                        where: {
                                            status: 'use'
                                        }
                                    },
                                    FoodSizes: {
                                        where: {
                                            status: 'use'
                                        },
                                        orderBy: {
                                            moneyAdded: 'asc'
                                        }
                                    }
                                }
                            }
                        }
                    },
                    SaleTempDetails: {
                        include: {
                            Food: true,
                            FoodSize: true,
                        },
                        orderBy: {
                            id: 'asc'
                        }
                    }
                }
            })

            return res.send({ results: saleTemp })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    selectTaste: async (req, res) => {
        try {
            await prisma.saleTempDetail.update({
                where: {
                    id: req.body.saleTempDetailId
                },
                data: {
                    tasteId: req.body.tasteId
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    unselectTaste: async (req, res) => {
        try {
            await prisma.saleTempDetail.update({
                where: {
                    id: req.body.saleTempDetailId
                },
                data: {
                    tasteId: null
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    selectSize: async (req, res) => {
        try {
            await prisma.saleTempDetail.update({
                where: {
                    id: req.body.saleTempDetailId
                },
                data: {
                    foodSizeId: req.body.sizeId
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    unselectSize: async (req, res) => {
        try {
            await prisma.saleTempDetail.update({
                where: {
                    id: req.body.saleTempDetailId
                },
                data: {
                    foodSizeId: null
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    createSaleTempDetail: async (req, res) => {
        try {
            const saleTempId = req.body.saleTempId

            const saleTempDetail = await prisma.saleTempDetail.findFirst({
                where: {
                    saleTempId: saleTempId
                }
            })

            await prisma.saleTempDetail.create({
                data: {
                    saleTempId: saleTempDetail.saleTempId,
                    foodId: saleTempDetail.foodId
                }
            })

            const countSaleTempDetail = await prisma.saleTempDetail.count({
                where: {
                    saleTempId: saleTempId
                }
            })

            await prisma.saleTemp.update({
                where: {
                    id: saleTempId
                },
                data: {
                    qty: countSaleTempDetail
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    },
    removeSaleTempDetail: async (req, res) => {
        try {
            const saleTempDetailId = req.body.saleTempDetailId;
            const saleTempDetail = await prisma.saleTempDetail.findFirst({
                where: {
                    id: saleTempDetailId
                }
            })

            await prisma.saleTempDetail.delete({
                where: {
                    id: saleTempDetailId
                }
            })

            const countSaleTempDetail = await prisma.saleTempDetail.count({
                where: {
                    saleTempId: saleTempDetail.saleTempId
                }
            })

            await prisma.saleTemp.update({
                where: {
                    id: saleTempDetail.saleTempId
                },
                data: {
                    qty: countSaleTempDetail
                }
            })

            return res.send({ message: 'success' })
        } catch (e) {
            return res.status(500).send({ error: e.message })
        }
    }
}