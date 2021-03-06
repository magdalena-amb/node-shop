const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      edit: false
    });
  }

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
      if(!product) {
        res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        edit: editMode,
        product
      })
    })
    .catch(err => {
      console.log(err);
    });
  }

  exports.postEditProduct = (req, res, next) => {
    const { productId, title, imageUrl, price, description }= req.body;
    Product.findById(productId)
    .then(product => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
     return product.save() 
    })
    .then(result => {
      console.log('Updated Product!')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
  }

exports.postAddProduct = (req, res, next) => {
    const {title, imageUrl, price, description } = req.body;
    const product = new Product({
      title, imageUrl, price, description, userId:req.user});
    product.save()
    .then(result => {
      console.log('Created Product');
    })
    .catch(err => {
      console.log(err);
    });
    res.redirect('/');
  }

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.findByIdAndRemove(productId)
  .then( ()=> {
    console.log('Destroyed product!')
    res.redirect('/admin/products');
  })
  .catch( err => console.log(err));
}

exports.getProducts = (req, res, next ) => {
  Product.find()
  // .select('title price -_id')
  // .populate('userId')
  .then(products => {
    //console.log(products);
    res.render('admin/products', {
      pageTitle: 'Admin Products',
      path: '/admin/products',
       products
       });
  })
  .catch( err => console.log(err));
}