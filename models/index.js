const RechargeModel = require('./Recharge');
const AcadModel = require('./Academique');
const AdminModel = require('./Administratif');
const RechercheModel = require('./Recherche');

module.exports = {
    Etudiant: new RechargeModel(),
    Academique: new AcadModel(),
    Aministratif: new AdminModel(),
    Recherche: new RechercheModel()
};