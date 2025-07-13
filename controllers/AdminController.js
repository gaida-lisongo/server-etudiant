const CommandeController = require("./CommandeController");

class AdminController extends CommandeController {
    constructor() {
        super();
        console.log("AdminController initialized");
    }

}

module.exports = AdminController;
