const UserModel = require("./User");

class RechargeModel extends UserModel {
    constructor() {
        super();
    }
    
    getAllRecharger(userId){
        return this.query(
            `SELECT * FROM recharge WHERE id_etudiant = ? ORDER BY created_at DESC`,
            [userId]
        );
    }

    createRecharge({id_etudiant, montant, reference, devise, telephone}){
        return this.query(
            `INSERT INTO recharge (id_etudiant, montant, reference, date_created, devise, telephone) VALUES (?, ?, ?, NOW())`,
            [id_etudiant, montant, reference, devise, telephone]
        );
    }

    updateRecharge({id, col, value}){
        return this.query(
            `UPDATE recharge SET ${col} = ? WHERE id = ?`,
            [value, id]
        );
    }

    deleteRecharge(id){
        return this.query(
            `DELETE FROM recharge WHERE id = ?`,
            [id]
        );
    }
}

module.exports = RechargeModel;
