const { Etudiant } = require("../models");
const Controller = require("./controller");

class EtudiantController extends Controller{
    constructor() {
        super();
        this.etudiants = [];

        this.init()
    }

    async init(){
        try {
            console.log('Initialisation du controlleur Etudiants');
            const response = await getEtudiants();
            this.etudiants = response.data
        } catch (error) {
            console.error('Un problème est survenu lors de l\'initialisation de la classe :', error);
        }
    }

    async getEtudiants (){
        try {
            const data = Etudiant.getFromCache('etudiants');
            if(data.length > 0) {
                return {
                    success: true,
                    message: 'Etudiants depuis le cache',
                    data
                }
            } else {
                const {rows, message, success} = await Etudiant.getAllEtudiants();

                if(rows.length > 0){
                    await Etudiant.setInCache('etudiants', rows);
                    return {
                        success: true,
                        message: 'Etudiants depuis la base de données',
                        data: rows
                    }
                } else {
                    return {
                        success: false,
                        message: 'Aucun étudiant retrouvé',
                        data: null
                    }
                }                

            }
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            }
            
        }
    }

    async updateEtudiant(id, col, value){
        try {
            const etudiantIndex = this.etudiants.findIndex(e => e.id === id);
            if (etudiantIndex === -1) {
                const {rows} = await Etudiant.getEtudiantById(id);
                if (rows) {
                    let etudiant = rows[0];
                    etudiant[col] = value;
                    this.etudiants.push(etudiant);
                    await Etudiant.setInCache('etudiants', this.etudiants);
                    await Etudiant.updateEtudiant({id, col, value});
                    return {
                        success: true,
                        message: "Étudiant mis à jour avec succès",
                        data: etudiant
                    };
                } else {
                    throw new Error("Étudiant non trouvé");
                }
            }

            this.etudiants[etudiantIndex][col] = value;
            await Etudiant.setInCache('etudiants', this.etudiants);
            await Etudiant.updateEtudiant({id, col, value});

            return {
                success: true,
                message: "Étudiant mis à jour avec succès",
                data: this.etudiants[etudiantIndex]
            };
        } catch (error) {
            return {
                success: false,
                message: error?.message,
                data: null
            }
        }
    }

}

module.exports = EtudiantController