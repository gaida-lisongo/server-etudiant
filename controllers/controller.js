class Controller {
    constructor() {
        // Initialize controller properties if needed
        this.response = {
            status: 200,
            message: 'OK',
            data: null
        }
    }

    getResponse() {
        return this.response;
    }

    setResponse(status, message, data = null) {
        this.response.status = status;
        this.response.message = message;
        this.response.data = data;
    }
}

module.exports = Controller;