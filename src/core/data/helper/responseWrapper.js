class BaseResponse {
    constructor(message = null, errors = null, data = null) {
        this.message = message;
        this.errors = errors || null;
        this.data = data;
    }

    static fromJson(json) {
        return new BaseResponse(
            json.message,
            json.errors,
            json.data
        );
    }

    toJson() {
        return {
            message: this.message,
            errors: this.errors,
            data: this.data,
        };
    }

    getErrorMessage() {
        if (this.message && this.message.length > 0) {
            return this.message;
        }
        if (this.errors && this.errors.length > 0) {
            return this.errors.join(', ');
        }
        return "An error occurred";
    }
}

export default BaseResponse;
