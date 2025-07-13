const CommandeController = require("./CommandeController");
const { Academique } = require("../models");

class AcadController extends CommandeController {
    constructor() {
        super();
        console.log("AcadController initialized");
    }

    async fetchAllCharges(id_promotion) {
        try {
            const data = Academique.getFromCache('charges-' + id_promotion);
            if (data.length > 0) {
                return {
                    success: true,
                    message: 'Charges retrieved from cache',
                    data
                };
            } else {
                const { rows, message, success } = await Academique.getAllCharges(id_promotion);
                if (rows.length > 0) {
                    await Academique.setInCache('charges-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Charges retrieved from database',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'No charges found',
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

    async fetchAllReleves(id_promotion) {
        try {
            const data = Academique.getFromCache('releves-' + id_promotion);
            if (data.length > 0) {
                return {
                    success: true,
                    message: 'Releves retrieved from cache',
                    data
                };
            } else {
                const { rows, message, success } = await Academique.getAllReleves(id_promotion);
                if (rows.length > 0) {
                    await Academique.setInCache('releves-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Releves retrieved from database',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'No releves found',
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

    async fetchAllValidation(id_promotion) {
        try {
            const data = Academique.getFromCache('validations-' + id_promotion);
            if (data.length > 0) {
                return {
                    success: true,
                    message: 'Validations retrieved from cache',
                    data
                };
            } else {
                const { rows, message, success } = await Academique.getAllValidation(id_promotion);
                if (rows.length > 0) {
                    await Academique.setInCache('validations-' + id_promotion, rows);
                    return {
                        success: true,
                        message: 'Validations retrieved from database',
                        data: rows
                    };
                } else {
                    return {
                        success: false,
                        message: 'No validations found',
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

    async fetchAllCommandesTravaux(id) {
        try {
            return await Academique.getTravaux(id);
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async fetchAllCommandesReleves(id) {
        try {
            return await Academique.getReleves(id);
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async fetchAllCommandesValidations(id) {
        try {
            return await Academique.getValidations(id);
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async createTravailCommande({ id_etudiant, id_travail, reference, payment }) {
        try {
            return await Academique.createTravail({ id_etudiant, id_travail, reference, payment });
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async createReleveCommande({ id_etudiant, id_releve, reference, payment }) {
        try {
            return await Academique.createReleve({ id_etudiant, id_releve, reference, payment });
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }

    async createValidationCommande({ id_etudiant, id_validation, reference, payment }) {
        try {
            return await Academique.createValidation({ id_etudiant, id_validation, reference, payment });
        } catch (error) {
            return {
                success: false,
                message: error.message,
                data: null
            };
        }
    }


}

module.exports = AcadController;
