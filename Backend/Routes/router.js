const express = require('express');
const router = express.Router();
const products = require('../Models/Products');
const Returns = require('../Models/Returns');
const Invoice = require('../Models/Invoice');
const Bill = require('../Models/Bill');

// Insert Product
router.post('/insertproduct', async (req, res) => {
  const {
    ProductName,
    ProductPrice,
    ProductBarcode,
    ProductQuantity,
    ProductDetails,
    Discount,
    MRP,
    PurchaseDate,
    ExpiryDate,
  } = req.body;

  if (!ProductName || !ProductPrice || !ProductBarcode || ProductQuantity === undefined) {
    return res.status(400).json('❌ Please fill all required fields.');
  }

  try {
    const existing = await products.findOne({ ProductBarcode });
    if (existing) {
      return res.status(422).json('⚠️ Product already exists with this barcode.');
    }

    const newProduct = new products({
      ProductName,
      ProductPrice,
      ProductBarcode,
      ProductQuantity,
      ProductDetails,
      Discount,
      MRP,
      PurchaseDate,
      ExpiryDate,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Server error.');
  }
});

// Get All Products
router.get('/products', async (req, res) => {
  try {
    const allProducts = await products.find({});
    res.status(201).json(allProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Failed to fetch products.');
  }
});

// Get Single Product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await products.findById(req.params.id);
    if (!product) return res.status(404).json('❌ Product not found.');
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Failed to fetch product.');
  }
});

// Update Product
router.put('/updateproduct/:id', async (req, res) => {
  const {
    ProductName,
    ProductPrice,
    ProductBarcode,
    ProductQuantity,
    ProductDetails,
    Discount,
    MRP,
    PurchaseDate,
    ExpiryDate,
  } = req.body;

  if (!ProductName || !ProductPrice || !ProductBarcode || ProductQuantity === undefined) {
    return res.status(400).json('❌ Please fill all required fields.');
  }

  try {
    const updated = await products.findByIdAndUpdate(
      req.params.id,
      {
        ProductName,
        ProductPrice,
        ProductBarcode,
        ProductQuantity,
        ProductDetails,
        Discount,
        MRP,
        PurchaseDate,
        ExpiryDate,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json('❌ Product not found.');
    res.status(201).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Failed to update product.');
  }
});

// Delete Product
router.delete('/deleteproduct/:id', async (req, res) => {
  try {
    const deleted = await products.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json('❌ Product not found.');
    res.status(201).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Failed to delete product.');
  }
});

// Return Product
// Return product using barcode
router.post('/returnproduct', async (req, res) => {
  const { barcode, returnQty, reason } = req.body;

  if (!barcode || !returnQty || !reason) {
    return res.status(400).json('❌ Missing required fields');
  }

  try {
    const product = await products.findOne({ ProductBarcode: barcode });

    if (!product) return res.status(404).json('❌ Product not found by barcode.');

    if (returnQty > product.ProductQuantity) {
      return res.status(400).json('❌ Return quantity exceeds current stock.');
    }

    const discountedPrice = product.ProductPrice - (product.Discount || 0);
    const returnValue = returnQty * discountedPrice;
    const actualReceived = returnValue; // you can adjust logic if needed
    const costImpact = returnValue - actualReceived;

    const returnRecord = new Returns({
      productId: product._id,
      ProductName: product.ProductName,
      ProductBarcode: product.ProductBarcode,
      returnedQuantity: returnQty,
      productPrice: product.ProductPrice,
      discount: product.Discount || 0,
      returnValue,
      actualMoneyReceived: actualReceived,
      costImpact,
      reason,
      date: new Date()
    });

    await returnRecord.save();

    product.ProductQuantity -= returnQty;
    if (product.ProductQuantity <= 0) {
      await product.deleteOne();
    } else {
      await product.save();
    }

    res.status(200).json({ message: '✅ Product returned successfully', returnRecord });
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Server error during return');
  }
});


// Get All Return Logs
router.get('/returns', async (req, res) => {
  try {
    const logs = await Returns.find().sort({ date: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Failed to fetch return logs.');
  }
});

// Finalize Order (Invoice)
router.post('/finalizeorder', async (req, res) => {
  const { cart, amountReceived } = req.body;

  if (!cart || !Array.isArray(cart) || cart.length === 0 || !amountReceived) {
    return res.status(400).json('❌ Invalid order data.');
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  try {
    const invoice = new Invoice({
      cart,
      totalAmount: total,
      amountReceived,
    });

    await invoice.save();

    res.status(201).json({ message: '✅ Invoice saved.', invoiceId: invoice._id });
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Server error.');
  }
});

// Create Bill and Save to Both Bill & Invoice Collections
router.post('/createbill', async (req, res) => {
  const { items, customerName, paymentMode, totalAmount, amountReceived } = req.body;

  try {
    for (const item of items) {
      const product = await products.findById(item.productId);
      if (!product || product.ProductQuantity < item.quantity) {
        return res.status(400).json(`❌ Insufficient stock for ${item.name}`);
      }

      product.ProductQuantity -= item.quantity;
      await product.save();
    }

    const newBill = new Bill({
      items,
      customerName,
      paymentMode,
      totalAmount,
    });
    await newBill.save();

    const invoice = new Invoice({
      cart: items,
      totalAmount,
      amountReceived,
    });
    await invoice.save();

    res.status(201).json(newBill);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Error while creating bill');
  }
});

// Get all invoices (Billing History)
router.get('/invoices', async (req, res) => {
  try {
    const data = await Invoice.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json('❌ Failed to fetch invoices');
  }
});

module.exports = router;
