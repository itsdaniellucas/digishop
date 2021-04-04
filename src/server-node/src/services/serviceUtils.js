
function ServiceResult(data, success = true, error = '') {
    return {
        Data: data,
        IsSuccessful: success,
        Error: error,
    }
}

function ServiceSuccess(data, totalPages = 0) {
    if(totalPages) {
        return {
            Data: data,
            TotalPages: totalPages,
            IsSuccessful: true,
            Error: ''
        };
    }

    return {
        Data: data,
        IsSuccessful: true,
        Error: ''
    };
}

function ServiceError(error) {
    return {
        Data: null,
        IsSuccessful: false,
        Error: error
    };
}

module.exports = {
    ServiceResult,
    ServiceSuccess,
    ServiceError
}