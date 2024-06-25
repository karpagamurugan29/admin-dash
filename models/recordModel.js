const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    startDate: {
        type: Date
    },
    expireDate: {
        type: Date
    },
    price: {
        type: Number
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reference',
        autopopulate: true,
    },
    address: {
        type: String
    },
    recordType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'reference',
        autopopulate: true,
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'document',
        autopopulate: true,
    }],
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        autopopulate: true
    },
    notificationRead: {
        type: Boolean,
        default: false
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
RecordSchema.pre('save', function (next) {
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
RecordSchema.plugin(require('mongoose-autopopulate'));

const collectionName = 'record';
const YourModel = mongoose.model('record', RecordSchema, collectionName);
module.exports = YourModel