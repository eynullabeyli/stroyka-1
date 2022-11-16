const express = require('express');
const app = express()
var cors = require('cors')
var bodyParser = require('body-parser')
const middlewares_validation = require('./middlewares/validation')
const middlewares_auth = require('./middlewares/jwt_auth');
const port = 3005;
var session = require('express-session')

const productAPI = require('./controller/ProductController')
const altCategoryAPI = require("./controller/AltCategoryController");
const subCatAPI = require('./controller/SubCategoryController')
const categoryAPI = require('./controller/CategoryController')
const contactAPI = require('./controller/ContactController')
const aboutUsAPI = require('./controller/AboutUsController');
const UserAPI = require('./controller/UserController');
const checkOutAPI = require('./controller/CheckOutController')
const adressAPI = require('./controller/AdressController')
const imageAPI = require('./controller/ImageController')

const sliderAPI = require('./controller/SliderController')
const bannerAPI = require('./controller/BannerController')
var { body } = require('express-validator');
var cors = require('cors')

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json');
var corsOptions = {
       origin: ['https://adminstroyka.eynullabeyli.com', 'https://18.212.195.169', 'http://stroyka.eynullabeyli.com', 'https://stroyka.eynullabeyli.com', 'http://localhost:3000', 'http://localhost:3001'],
       optionsSuccessStatus: 200
}
app.set('trust proxy', 1)
app.use(session({
       secret: 'sessionId',
       resave: false,
       saveUninitialized: true
}))
function isAuthenticated (req, res, next) {
       if (req.session.user) next()
       else next('route')
}
     
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

require('./routes/admin_route')(app)
app.get('/api/stroyka/get/products/all', productAPI.getProduct)
app.get('/api/stroyka/get/products/:slug', productAPI.getProductByID)
app.get('/api/stroyka/get/products/byCategory/:category', productAPI.getProductByCategory)
app.get('/api/stroyka/get/products/bySubCategory/:subCategory', productAPI.getProductBySubCategory)
app.get('/api/stroyka/get/products/byAltCategory/:altCategory', productAPI.getProductByAltCategory)

app.get('/api/stroyka/get/altcategories', altCategoryAPI.getAltCategories)
app.get('/api/stroyka/get/altcategories/:uniqId', altCategoryAPI.getAltCategoryByUniqID)
app.get('/api/stroyka/get/altcategoriesBySubCatID/:slug', altCategoryAPI.getAltCategoriesBySubCategory)

app.get('/api/stroyka/get/subcategories', subCatAPI.getSubCats)
app.get('/api/stroyka/get/subcategories/:uniqId', subCatAPI.getSubCatByUniqID)
app.get('/api/stroyka/get/getSubCatsByCatSlug/:slug', subCatAPI.getSubCatsByCatSlug)

app.get('/api/stroyka/get/categories', categoryAPI.getCategories)
app.get('/api/stroyka/get/categoriesByUniqID/:uniqId', categoryAPI.getCategoryByUniqId)
app.get('/api/stroyka/get/about', aboutUsAPI.getAbout)
app.get('/api/stroyka/get/slider', sliderAPI.getSliders)
app.post('/api/stroyka/filter/product/subcategory', productAPI.filterPriceBySubCat)
app.post('/api/stroyka/filter/product/category', productAPI.filterPriceByCategory)
app.post('/api/stroyka/filter/product/altcategory', productAPI.filterPriceByAltCat)

app.post('/api/stroyka/contactus/', contactAPI.postContact)


app.post('/api/stroyka/register/user', UserAPI.UserRegister)
app.post('/api/stroyka/login/user', function(req,res,next){
       req.session.regenerate(function(err) {
              if (err) return res.json({"msg": "unauthorized"})
              req.session.user = req.body.user
              req.session.save(function(err){
                     if (err) return err;
                     next();
              })
       })
},UserAPI.UserLogin)
app.get('/api/stroyka/user/me', UserAPI.userData)
app.get('/api/stroyka/product/livesearch', productAPI.liveSearchProduct);
app.get('/api/getImage/:public/:uploads/:folder/:image', imageAPI.getImage)
app.post('/api/stroyka/logout/user', isAuthenticated,middlewares_auth.authenticateToken, (err, req, res, next) => {
       if (err.name === "TokenExpiredError") {
              return res.status(401).send("invalid token...");
       } else {
              next();
       }
}, UserAPI.UserLogout)
app.post('/api/stroyka/checkout', middlewares_auth.authenticateToken, (err, req, res, next) => {
       if (err.name === "TokenExpiredError") {
              return res.status(401).send("Invalid token");
       } else {
              next();
       }
}, checkOutAPI.checkOut)
app.put('/api/stroyka/user/update/password', middlewares_auth.authenticateToken, (err, req, res, next) => {
       if (err) {
              return res.status(401).send("Invalid token")
       }
       next()
}, UserAPI.UserChangePass);

app.get('/api/stroyka/users/list', UserAPI.UserList)
app.get('/api/stroyka/banners/list', bannerAPI.getBanner)
app.get('/api/stroyka/get/product/featured', productAPI.getProductIsFeatured)
app.get('/api/stroyka/get/product/bestseller', productAPI.getProductIsBestseller)
app.get('/api/stroyka/get/product/bestseller/category/:category', productAPI.getProductByCategoryBestseller)
app.get('/api/stroyka/get/product/featured/category/:category', productAPI.getProductByCategoryFeatured)
app.put('/api/stroyka/update/checkoutStatus', checkOutAPI.checkoutStatusUpdate)
app.put('/api/stroyka/user/updateData', middlewares_auth.authenticateToken, (err, req, res, next) => {
       if (err.name === "TokenExpiredError") {
              return res.status(401).send("Invalid token");
       } else {
              next();
       }
}, UserAPI.userDataEdit)

app.get('/api/admin/get/adress', adressAPI.getAdress)

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

module.exports = app.listen(port, () => {
       console.log('Listening');
})
