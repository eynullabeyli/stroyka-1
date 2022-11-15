const crypto = require("crypto");
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const createNewSlider= async(req,res) => {
       try{
              try{
                     await prisma.$connect;
                     console.log(req);
                     let uniq_id__tmp =crypto.randomBytes(8).toString("hex");
                     const newSlider = await prisma.slider.create({
                            data:{
                                   uniq_id:uniq_id__tmp,
                                   title:req.body.title,
                                   description:req.body.description,
                                   image:req.files.image[0].path,
                                   mobile_image: req.files.mobile_image[0].path,
                                   mobile_description:req.body.mobile_description,
                                   path:req.body.path
                            }
                     })
                     res.status(201).send("Created");
              } catch(e){
                     res.status(500)
              }
       } catch(e){
              console.log(e);
              res.status(501).send("invalid")
       }
}
const getSliders = async (req,res) => {
       try{
              try{
                     await prisma.$connect;
                     const sliders = await prisma.slider.findMany();
                     res.status(200).json(sliders)
              } catch(e) {
                     console.log(e);
                     res.status(500)
              }

       }catch(e){
              console.log(e);
              res.status(501).send("Invalid")
       }
}
const deleteSlider = async (req,res) => {
       try {
              await prisma.$connect;
              const deleted = await prisma.slider.delete({
                     where:{
                            uniq_id:req.body.uniq_id
                     }
              })
              res.status(200).send("Success")
       } catch(e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       createNewSlider,
       getSliders,
       deleteSlider
}