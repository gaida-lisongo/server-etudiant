const { Etudiant } = require("../models");
const Controller = require("./controller");

class EtudiantController extends Controller{
    constructor() {
        super();
        
        this.etudiant = {
            id: null,
            nom: null,
            post_nom: null,
            prenom: null,
            avatar: null,
            sexe: null,
            lieu_naissance: null,
            date_naissance: null,
            telephone: null,
            adresse: null,
            e_mail: null,
            mdp: null,
            vision: null,
            frais_acad: null,
            solde: null,
            amounr: null
        }
        this.etudiants = [];

        this.model = Etudiant;
    }

    async getEtudiants (){
        try {
            
        } catch (error) {
            
        }
    }

}

module.exports = EtudiantController