const multer = require('multer');

// Multer config: accept pdf, doc, docx
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF, DOC, DOCX sont autorisés'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10 Mo max
});

// Middleware principal
const uploadAndSendToWebhook = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier fourni' });
  }
  try {
    const form = new FormData();
    const blob = new Blob([req.file.buffer]);
    form.append('file', blob, req.file.originalname);

    const webhookUrl = process.env.WEBHOOK_URL;
    const apiKey = process.env.WEBHOOK_APIKEY?.replace(/'/g, '');

    const response = await fetch(webhookUrl + '/app/document', {
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
    console.log('Document envoyé avec succès:', data);
    // Supposons que l'URL du document est dans data.url
    req.documentUrl = data.url;
    next();
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du document', details: err.message });
  }
};

module.exports = {
  upload,
  uploadAndSendToWebhook
};
