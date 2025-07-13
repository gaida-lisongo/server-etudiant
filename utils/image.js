const multer = require('multer');

// Multer config: accept jpg, jpeg, png
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images JPG, JPEG et PNG sont autorisées'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5 Mo max pour les images
});

// Middleware principal
const uploadAndSendPhotoToWebhook = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image fournie' });
  }
  try {
    const form = new FormData();
    const blob = new Blob([req.file.buffer]);
    form.append('file', blob, req.file.originalname);

    const webhookUrl = process.env.WEBHOOK_URL;
    const apiKey = process.env.WEBHOOK_APIKEY?.replace(/'/g, '');

    const response = await fetch(webhookUrl + '/app/photo', {
      method: 'POST',
      body: form,
      headers: {
        'x-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Image envoyée avec succès:', data);
    // Supposons que l'URL de l'image est dans data.url
    req.imageUrl = data.url;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'image', details: err.message });
  }
};

module.exports = {
  upload,
  uploadAndSendPhotoToWebhook
};