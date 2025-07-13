const {Model} = require("./model");

class CommandeModel extends Model {
    constructor(){
        super();
    }
    
    createCommande(type, commandeData) {
        const sql = `
            INSERT INTO commande_${type} (
                ${Object.keys(commandeData).join(", ")}
            )
            VALUES (${Object.values(commandeData).map(() => "?").join(", ")})
        `;

        return this.query(sql)
    }

    getAllCommandes(type, id) {
        const sql = `
            SELECT p.*, c.id AS cmd_id, c.date_creation, c.statut, c.reference, c.payment
            FROM commande_${type} c
            INNER JOIN ${type} p ON p.id = c.id_${type}
            WHERE id = ?
        `;
        return this.query(sql, [id]);
    }
}

module.exports = CommandeModel;