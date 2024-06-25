const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    id: {
        type: Number,
    },
    name: {
        type: String
    },
    userName:{
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    address: {
        type: String
    },
    password: {
        type: String
    },
    dob: {
        type: Date
    },
    status: {
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
customerSchema.pre('save', function (next) {
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
customerSchema.plugin(require('mongoose-autopopulate'));

const collectionName = 'customer';
const YourModel = mongoose.model('customer', customerSchema, collectionName);
module.exports = YourModel