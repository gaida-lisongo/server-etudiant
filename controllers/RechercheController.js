const { Recherche } = require("../models");
const Controller = require("./controller")
//PdfMake
const PdfPrinter = require("pdfmake");
//Recupérer les fonts pour PdfMake en ligne
const fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/fonts/Roboto/Roboto-MediumItalic.ttf'
    }
};

class RechercheController extends Controller {
    constructor(){
        super();
        this.pdfPrinter = new PdfPrinter(fonts);
        this.stages = [];
        this.tfes = [];
    }

    // Lire les stages disponibles
    async fetchStages(id_promotion){
        try {
            const data = Recherche.getFromCache('stages-' + id_promotion);
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'Stages depuis le cache',
                    data
                };
            } else {
                const { rows, message, success } = await Recherche.getAllStages(id_promotion);
                if (rows.length > 0) {
                    await Recherche.setInCache('stages-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Stages depuis la base de données',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucun stage trouvé',
                        data: null
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    // Lire les sujet disponible mémoire    
    async fetchTFE(id_promotion){
        try {
            const data = Recherche.getFromCache('tfes-' + id_promotion);
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'TFE depuis le cache',
                    data
                };
            } else {
                const { rows, message, success } = await Recherche.getAllTFE(id_promotion);
                if (rows.length > 0) {
                    await Recherche.setInCache('tfes-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'TFE depuis la base de données',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucun TFE trouvé',
                        data: null
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    // S'enroller à un stage
    async enrollStage(id_etudiant, id_stage, reference, payment) {
        try {
            const result = await Recherche.createStage({ id_etudiant, id_stage, reference, payment });
            return {
                success: true,
                message: "Stage créé avec succès",
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async fetchPlagiat(id_promotion){
        try {
            const data = Recherche.getFromCache('plagiats');
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'Plagiats depuis le cache',
                    data
                };
            } else {
                const { rows, message, success } = await Recherche.getPlagiatCommandes(id_promotion);
                if (rows.length > 0) {
                    await Recherche.setInCache('plagiats', rows);
                    return {
                        success: true,
                        message: 'Plagiats depuis la base de données',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucun plagiat trouvé',
                        data: null
                    };
                }
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }
    
    async enrollPlagiat(id_etudiant, id_recherche, reference, payment) {
        try {
            const result = await Recherche.createPlagiat({ id_etudiant, id_recherche, reference, payment });
            return {
                success: true,
                message: "Plagiat créé avec succès",
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async submitDocument(id, url_document){
        try {
            const result = await Recherche.updatePlagiat(id, url_document);
            return {
                success: true,
                message: "Document soumis avec succès",
                data: result
            };
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

}

module.exports = RechercheController;