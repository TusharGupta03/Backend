const err_creation = (status, message) => {
    const newerror = new Error();
    newerror.status = status
    newerror.message = message
    return newerror
}

module.exports=err_creation