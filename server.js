const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
const cors = require('cors');
const PageColor = require('./models/PageColor');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB schema for images
const ImageSchema = new mongoose.Schema({
    imageUrl: String,
    publicId: String,
});

const Image = mongoose.model('Image', ImageSchema);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB error:', err));

// Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer storage config
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

const upload = multer({ storage });

// Image upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const image = new Image({
            imageUrl: req.file.path,
            publicId: req.file.filename,
        });
        await image.save();
        res.status(200).json({ message: 'Image uploaded successfully', data: image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading image' });
    }
});

// Fetch all images
app.get('/images', async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching images' });
    }
});

// Delete image from Cloudinary & MongoDB
app.delete('/delete/:id/:cloudinaryId', async (req, res) => {
    try {
        const { id, cloudinaryId } = req.params;
        await cloudinary.uploader.destroy(cloudinaryId);
        await Image.findByIdAndDelete(id);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Deletion failed', details: error });
    }
});

// ✅ Helper functions to handle background colors
const getColor = async (page) => {
    const entry = await PageColor.findOne({ page });
    return entry?.color || '#ffffff';
};

const setColor = async (page, color) => {
    const updated = await PageColor.findOneAndUpdate(
        { page },
        { color },
        { new: true, upsert: true }
    );
    return updated.color;
};

// 🎨 Background color routes

// HOME
// ✅ Keep only ONE get route
app.get('/colorhome', async (req, res) => {
    try {
        const color = await getColor('home');
        res.json({ color });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get color', details: err });
    }
});

// ✅ Keep only ONE post route
app.post('/colorhome', async (req, res) => {
    try {
        const color = await setColor('home', req.body.color || '#ffffff');
        console.log("✅ Updated color:", color);
        res.json({ message: 'Home color updated', color });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update color', details: err });
    }
});



// PROFILE
// Get profile color
// Get Profile Color
// ✅ GET profile color
app.get('/colorprofile', async (req, res) => {
    try {
        const color = await getColor('profile');
        res.json({ color });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get color', details: err });
    }
});

// ✅ POST profile color
app.post('/colorprofile', async (req, res) => {
  try {
    console.log("📩 Incoming color:", req.body.color); // Check if it's reaching
    const color = await setColor('profile', req.body.color || '#ffffff');
    console.log("✅ Updated profile color in DB:", color);
    res.json({ message: 'Profile color updated', color });
  } catch (err) {
    console.error("❌ Error updating profile color:", err);
    res.status(500).json({ error: 'Failed to update color', details: err });
  }
});




// CART
// GET current cart color
app.get('/colorcart', async (req, res) => {
    try {
        const color = await getColor('cart');
        res.json({ color });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get cart color', details: err });
    }
});

// POST new cart color
app.post('/colorcart', async (req, res) => {
    try {
        const color = await setColor('cart', req.body.color || '#ffffff');
        console.log("✅ Cart color updated:", color);
        res.json({ message: 'Cart color updated', color });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update cart color', details: err });
    }
});


// ABOUT

// GET About Page Color
app.get('/colorabout', async (req, res) => {
    try {
        const color = await getColor('about');
        res.json({ color });
    } catch (err) {
        console.error("❌ Failed to get about color:", err);
        res.status(500).json({ error: 'Failed to get about color', details: err });
    }
});

// POST (Update) About Page Color
app.post('/colorabout', async (req, res) => {
    try {
        const color = await setColor('about', req.body.color || '#ffffff');
        console.log("✅ About page color updated:", color);
        res.json({ message: 'About color updated successfully', color });
    } catch (err) {
        console.error("❌ Failed to update about color:", err);
        res.status(500).json({ error: 'Failed to update about color', details: err });
    }
});


// CONTACT

// GET Contact Page Color
app.get('/colorcontact', async (req, res) => {
    try {
        const color = await getColor('contact');
        res.json({ color });
    } catch (err) {
        console.error("❌ Failed to get contact color:", err);
        res.status(500).json({ error: 'Failed to get contact color', details: err });
    }
});

// POST (Update) Contact Page Color
app.post('/colorcontact', async (req, res) => {
    try {
        const color = await setColor('contact', req.body.color || '#ffffff');
        console.log("✅ Contact page color updated:", color);
        res.json({ message: 'Contact color updated successfully', color });
    } catch (err) {
        console.error("❌ Failed to update contact color:", err);
        res.status(500).json({ error: 'Failed to update contact color', details: err });
    }
});

// GET Product Page Color
app.get('/colorproduct', async (req, res) => {
    try {
        const color = await getColor('product');
        res.json({ color });
    } catch (err) {
        console.error("❌ Failed to get product color:", err);
        res.status(500).json({ error: 'Failed to get product color', details: err });
    }
});

// POST (Update) Product Page Color
app.post('/colorproduct', async (req, res) => {
    try {
        const color = await setColor('product', req.body.color || '#ffffff');
        console.log("✅ Product page color updated:", color);
        res.json({ message: 'Product color updated successfully', color });
    } catch (err) {
        console.error("❌ Failed to update product color:", err);
        res.status(500).json({ error: 'Failed to update product color', details: err });
    }
});

// HEADER

// GET Header Color
app.get('/colorheader', async (req, res) => {
    try {
        const color = await getColor('header');
        res.json({ color });
    } catch (err) {
        console.error("❌ Failed to get header color:", err);
        res.status(500).json({ error: 'Failed to get header color', details: err });
    }
});

// POST (Update) Header Color
app.post('/colorheader', async (req, res) => {
    try {
        const color = await setColor('header', req.body.color || '#ffffff');
        console.log("✅ Header color updated:", color);
        res.json({ message: 'Header color updated successfully', color });
    } catch (err) {
        console.error("❌ Failed to update header color:", err);
        res.status(500).json({ error: 'Failed to update header color', details: err });
    }
});

// Start server
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

