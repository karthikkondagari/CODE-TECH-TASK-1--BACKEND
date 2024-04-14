const express = require("express");
const fetchuser = require("../middlewares/fetchuser");
require("dotenv").config();
const { body, validationResult } = require("express-validator");
const Notes = require("../models/Notes");
const router = express.Router();

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  const notes = await Notes.find({ user: req.user.id });
  res.json(notes);
});

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title of length 5").isLength({ min: 5 }),
    body("description", "Enter a valid description of length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag, date } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
        date,
      });
      const saveNote = await note.save();
      res.json(saveNote);
      // const note=await Notes.create({...req.user,...req.body})
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: "error occured in notes.js",
      });
    }
  }
);

router.patch("/updatenotes/:id", fetchuser, async (req, res) => {
  let note = await Notes.findById(req.params.id);

  console.log("noteee", note);
  if (!note) {
    return res.status(404).json({
      status: "failed",
      message: "eror occured while fetching notes",
    });
  }

  console.log("note.user.toString ", note.user.toString());
  console.log(req.user);
  console.log(req.body);
  if (note.user.toString() !== req.user.id) {
    return res.status(401).json({
      status: "failed",
      message: "u r not authorized",
    });
  }

  try {
    note = await Notes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(note);
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "error occured while updating",
    });
  }
});

router.delete("/deletenotes/:id", fetchuser, async (req, res) => {
  let note = await Notes.findById(req.params.id);

  console.log("noteee", note);
  if (!note) {
    return res.status(404).json({
      status: "failed",
      message: "eror occured while fetching notes",
    });
  }

  console.log("note.user.toString ", note.user.toString());
  console.log(req.user);
  console.log(req.body);
  if (note.user.toString() !== req.user.id) {
    return res.status(401).json({
      status: "failed",
      message: "u r not authorized",
    });
  }

  try {
    note = await Notes.findByIdAndDelete(req.params.id, req.body, {
      new: true,
    });
    res.json(note);
  } catch (error) {
    res.status(404).json({
      status: "failed",
      message: "error occured while deleting",
    });
  }
});

module.exports = router;
