const CommandeModel = require("./Commande");

class AcadModel extends CommandeModel{
    constructor(){
        super();
    }

    getAllCharges(id_promotion){
        const sql = `SELECT ch.*, m.designation AS 'cours', m.credit, u.designation AS 'unite', CONCAT (g.designation, '. ', t.nom, ' ', t.post_nom) AS 'titulaire', t.matricule
                FROM charge_horaire ch
                INNER JOIN matiere m ON m.id = ch.id_matiere
                INNER JOIN unite u ON u.id = m.id_unite
                INNER JOIN agent t ON t.id = ch.id_titulaire
                INNER JOIN grade g ON g.id = t.id_grade
                WHERE u.id_promotion = ?`;
        return this.query(sql, [id_promotion]);
    }

    getAllTravaux(id_charge){
        return this.query('SELECT * FROM travail WHERE id_charge = ?', [id_charge])
    }

    getAllReleves(id_promotion){
        return this.query('SELECT * FROM releve WHERE id_promotion = ?', [id_promotion]);
    }

    getAllValidation(id_promotion){
        return this.query('SELECT * FROM validation WHERE id_promotion = ?', [id_promotion])
    }

    //commande travail
    async getTravaux(id) {
        try {
            const { data } = await this.getAllCommandes('travail', id)
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Travaux retrieved successfully",
                    data
                };
                
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun travail",
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

    async createTravail({id_etudiant, id_travail, reference, payment}) {
        try {
            const result = await this.createCommande('travail', {
                id_etudiant,
                id_travail,
                reference,
                payment
            });
            return {
                success: true,
                message: "Travail created successfully",
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

    //commande relevé
    async getReleves(id){
        try {
            const { data } = await this.getAllCommandes('releve', id)
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Relevés retrieved successfully",
                    data
                };
                
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucun relevé",
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

    async createReleve({id_etudiant, id_releve, reference, payment}) {
        try {
            const result = await this.createCommande('releve', {
                id_etudiant,
                id_releve,
                reference,
                payment
            });
            return {
                success: true,
                message: "Releve created successfully",
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

    //commande resultat
    async getValidation(id){
        try {
            const { data } = await this.getAllCommandes('validation', id)
            if (data.length > 0) {
                return {
                    success: true,
                    message: "Validations retrieved successfully",
                    data
                };
                
            } else {
                return {
                    success: true,
                    message: "Vous n'avez encore commandé aucune fiche de validation",
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

    async createValidation({id_etudiant, id_validation, reference, payment}) {
        try {
            const result = await this.createCommande('validation', {
                id_etudiant,
                id_validation,
                reference,
                payment
            });
            return {
                success: true,
                message: "Validation created successfully",
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

module.exports = AcadModel