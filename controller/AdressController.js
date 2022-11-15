const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require("crypto");

const getAdress = async (req,res) => {
       try {
              await prisma.$connect;
              try {
                     const adress = await prisma.adress.findMany()
                     res.status(200).json(adress)
              } catch(e){
                     console.log(e);
                     res.status(500)
              }
             
       }catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}

const createAdress = async (req,res) => {
       try{ 
              await prisma.$connect;
              let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
              const newAdress = await prisma.adress.create({
                     data:{ 
                            uniq_id:uniq_id__tmp,
                            adress: req.body.adress,
                            email: req.body.email,
                            number1 :req.body.number1,
                            number2: req.body.number2,
                            openTimes  : req.body.openTimes ,                   
                            coordinates: req.body.coordinates
                     }
              })
              res.status(200).send("success")
       }catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const updateAdress = async (req,res) => {
       try{ 
              await prisma.$connect;
              const edited = await prisma.adress.update({
                     where:{
                            uniq_id:req.body.uniq_id
                     },
                     data:{
                            adress:req.body.adress,
                            email: req.body.email,
                            number1 :req.body.number1,
                            number2: req.body.number2,
                            openTimes  : req.body.openTimes ,                   
                            coordinates: req.body.coordinates
                     }
              })
              res.status(200).send("Success")
       } catch(e){
              console.log(e);
              res.status(500)
       }
}
const deleteAdress = async (req,res) =>{ 
       try {
              await prisma.$connect;

              const deleted = await prisma.adress.delete({
                     where:{
                            uniq_id:req.body.uniq_id
                     }
              })
              res.status(200).send("Deleted")
       } catch(e){
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports ={
       createAdress,
       updateAdress,
       getAdress,
       deleteAdress
}