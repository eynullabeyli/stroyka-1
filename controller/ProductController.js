const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { validationResult } = require('express-validator')
const crypto = require("crypto");
var fs = require('fs');
const { json } = require("body-parser");
const { isAsyncFunction } = require("util/types");

const getProduct = async (req, res) => {
       try {
              // swagger.tags = ['Product']
              await prisma.$connect;
              const products = await prisma.product.findMany({
		      where:{
			status:'active'
		      },
		      include: {
                            category: true
                     }
              });
              res.status(200).json(products)
       } catch (e) {
              res.status(404).send("Invalid")
       }
}
const getProductAdmin = async (req, res) => {
       try {
              // swagger.tags = ['Product']
              await prisma.$connect;
              const products = await prisma.product.findMany({
		      include: {
                            category: true
                     }
              });
              res.status(200).json(products)
       } catch (e) {
              res.status(404).send("Invalid")
       }
}
const getProductByID = async (req, res) => {
       try {
              let search__ = (req.params.slug)
              await prisma.$connect;
              const product = await prisma.product.findFirst({
                     where: {
			    AND: [
				{
					slug:search__
				},
				{
					status:'active'
				}
			    ]
                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(product)
       } catch (e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const getProductByCategory = async (req, res) => {
       try {
              const category_search = (req.params.category);
              await prisma.$connect;
              const category__ = await prisma.category.findUnique({
                     where: {
                            slug: category_search
                     },
                     select: {
                            uniq_id: true
                     }
              })
              const products = await prisma.product.findMany({
                     where: {
                            AND:[
                                   {status:'active'},
                                   {cat_id: category__.uniq_id}
                            ]
                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       } catch (e) {
              console.log(e);
              res.status(404).send("Invalid")
       }
}
const getProductBySubCategory = async (req, res) => {
       try {
              const subCategory_search = (req.params.subCategory);
              await prisma.$connect;
              const subcategory__ = await prisma.subcategory.findUnique({
                     where: {
                            slug: subCategory_search
                     },
                     select: {
                            uniq_id: true
                     }
              })
              const products = await prisma.product.findMany({
                     where: {
                            AND:[
                                   {status:'active'},
                                   {subcat_id: subcategory__.uniq_id}
                            ]
                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       } catch (e) {
              console.log(e);
              res.status(404).send('invalid')
       }
}
const getProductByAltCategory = async (req, res) => {
       try {
              const altCategory = (req.params.altCategory);

              await prisma.$connect;
              const altcategory__ = await prisma.altcategory.findUnique({
                     where: {
                            slug: altCategory
                     },
                     select: {
                            uniq_id: true
                     }
              })
              const products = await prisma.product.findMany({
                     where: {
                            AND:[
                                   {status:'active'},
                                   {altcat_id: altcategory__.uniq_id}
                            ]
                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       } catch (e) {
              console.log(e);
              res.status(404).send('invalid')
       }
}
const filterPriceBySubCat = async (req, res) => {
       try {
              await prisma.$connect;
              try {
                     try {
                            let subcategory = req.body.subcategory
                            let maxPrice = parseFloat(req.body.max_price);
                            let minPrice = parseFloat(req.body.min_price);
                            const productFilter = await prisma.product.findMany({
                                   where: {
                                          AND:[
                                                 {status:'active'},
                                                 {subcat_id: subcategory},
                                                 {
                                                        price: {
                                                        gte: minPrice,
                                                        lte: maxPrice
                                                        }
                                                 }
                                          ]
                                   },
                                   include: {
                                          category: true,
                                          subcategory: true
                                   }
                            })
                            console.log(productFilter);
                            res.status(200).json({ data: productFilter })
                     } catch (e) {
                            res.send([]).status(404)
                     }

              } catch (e) {
                     console.log(e);
                     res.status(500).json({ msg: "Server error" })
              }
       } catch (e) {
              console.log(e);
              res.status(404).json({ msg: "Invalid" })
       }
}
const filterPriceByAltCat = async (req, res) => {
       try {
              await prisma.$connect;
              try {

                     let altcategory = req.body.altcategory
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where: {
                                  AND:[
                                   {status:'active'},
                                   {altcat_id: altcategory},
                                   {
                                          price: {
                                          gte: minPrice,
                                          lte: maxPrice
                                          }
                                   }

                                  ]
                            },
                            include: {
                                   category: true,
                                   altcategory: true
                            }
                     })
                     res.status(200).json({ data: productFilter })
              } catch (e) {
                     console.log(e);
                     res.status(500).json({ msg: "Server error" })
              }
       } catch (e) {
              console.log(e);
              res.status(404).json({ msg: "Invalid" })
       }
}
const filterPriceByCategory = async (req, res) => {
       try {
              await prisma.$connect;
              try {

                     let category = (req.body.category)
                     let maxPrice = parseFloat(req.body.max_price);
                     let minPrice = parseFloat(req.body.min_price);
                     const productFilter = await prisma.product.findMany({
                            where: {
                                   AND:[
                                          {status:'active'},
                                          {cat_id: category},
                                          {price: {
                                                 gte: minPrice,
                                                 lte: maxPrice
                                          }}
                                   ]
                            },
                            include: {
                                   category: true
                            }
                     })
                     res.status(200).json({ data: productFilter })
              } catch (e) {
                     console.log(e);
                     res.status(500).json({ msg: "Server error" })
              }
       } catch (e) {
              console.log(e);
              res.status(404).json({ msg: "Invalid" })
       }
}
const liveSearchProduct = async (req, res) => {
       try {
              const requestParam = req.query.search;
              const requestLanguage = req.query.lang
              await prisma.$connect;
              try {
                     let productSearch = '';
                     let productSearchCount = '';
                     if (requestLanguage == 'az') {
                            productSearch = await prisma.product.findMany({
                                   where: {
                                          AND:[
                                                 {status:'active'},
                                                 {name_az: {
                                                        contains: requestParam
                                                 }}
                                          ]
                                   },
                                   include: {
                                          category: true
                                   }
                            })
                     } else if (requestLanguage == 'en') {
                            productSearch = await prisma.product.findMany({
                                   where: {
                                          AND:[
                                                 {status:'active'},
                                                 {name_en: {
                                                        contains: requestParam
                                                 }}
                                          ]
                                   },
                                   include: {
                                          category: true
                                   }
                            })
                     } else {
                            productSearch = await prisma.product.findMany({
                                   where: {
                                          AND:[
                                                 {status:'active'},
                                                 {name_ru: {
                                                        contains: requestParam
                                                 }}
                                          ]
                                   },
                                   include: {
                                          category: true
                                   }
                            })
                     }
                     if (requestLanguage == 'az') {
                            productSearchCount = await prisma.product.count({
                                   where: {
                                          AND:[
                                                 {status:'active'},
                                                 {name_az: {
                                                        contains: requestParam
                                                 }}
                                          ]
                                   }
                            })
                     } else if (requestLanguage == 'en') {
                            productSearchCount = await prisma.product.count({
                                   where: {
                                         AND:[
                                                 {status:'active'},
                                                 { name_en: {
                                                        contains: requestParam
                                                 }}
                                         ]
                                   }
                            })
                     } else {
                            productSearchCount = await prisma.product.count({
                                   where: {
                                          AND:[
                                                 {status:'active'},
                                                 {name_ru: {
                                                        contains: requestParam
                                                 }}
                                          ]
                                   }
                            })
                     }
                     res.status(200).json({ count: productSearchCount, data: productSearch })
              } catch (e) {
                     console.log(e);
                     res.status(500).json({ msg: "Server error" })
              }

       } catch (e) {
              console.log(e);
              res.status(404).json({ msg: "Invalid" })
       }
}
const createNewProduct = async (req, res) => {
       try {
              let images__tmp = [];
              req.files.forEach((item, index) => {
                     let img__ = {};
                     img__['id'] = crypto.randomBytes(4).toString("hex"),
                            img__['image'] = item.filename
                     img__['path'] = item.path
                     images__tmp.push(img__)
              })
              await prisma.$connect;
              let uniq_id__tmp = crypto.randomBytes(8).toString("hex");
              const newProduct = await prisma.product.create({
                     data: {
                            uniq_id: uniq_id__tmp,
                            name_az: (req.body.name_az),
                            name_ru: (req.body.name_ru),
                            name_en: (req.body.name_en),
                            slug: (req.body.slug),
                            description: (req.body.description),
                            specification: (req.body.specification),
                            price: parseFloat(req.body.price),
                            status: req.body.status,
                            weight: parseFloat(req.body.weight),
                            model: req.body.model,
                            images: (images__tmp),
                            code: req.body.code,
                            type: (req.body.type),
                            manufacturer: (req.body.manufacturer),
                            isBestseller: Boolean(req.body.isBestseller),
                            isFeatured: Boolean(req.body.isFeatured),
                            altcat_id: (req.body.altcat_id),
                            subcat_id: (req.body.subcat_id),
                            cat_id: (req.body.cat_id)
                     }
              })
              // console.log(newProduct);
              res.status(201).send("Successfully created");
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}

const deleteProduct = async (req, res) => {
       try {
              await prisma.$connect;
              const uniq_id__ = req.body.uniq_id;
              const deletedUser__Image = await prisma.product.findUnique({
                     where: {
                            uniq_id: uniq_id__
                     },
                     select: {
                            images: true
                     }
              })
              console.log(deletedUser__Image);
              if (deletedUser__Image.images) {
                     (deletedUser__Image.images).forEach(item => {
                            fs.unlink(`${item.path}`, function (err) {
                                   if (err) throw err;
                                   console.log('File deleted');
                            })
                     })
                     let deletedProduct = await prisma.product.delete({
                            where: {
                                   uniq_id: uniq_id__
                            }
                     })
                     return res.status(200).send("Deleted")
              }
              return res.status(404).json({"msg":"Məhsul silinməsi mümkün deyil"})
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const getProductIsFeatured = async (req, res) => {
       try {
              await prisma.$connect;
              const products = await prisma.product.findMany({
                     where: {
                            AND:[
                                   {status:'active'},
                                   {isFeatured: true}
                            ]
                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       }
       catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const getProductIsBestseller = async (req, res) => {
       try {
              await prisma.$connect;
              const products = await prisma.product.findMany({
                     where: {
                            AND:[
                                   {status:'active'},
                                   {isBestseller: true}
                            ]
                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const getProductByCategoryBestseller = async (req, res) => {
       try {
              const category_search = (req.params.category);
              await prisma.$connect;
              console.log(category_search);
              const category__ = await prisma.category.findUnique({
                     where: {
                            slug: category_search
                     },
                     select: {
                            uniq_id: true
                     }
              })
              console.log(category__);
              const products = await prisma.product.findMany({
                     where: {
                            AND: [
                                   {
                                          status:'active'
                                   },
                                   {
                                          cat_id: category__.uniq_id
                                   },
                                   {
                                          isBestseller: true
                                   }
                            ]

                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const getProductByCategoryFeatured = async (req, res) => {
       try {
              const category_search = (req.params.category);
              await prisma.$connect;
              console.log(category_search);
              const category__ = await prisma.category.findUnique({
                     where: {
                            slug: category_search
                     },
                     select: {
                            uniq_id: true
                     }
              })
              console.log(category__);
              const products = await prisma.product.findMany({
                     where: {
                            AND: [
                                   {status:'active'},
                                   {
                                          cat_id: category__.uniq_id
                                   },
                                   {
                                          isFeatured: true
                                   }
                            ]

                     },
                     include: {
                            category: true,
                            subcategory: true,
                            altcategory: true
                     }
              })
              res.status(200).json(products)
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const updateProduct = async (req, res) => {
       try {
              console.log("111 => ", req.body)

              await prisma.$connect
              const updateProduct = await prisma.product.update({
                     where: {
                            uniq_id: req.body.uniq_id
                     },
                     data: {
                            name_az: req.body.name_az,
                            name_en: req.body.name_en,
                            name_ru: req.body.name_ru,
                            slug: req.body.slug,
                            description: req.body.description,
                            specification: req.body.specification,
                            price: req.body.price,
                            status: req.body.status,
                            weight: req.body.weight,
                            model: req.body.model,
                            manufacturer: req.body.manufacturer,
                            type: req.body.type,
                            code: req.body.code,
                            isBestseller: Boolean(req.body.isBestseller),
                            isFeatured: Boolean(req.body.isFeatured)
                     }
              })
              res.status(200).send("Success")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const updateProductImage = async (req, res) => {
       try {
              const updated_product_id = req.body.uniq_id
              await prisma.$connect
              let images__tmp = [];
              const deletedUser__Image = await prisma.product.findUnique({
                     where: {
                            uniq_id: updated_product_id
                     },
                     select: {
                            images: true
                     }
              })
              if (deletedUser__Image.images) {
                     (deletedUser__Image.images).forEach(item => {
                            fs.unlink(`${item.path}`, function (err) {
                                   if (err) throw err;
                                   console.log('File deleted');
                            })
                     })
              }
              req.files.forEach((item, index) => {
                     let img__ = {};
                     img__['id'] = crypto.randomBytes(4).toString("hex"),
                            img__['image'] = item.filename
                     img__['path'] = item.path
                     images__tmp.push(img__)
              })
              console.log(updated_product_id);
              const product = await prisma.product.update({
                     where:{
                            uniq_id:updated_product_id
                     },
                     data:{
                            images: images__tmp
                     }
              })
              console.log(req.files)
              res.status(201).json({'msg':"Updated!"})
       } catch (e) {
              console.log(e);
              res.status(500).json({ "msg": "Invalid Exception" })
       }
}
const updateProductStatus = async (req, res) => {
       try {
              await prisma.$connect;
              const updateStatus = await prisma.product.update({
                     where: {
                            uniq_id: req.body.uniq_id
                     },
                     data: {
                            status: req.body.status
                     }
              })
              res.status(200).send("Success")
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const updateProductIsFeatured = async (req, res) => {
       try {
              try {
                     await prisma.$connect;
                     const update = await prisma.product.update({
                            where: {
                                   uniq_id: req.body.uniq_id
                            },
                            data: {
                                   isFeatured: Boolean(req.body.isFeatured)
                            }
                     })
                     res.status(200).send("Success")
              } catch (e) {
                     console.log(e);
                     res.status(500)
              }

       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
const updateProductIsBestseller = async (req, res) => {
       try {
              try {
                     await prisma.$connect
                     const update = await prisma.product.update({
                            where: {
                                   uniq_id: req.body.uniq_id
                            },
                            data: {
                                   isBestseller: req.body.isBestseller
                            }
                     })
                     res.status(200).send("Success")
              } catch (e) {
                     console.log(e);
                     res.status(500)
              }
       } catch (e) {
              console.log(e);
              res.status(500).send("Invalid")
       }
}
module.exports = {
       getProduct,
       getProductByID,
       getProductByCategory,
       getProductBySubCategory,
       getProductByAltCategory,
       filterPriceBySubCat,
       filterPriceByAltCat,
       filterPriceByCategory,
       liveSearchProduct,
       createNewProduct,
       deleteProduct,
       getProductIsFeatured,
       getProductIsBestseller,
       updateProduct,
       updateProductStatus,
       updateProductIsFeatured,
       updateProductIsBestseller,
       getProductByCategoryBestseller,
       getProductByCategoryFeatured,
       updateProductImage,
       getProductAdmin
}

