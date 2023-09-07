const Task = require("../models/Task");
const fs = require("fs");


exports.getAllTasks = async (req, res) => {
  try {
    const user=req.user;
    const tasks = await Task.find({user:user.id,isDeleted: false });
    res.json(tasks);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const user=req.user.id
    const image = req.file;
    const imageBuffer = fs.readFileSync(image.path);
    const newTask = new Task({
      title,
      description,
      user,
      image: {
        data: imageBuffer,
        contentType: image.mimetype,
      },
    });

    const task = await newTask.save();
    fs.unlinkSync(image.path);
    res.json(task);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

exports.softDeleteTask = async (req, res) => {
    try {
      const taskId = req.params.taskId;
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { isDeleted: true },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json({success:true,data:updatedTask});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  };

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { title, description } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
      },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
//not using (was used earlir now soft delete)
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};
