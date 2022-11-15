const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { validationResult } = require('express-validator')
const { v4: uuidv4 } = require('uuid');

const checkOut = async (req, res) => {
       try {

              try {
                     let uniq_id__tmp = uuidv4();
                     await prisma.$connect;
                     const checkout = await prisma.checkout.create({
                            data: {
                                   uniq_id: uniq_id__tmp,
                                   productCount: parseInt(req.body.count),
                                   orderAdress: (req.body.adress),
                                   userId: req.body.uniq_id,
                                   productId: req.body.productId,
                                   status: Boolean(0)
                            }
                     })
                     res.status(201).json("Successfuly created")
              } catch (e) {
                     console.log(e);
                     res.status(501);
              }

       } catch (e) {
              console.log(e);
              res.status(500).send("Server error")
       }
}
const getCheckout = async (req, res) => {
       try {
              await prisma.$connect;
              const checkouts = await prisma.checkout.findMany({
                     include: {
                            product: true,
                            user: {
                                   select: {
                                          adress: true,
                                          createdAt: true,
                                          email: true,
                                          lastname: true,
                                          name: true,
                                          phone: true
                                   }
                            }
                     }
              });
              res.status(200).json(checkouts)
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const checkoutStatusUpdate = async (req, res) => {
       try {
              await prisma.$connect;
              const editStatus = await prisma.checkout.update({
                     where: {
                            uniq_id: req.body.uniq_id
                     },
                     data: {
                            status: Boolean(parseInt(req.body.status))
                     }
              })
              res.status(200).send("Updated")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       checkOut,
       getCheckout,
       checkoutStatusUpdate
}






