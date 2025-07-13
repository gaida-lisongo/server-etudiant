const { Model } = require("./model");

class UserModel extends Model {
    constructor() {
        super();
        
    }

    getEtudiantById(id) {
        return this.query("SELECT * FROM etudiant WHERE id = ?", [id]);
    }

    getEtudiantByAuth({ matricule, mdp }) {
        return this.query("SELECT * FROM etudiant WHERE matricule = ? AND mdp = ?", [matricule, mdp]);
    }

    updateEtudiant({id, col, value}){
        return this.query(`UPDATE etudiant SET ${col} = ? WHERE id = ?`, [value, id]);
    }

    getAllEtudiants() {
        return this.query("SELECT * FROM etudiant");
    }


}

module.exports = UserModel;