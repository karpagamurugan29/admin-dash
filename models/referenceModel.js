const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    referenceId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reference"
        
    },
    code: {
        type: String
    },
    codeName: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
    , createdAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
    , updatedAt: {
        type: Date,
    }
});

const collectionName = 'reference';

module.exports = mongoose.model('reference', UserSchema, collectionName);