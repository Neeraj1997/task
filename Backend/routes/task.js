const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const fetchuser = require("../middleware/fetchuser");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });
//craete task
router.post("/", fetchuser, upload.single('image'), taskController.createTask);
//fetch all Tasks
router.get("/", fetchuser, taskController.getAllTasks);
// Delete (soft)
router.put("/soft-delete/:taskId",fetchuser, taskController.softDeleteTask);
// Update only title and escription
router.put("/:taskId",fetchuser, taskController.updateTask);
// permanenet delete not used now
router.delete("/delete/:taskId",fetchuser, taskController.deleteTask);

module.exports = router;