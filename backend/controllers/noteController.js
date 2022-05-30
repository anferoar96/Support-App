const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Note = require("../models/noteModel");
const Ticket = require("../models/ticketModel");

// @desc Get notes for a ticket
// @route /api/tickets/:ticketId/notes
// @access Private
const getNotes = asyncHandler(async (req, res, next) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    var err = new Error("User not found");
    next(err);
  } else {
    const tickets = await Ticket.findById(req.params.ticketId);

    if (tickets.user.toString() !== req.user.id) {
      res.status(401);
      var err = new Error("User nor authorized");
      next(err);
    } else {
      const notes = await Note.find({ ticket: req.params.ticketId });
      res.status(200).json(notes);
    }
  }
});

// @desc Create ticket note
// @route POST /api/tickets/:ticketId/notes
// @access Private
const addNote = asyncHandler(async (req, res, next) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    var err = new Error("User not found");
    next(err);
  } else {
    const tickets = await Ticket.findById(req.params.ticketId);

    if (tickets.user.toString() !== req.user.id) {
      res.status(401);
      var err = new Error("User nor authorized");
      next(err);
    } else {
      const note = await Note.create({
        text: req.body.text,
        isStaff: false,
        user: req.user.id,
        ticket: req.params.ticketId,
      });
      res.status(200).json(note);
    }
  }
});

module.exports = {
  addNote,
  getNotes,
};
