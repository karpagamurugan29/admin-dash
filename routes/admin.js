const express = require("express");
const app = express();
const router = express.Router();

const { addUpdate, getReference, getAllRecord, getRecord, getNotifications, getAllCustomer, docUpload, deleteDocumentAndFromRecord } = require('../controllers/adminController');
const Authorization = require('../middleware/autherization');
const upload = require("../middleware/multer");
// const cloudinaryUpload = require("../middleware/cloudnary");
app.use(router);
router.use(express.json());

router.post("/addUpdateDelete/:model", Authorization, addUpdate);
router.post("/record/getAll", Authorization, getAllRecord);
router.get("/customer/all", Authorization, getAllCustomer);
router.post('/upload/doc', upload.single('file'), docUpload);
router.get("/:recordType/get/:id", Authorization, getRecord);
router.post("/document/delete", Authorization, deleteDocumentAndFromRecord);
router.post("/notification/getAll", Authorization, getNotifications);
router.post("/reference", Authorization, getReference);

module.exports = router;