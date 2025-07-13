const CommandeController = require("./CommandeController");
const { Administratif } = require("../models");

class AdminController extends CommandeController {
    constructor() {
        super();
        console.log("AdminController initialized");
        this.inscriptions = [];
        this.dossiers = [];
        this.enrollements = [];
    }

    // Lire les inscriptions disponibles
    async fetchInscriptions(id_promotion) {
        try {
            const data = Administratif.getFromCache('inscriptions-' + id_promotion);
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'Inscriptions depuis le cache',
                    data
                };
            } else {
                const { rows, message, success } = await Administratif.getAllInscription(id_promotion);
                if (rows.length > 0) {
                    await Administratif.setInCache('inscriptions-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Inscriptions depuis la base de données',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucune inscription trouvée',
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

    // Lire les dossiers disponibles
    async fetchDossiers(id_promotion) {
        try {
            const data = Administratif.getFromCache('dossiers-' + id_promotion);
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'Dossiers depuis le cache',
                    data
                };
            } else {
                const { rows, message, success } = await Administratif.getAllDossier(id_promotion);
                if (rows.length > 0) {
                    await Administratif.setInCache('dossiers-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Dossiers depuis la base de données',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucun dossier trouvé',
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

    // Lire les enrollements disponibles
    async fetchEnrollements(id_promotion) {
        try {
            const data = Administratif.getFromCache('enrollements-' + id_promotion);
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'Enrollements depuis le cache',
                    data
                };
            } else {
                const { rows, message, success } = await Administratif.getAllEnrolement(id_promotion);
                if (rows.length > 0) {
                    await Administratif.setInCache('enrollements-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Enrollements depuis la base de données',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'Aucun enrollement trouvé',
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

    // Commander une inscription
    async commandeInscription({ id_etudiant, id_inscription, reference, payment }) {
        try {
            const result = await Administratif.createInscription({ 
                id_etudiant, 
                id_inscription, 
                reference, 
                payment 
            });
            return {
                success: true,
                message: "Inscription commandée avec succès",
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

    // Commander un dossier
    async commandeDossier({ id_etudiant, id_dossier, reference, payment }) {
        try {
            const result = await Administratif.createDossier({ 
                id_etudiant, 
                id_dossier, 
                reference, 
                payment 
            });
            return {
                success: true,
                message: "Dossier commandé avec succès",
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

    // Soumettre un dossier
    async submiiDossier(id, url) {
        try {
            const result = await Administratif.updateDossier(id, url);
            return {
                success: true,
                message: "Dossier soumis avec succès",
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

    // Commander un enrollement
    async commandeEnrollement({ id_etudiant, id_enrolement, reference, payment }) {
        try {
            const result = await Administratif.createEnrolement({ 
                id_etudiant, 
                id_enrolement, 
                reference, 
                payment 
            });
            return {
                success: true,
                message: "Enrollement commandé avec succès",
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

module.exports = AdminController;
