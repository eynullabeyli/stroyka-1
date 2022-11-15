const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
var {body} = require('express-validator');
const validationRuleRegister = () => {
       return [
              body('name').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Ad düzgün doldurulmayıb"),
              body('lastname').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Soyad düzgün doldurulmayıb"),
              body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage("E-mail  düzgün doldurulmayıb").custom(value => {
                     return (async () => {
                            await prisma.$connect();
                            const user__ = await prisma.user.findUnique({
                                   where:{
                                          email: value
                                   }
                            })  
                            if(user__) {
                                   throw new Error("Email mövcuddur")
                            }
                     })()
              }),
              body('phone').notEmpty().matches(/^[+]?[0-9]{3}?[(]?[0-9]{2}[)]?[0-9]{4,7}$/).escape().trim().withMessage("Nömrə düzgün doldurulmayıb"),
              body('password').isLength({min:6}).escape().trim().withMessage("Şifrə düzgün doldurulmayıb"),
              body('adress').notEmpty().escape().trim()
       ]
}
const validationRuleFilterProduct = (section_name) => {
       let section_tmp = []
       return [
              body(section_name).notEmpty().trim().escape().custom(value=> {
                     return (async () => {
                            await prisma.$connect();
                            var section__ = await prisma[section_name].findMany({
                                   select:{
                                          id:true
                                   }
                            })
                            section__.forEach(obj => {
                                   section_tmp.push(obj.id)
                               })
                            if(!section_tmp.includes(parseFloat(value))){
                                   throw new Error("Movcud deyil")
                            }
                     })()
              }),
              body("max_price").notEmpty().trim().escape(),
              body("min_price").notEmpty().trim().escape()
       ]
}
const validationRuleContact = () => {
       return [
              body('name').notEmpty().matches(/^[a-zA-Z\s]*$/).escape().trim().withMessage("Ad düzgün doldurulmayıb"),
              body('email').notEmpty().isEmail().normalizeEmail().escape().trim().withMessage("E-mail  düzgün doldurulmayıb"),
              body('phone').notEmpty().matches(/^[+]?[0-9]{3}?[(]?[0-9]{2}[)]?[0-9]{4,7}$/).escape().trim().withMessage("Nömrə düzgün doldurulmayıb"),
              body('message').notEmpty().escape().trim().withMessage("Məktub düzgün deyil")
       ]
}

module.exports={
       validationRuleRegister,
       validationRuleFilterProduct,
       validationRuleContact
}