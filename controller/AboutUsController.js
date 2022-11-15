const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require("crypto");

const getAbout = async (req, res) => {
    try {
        await prisma.$connect;
        try{
            const aboutData = await prisma.aboutus.findMany();
            res.status('200').json({results:[aboutData]})
        } catch(e) {
            res.status('500').json({msg:"Invalid"})
        }
    } catch (e) {
        console.log(e);
        res.status('404').json({msg: "Invalid"});
    }
}
const createAbout = async(req,res) => {
    try{
        await prisma.$connect;
        let uniq_id__tmp =crypto.randomBytes(8).toString("hex");

        let about = await prisma.aboutus.create({
            data:{
                uniq_id:uniq_id__tmp,
                title:req.body.title,
                context:req.body.context
            }
        })
        res.status(200).send("success")
    }catch(e){
        console.log(e);
        res.status(404)
    }
}
const updateAbout = async(req,res) => {
    try {   
        await prisma.$connect
        const updateAbout = await prisma.aboutus.update({
            where:{
                uniq_id:req.body.uniq_id
            },
            data :{
                title:req.body.title,
                context:req.body.context
            }
        })
        res.status(200).send("Successfull")
    }catch(e){
        console.log(e);
        res.status(500)
    }
}
module.exports = {
    getAbout,
    createAbout,
    updateAbout
}