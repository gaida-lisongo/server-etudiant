const CommandeModel = require("./Commande");

class AdminModel extends CommandeModel{
    constructor(){
        super();
    }

    getAllInscription(id_promotion){
        return this.query('SELECT * FROM inscription WHERE id_promotion = ?', [id_promotion])
    }

    getAllDossier(id_promotion){
        return this.query('SELECT * FROM dossier WHERE id_promotion = ?', [id_promotion]);
    }

    getAllEnrolement(id_promotion){
        return this.query('SELECT * FROM enrolement WHERE id_promotion = ?', [id_promotion])
    }

    //commande Inscription
    async getInscription(id) {
        try {
            const { data } = await this.getAllCommandes('inscription', id)
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Inscriptions retrieved successfully",
                    data
                };
                
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucune inscription",
                    data
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            }
        }
    }

    async createInscription({id_etudiant, id_inscription, reference, payment}) {
        try {
            const result = await this.createCommande('inscription', {
                id_etudiant,
                id_inscription,
                reference,
                payment
            });
            return {
                success: true,
                message: "Inscription created successfully",
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

    // Commande Dossier
    async getDossiers(id) {
        try {
            const { data } = await this.getAllCommandes('dossier', id);
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Dossiers retrieved successfully",
                    data
                };
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun dossier",
                    data
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async createDossier({ id_etudiant, id_dossier, reference, payment }) {
        try {
            const result = await this.createCommande('dossier', {
                id_etudiant,
                id_dossier,
                reference,
                payment
            });
            return {
                success: true,
                message: "Dossier created successfully",
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

    // Commande Enrolement
    async getEnrolements(id) {
        try {
            const { data } = await this.getAllCommandes('enrolement', id);
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Enrolements retrieved successfully",
                    data
                };
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun enrolement",
                    data
                };
            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async createEnrolement({ id_etudiant, id_enrolement, reference, payment }) {
        try {
            const result = await this.createCommande('enrolement', {
                id_etudiant,
                id_enrolement,
                reference,
                payment
            });
            return {
                success: true,
                message: "Enrolement created successfully",
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

module.exports = AdminModel