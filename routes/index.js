const express = require('express');
const router = express.Router();
const { upload: documentUpload, uploadAndSendToWebhook } = require('../utils/document');
const { upload: imageUpload, uploadAndSendPhotoToWebhook } = require('../utils/image');
const RechercheController = require('../controllers/RechercheController');

const rechercheController = new RechercheController();

// Route pour uploader un document (PDF, DOC, DOCX)
router.post('/documents', documentUpload.single('file'), uploadAndSendToWebhook, async (req, res) => {
    res.json({ 
        success: true,
        message: 'Document uploadé avec succès',
        url: req.documentUrl 
    });
});

// Route pour uploader une image (JPG, PNG)
router.post('/photos', imageUpload.single('file'), uploadAndSendPhotoToWebhook, async (req, res) => {
    res.json({ 
        success: true,
        message: 'Image uploadée avec succès',
        url: req.imageUrl 
    });
});

// Route pour soumettre un document de recherche
router.post('/recherche/documents', 
    documentUpload.single('file'),           // Gérer l'upload du fichier
    uploadAndSendToWebhook,          // Envoyer au webhook et obtenir l'URL
    rechercheController.soumettreDocument.bind(rechercheController)  // Sauvegarder en base
);

// Routes pour récupérer et supprimer les documents
router.get('/recherche/documents/:etudiantId', rechercheController.getDocumentsEtudiant.bind(rechercheController));
router.delete('/recherche/documents/:documentId', rechercheController.supprimerDocument.bind(rechercheController));
router.get('/recherche/documents/:documentId/rapport', rechercheController.genererRapport.bind(rechercheController));

module.exports = router;