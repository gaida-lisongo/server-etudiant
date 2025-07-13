const CommandeModel = require("./Commande");

class RechercheModel extends CommandeModel{
    constructor(){
        super();
    }

    getAllStages(id_promotion){
        return this.query('SELECT * FROM stage WHERE id_promotion = ?', [id_promotion])
    }

    getAllTFE(id_promotion){
        return this.query('SELECT * FROM tfe WHERE id_promotion = ?', [id_promotion]);
    }

    getAllPlagiat(id_promotion){
        return this.query('SELECT * FROM plagiat WHERE id_promotion = ?', [id_promotion])
    }

    //commande stage
    async getStageCommandes(id) {
        try {
            const { data } = await this.getAllCommandes('stage', id)
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Stages retrieved successfully",
                    data
                };
                
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun stage",
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

    async createStage({id_etudiant, id_stage, reference, payment}) {
        try {
            const result = await this.createCommande('stage', {
                id_etudiant,
                id_stage,
                reference,
                payment
            });
            return {
                success: true,
                message: "Stage created successfully",
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

    // Commande tfe
    async getTFECommandes(id) {
        try {
            const { data } = await this.getAllCommandes('tfe', id);
            if (data.length > 0) {
                return {
                    success: true,
                    message: "TFE retrieved successfully",
                    data
                };
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun TFE",
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

    async createTFE({ id_etudiant, id_tfe, reference, payment }) {
        try {
            const result = await this.createCommande('tfe', {
                id_etudiant,
                id_tfe,
                reference,
                payment
            });
            return {
                success: true,
                message: "TFE created successfully",
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

    // Commande plagiat
    async getPlagiatCommandes(id) {
        try {
            const { data } = await this.getAllCommandes('plagiat', id);
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Plagiat retrieved successfully",
                    data
                };
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun plagiat",
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

    async createPlagiat({ id_etudiant, id_plagiat, reference, payment }) {
        try {
            const result = await this.createCommande('plagiat', {
                id_etudiant,
                id_plagiat,
                reference,
                payment
            });
            return {
                success: true,
                message: "Plagiat created successfully",
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
    
    async updatePlagiat(id, value) {
        try {
            return await this.query('UPDATE commande_plagiat SET url_document = ? WHERE id = ?', [value, id]);

        } catch (error) {
            return {
                success: false,
                message: error?.message,
                data: null
            }
            
        }

    }

}

module.exports = RechercheModel