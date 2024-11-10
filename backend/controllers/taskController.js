import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendMail = (email, subject, title, description) => {
  var transporter = createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  var mailOptions = {
    from: "alok.yadav6000@gmail.com",
    to: email,
    subject: subject,
    html: `<h1>Task added successfully</h1><h2>Title: ${title}</h2><h3>Description: ${description}</h3>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const addTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const userId = req.user.id;
  const user = await userModel.find({ _id: userId });
  const newTask = new taskModel({
    title,
    description,
    completed: false,
    userId,
    priority,
    dueDate,
  });
  newTask
    .save()
    .then(() => {
      sendMail(user[0].email, "Task Added", title, description);
      console.log(`Task added successfully - Status: 200 - Title: ${title}`);
      return res.status(200).json({ message: "Task added successfully" });
    })
    .catch((error) => {
      console.log(`Failed to add task - Status: 500 - Error: ${error.message}`);
      return res.status(500).json({ message: error.message });
    });
};

const removeTask = (req, res) => {
  const { id } = req.body;
  console.log("id: ", id);
  taskModel
    .findByIdAndDelete(id)
    .then(() => {
      console.log(`Task deleted successfully - Status: 200 - ID: ${id}`);
      res.status(200).json({ message: "Task deleted successfully" });
    })
    .catch((error) => {
      console.log(
        `Failed to delete task - Status: 501 - Error: ${error.message}`
      );
      res.status(501).json({ message: error.message });
    });
};

const editTask = async (req, res) => {
  const { id, title, description, completed } = req.body;
  try {
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.userId !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this task" });
    }
    const updatedTask = await taskModel.findByIdAndUpdate(
      id,
      { title, description, completed },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = (req, res) => {
  taskModel
    .find({ userId: req.user.id })
    .then((data) => res.status(200).json(data))
    .catch((error) => res.status(501).json({ message: error.message }));
};

export { addTask, getTask, removeTask, editTask };
