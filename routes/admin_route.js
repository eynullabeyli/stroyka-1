const productAPI = require('../controller/ProductController')
const categoryAPI = require('../controller/CategoryController')
const subCatAPI = require('../controller/SubCategoryController')
const altCategoryAPI = require("../controller/AltCategoryController");
const sliderAPI = require('../controller/SliderController');
const aboutUs = require('../controller/AboutUsController')
const bannerAPI = require('../controller/BannerController');
const contactAPI = require('../controller/ContactController');
const adressAPI = require('../controller/AdressController')
const teamAPI = require('../controller/TeamController');
const upload = require('../middlewares/file_upload');
const bodyParser = require('body-parser');
const checkOutAPI = require('../controller/CheckOutController');
var parseForm = bodyParser.urlencoded({ extended: true });
module.exports = (app) => {
       app.post('/api/admin/createNewCategory', categoryAPI.createNewCategory)
       app.post('/api/admin/createNewSubCat', subCatAPI.createNewSubCat)
       app.post('/api/admin/createNewAltCat', altCategoryAPI.createNewAltCat)
       app.post('/api/admin/createNewProduct', upload.uploadProduct, parseForm, async function (req, res, next) {
              if (upload.error_response.errors.length > 0) {
                     res.status(402).json(upload.error_response)
                     return upload.error_response.errors = []
              }
              next()
       }, productAPI.createNewProduct)
       app.post('/api/admin/createNewSlider', upload.uploadSlider, parseForm, async function (req, res, next) {
              if (upload.error_response.errors.length > 0) {
                     res.status(402).json(upload.error_response)
                     return upload.error_response.errors = []
              }
              next()
       }, sliderAPI.createNewSlider)
       app.get('/api/stroyka/get/team', teamAPI.teamGet)
       app.get('/api/admin/getAllProducts',productAPI.getProductAdmin)
       app.post('/api/admin/createNewBanner', upload.uploadBanner, parseForm, async function (req, res, next) {
              if (upload.error_response.errors.length > 0) {
                     res.status(402).json(upload.error_response)
                     return upload.error_response.errors = []
              }
              next()
       }, bannerAPI.createNewBanner)

       app.post('/api/admin/create/adress', adressAPI.createAdress)
       app.post('/api/admin/create/new/team', upload.uploadTeam, parseForm, async function (req, res, next) {
              if (upload.error_response.errors.length > 0) {
                     res.status(402).json(upload.error_response)
                     return upload.error_response.errors = []
              }
              next()
       }, teamAPI.teamPost)
       app.get('/api/admin/get/contacUs', contactAPI.getContact)
       app.get('/api/admin/get/checkout', checkOutAPI.getCheckout)
       app.post('/api/admin/create/aboutUs', aboutUs.createAbout)
       app.delete('/api/admin/delete/category', categoryAPI.deleteCategory);
       app.delete('/api/admin/delete/subcategory', subCatAPI.deleteSubCategory);
       app.delete('/api/admin/delete/altcategory', altCategoryAPI.deleteAltCategory);
       app.delete('/api/admin/delete/products', productAPI.deleteProduct);
       app.delete('/api/admin/delete/banner', bannerAPI.deleteBanner)
       app.delete('/api/admin/delete/slider', sliderAPI.deleteSlider)
       app.delete('/api/admin/delete/adress', adressAPI.deleteAdress)
       app.delete('/api/admin/delete/team', teamAPI.deleteTeam)
       app.put('/api/admin/update/aboutus', aboutUs.updateAbout)
       app.put('/api/admin/update/altcategory', altCategoryAPI.updateAltCategory)
       app.put('/api/admin/update/category', categoryAPI.updateCategory)
       app.put('/api/admin/update/subcategory', subCatAPI.updateSubCat)
       app.put('/api/admin/update/product', productAPI.updateProduct)
       app.put('/api/admin/update/adress', adressAPI.updateAdress)
       app.put('/api/admin/update/productStatus', productAPI.updateProductStatus)
       app.put('/api/admin/update/productIsFeatured', productAPI.updateProductIsFeatured)
       app.put('/api/admin/update/productIsBestseller', productAPI.updateProductIsBestseller)
       app.put('/api/admin/update/product/image',upload.uploadProduct,parseForm,productAPI.updateProductImage)
}