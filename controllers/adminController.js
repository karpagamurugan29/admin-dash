const mongoose = require("mongoose");
const referenceModel = require("../models/referenceModel")
const recordModel = require("../models/recordModel")
const customerModel = require("../models/customerModel")
const DocumentModel = require("../models/documentModel")
const cloudinary = require("../middleware/cloudnary")

//Get all users
const getReference = async (req, res) => {
    try {
        const ref = req.body;
        const result = await referenceModel.find({}).lean().exec();
        const filterResult = result.filter(el =>
            ((el._id && ref?._id) && ((el._id.toString()) === (ref?._id?.toString()))) ||
            (!el.referenceId && (ref?.referenceId === "null")) ||
            ((el.referenceId && ref?.referenceId) && ((el.referenceId?.toString()) === (ref.referenceId?.toString()))) ||
            ((el.code && ref?.code) && (el.code === ref.code)) ||
            ((el.codeName && ref?.codeName) && (el.codeName === ref.codeName)) ||
            ((el.updatedBy && ref?.updatedBy) && ((el.updatedBy?.toString()) === (ref.updatedBy?.toString())))
        );
        let tempData = await getReferenceByReference(filterResult, result);
        res.send(tempData);
    } catch (err) {
        res.status(400).send({ statusCode: 400, message: "error", error: err });
    }
};

const getReferenceByReference = async (filterResult, result) => {
    let tempData = await Promise.all(filterResult.map(async el => {
        let tempObj = { ...el };
        try {
            const data = result.filter(val => (val.referenceId && el._id) && ((val.referenceId.toString()) === (el._id?.toString())));
            tempObj["reference"] = await getReferenceByReference(data);
        } catch (err) {
            tempObj["reference"] = [];
        }
        return tempObj;
    }));
    return tempData;
}

const addUpdate = async (req, res) => {
    const modelName = req.params.model;

    try {
        // Get the Mongoose model based on the provided name
        const Model = require(`../models/${modelName}Model`);
        const validationErrors = req.body.map(obj => {
            const modelInstance = new Model(obj);
            return modelInstance.validateSync();
        });
        // Check if any validation errors occurred
        const hasValidationErrors = validationErrors.some(errors => errors !== undefined);
        if (hasValidationErrors) {
            // Handle validation errors
            return res.status(400).send({ statusCode: 400, message: 'Validation failed', errors: validationErrors });
        } else {
            const results = await Promise.all(
                req.body.map(async (obj) => {
                    if (obj._id) {
                        // Update existing document
                        if (obj.isDeleted) {
                            return await Model.deleteOne({ _id: obj._id });
                        } else {
                            const result = await Model.findOneAndUpdate({ _id: obj._id }, { $set: obj }, { new: true });
                            return result;
                        }
                    } else {
                        // Create a new document
                        const reference = new Model(obj);
                        return await reference.save();
                    }
                })
            );
            res.send({ statusCode: 200, message: 'Updated Successfully', data: results });
        }
    } catch (err) {
        res.status(400).send({ statusCode: 400, message: err?.message });
    }
};


const getAllRecord = async (req, res) => {
    const { recordType } = req.body
    let query = {}
    if (recordType) {
        query.recordType = recordType
    }
    try {
        const result = await recordModel.find(query).populate('documents');;
        res.send(result);
    } catch (err) {
        res.status(500).send({ statusCode: 500, message: err.message });
    }
};

const getAllCustomer = async (req, res) => {
    try {
        const result = await customerModel.find({});
        res.send(result);
    } catch (err) {
        res.status(500).send({ statusCode: 500, message: err.message });
    }
};

const getRecord = async (req, res) => {
    const { id, recordType } = req.params
    let query = {}
    if (id) {
        query._id = id
    }
    if (recordType) {
        query.recordType = recordType
    }
    try {
        const result = await recordModel.find(query);
        res.send(result);
    } catch (err) {
        res.status(500).send({ statusCode: 500, message: err.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const { durations, all,recordType } = req.body
        let query = {}
        if (!all) {
            query["notificationRead"] = false
        }
        if (recordType && (recordType !== "all")) {
            query.recordType = recordType
        }
        // Assuming your database schema has an expireDate field
        // Get current date
        const currentDate = new Date();

        // Calculate 3 months from the current date
        const threeMonthsFromNow = new Date(currentDate);
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + (durations ? parseInt(durations) : 3));

        // Query to find records where current date is within 3 months from the expireDate and before the expireDate
        query.expireDate = { $gte: currentDate, $lte: threeMonthsFromNow };
        const result = await recordModel.find(query);
        res.send(result);
    } catch (err) {
        res.status(500).send({ statusCode: 500, message: err.message });
    }
};

const docUpload = async (req, res) => {
    try {
        const result1 = await cloudinary.uploader.upload(req.file.path);
        let obj = { ...(req.file || {}), path: result1.url }
        if (req?.body?.documentType) {
            obj["documentType"] = req?.body?.documentType
        }
        const document = new DocumentModel(obj);
        const result = await document.save();
        const result2 = await recordModel.findOneAndUpdate({ _id: req.body.recordId }, { $push: { documents: { $each: [result._id] } } }, { new: true });
        await res.send(result2)
    } catch (err) {
        res.status(500).send({ statusCode: 500, message: err.message });
    }
};
const deleteDocumentAndFromRecord = async (req, res) => {
    try {
        // Delete document
        const results = await Promise.all(
            req.body.map(async (obj) => {
                if (obj.documentId && obj.recordId) {
                    await DocumentModel.findByIdAndDelete(obj.documentId);
                    // Remove document from associated record
                    return await recordModel.findOneAndUpdate(
                        { _id: obj.recordId },
                        { $pull: { documents: { $each: [obj.documentId] } } },
                        { new: true }
                    );
                }
            })
        );
        await res.status(200).send(results);
    } catch (err) {
        res.status(500).send({ statusCode: 500, message: err.message });
    }
};
module.exports = {
    addUpdate,
    getReference,
    getAllRecord, getRecord, getNotifications, getAllCustomer, docUpload, deleteDocumentAndFromRecord
}