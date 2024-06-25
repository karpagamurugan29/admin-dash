const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    id: {
        type: Number
    },
    fieldname: {
        type: String
    },
    originalname: {
        type: String
    },
    encoding: {
        type: String
    },
    mimetype: {
        type: String
    },
    destination: {
        type: String
    },
    filename: {
        type: String
    },
    path: {
        type: String
    },
    size: {
        type: Number
    },
    documentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reference',
        autopopulate: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
    ,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
    ,
    updatedAt: {
        type: Date,
    }
});

// Middleware to auto-increment the field before saving
documentSchema.pre('save', function (next) {
    const doc = this;
    if (!doc.isNew) {
        // Only increment on new documents
        return next();
    }
    // Find the maximum value of the field in the collection
    YourModel.findOne({}, {}, { sort: { id: -1 } }, (err, lastDoc) => {
        if (err) {
            return next(err);
        }
        // Set the auto-incremented value
        doc.id = lastDoc ? parseFloat(lastDoc.id) + 1 : 1;
        next();
    });
});


// Add autopopulate plugin to the schema
documentSchema.plugin(require('mongoose-autopopulate'));

const collectionName = 'document';
const YourModel = mongoose.model('document', documentSchema, collectionName);
module.exports = YourModel