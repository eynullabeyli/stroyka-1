const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const crypto = require("crypto");
var fs = require('fs');


const teamPost = async (req, res) => {
       try {
              await prisma.$connect;
              let uniq_id__tmp = crypto.randomBytes(8).toString("hex");
              console.log(req.file);
              const team = await prisma.team.create({
                     data: {
                            uniq_id: uniq_id__tmp,
                            title: req.body.title,
                            image: req.file.path,
                            profession: JSON.parse(req.body.profession)
                     }
              })
              res.send(team)
              res.status(200).send("Created")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const teamGet = async (req, res) => {
       try {
              await prisma.$connect;
              const teams = await prisma.team.findMany()
              res.status(200).json(teams)
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const deleteTeam = async (req, res) => {
       try {
              const uniq_id = req.body.uniq_id
              const deleteTeamImage = await prisma.team.findUnique({
                     where: {
                            uniq_id: uniq_id
                     },
                     select: {
                            image: true
                     }
              })
              fs.unlink(deleteTeamImage.image, function (err) {
                     if (err) throw err;
                     console.log('File deleted');
              })
              let deleteTeam = await prisma.team.delete({
                     where: {
                            uniq_id: uniq_id
                     }
              })
              res.status(200).send("Deleted")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       teamPost,
       teamGet,
       deleteTeam
}