const { Schema } = require('mongoose')

function SchemaDefaults(schema) {
    return new Schema(Object.assign({}, schema, {
        dateCreated: Date,
        dateModified: Date,
        modifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
        active: Boolean,
    }));
}

function AssignDefaults(obj, contextUserId = null, isNew = true) {
    const currentDate = new Date();

    obj.dateModified = currentDate;
    obj.modifiedBy = contextUserId;
    obj.active = true;

    if(isNew) {
        obj.dateCreated = currentDate;
        obj.createdBy = contextUserId;
    }
    
    return obj;
}

module.exports = {
    SchemaDefaults,
    AssignDefaults
}