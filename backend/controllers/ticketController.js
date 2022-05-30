const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const Ticket = require("../models/ticketModel");

// @desc Get user tickets
// @route /api/tickets
// @access Private
const getTickets = asyncHandler(async (req, res, next) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    var err = new Error("User not found");
    next(err);
  } else {
    const tickets = await Ticket.find({ user: req.user.id });
    res.status(200).json(tickets);
  }
});

// @desc Get user ticket
// @route /api/tickets/:id
// @access Private
const getTicket = asyncHandler(async (req, res, next) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    var err = new Error("User not found");
    next(err);
  } else {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      var err = new Error("Ticket not found");
      next(err);
    } else {
      if (ticket.user.toString() !== req.user.id) {
        res.status(401);
        var err = new Error("Not authorized");
        next(err);
      } else {
        res.status(200).json({ ticket });
      }
    }
  }
});

// @desc Post user ticket
// @route /api/tickets
// @access Private
const createTickets = asyncHandler(async (req, res, next) => {
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    var err = new Error("Please add a product and description");
    next(err);
  } else {
    const user = await User.findById(req.user.id);
    if (!user) {
      var err = new Error("User not found");
      next(err);
    } else {
      const ticket = await Ticket.create({
        product,
        description,
        user: req.user.id,
        status: "new",
      });
      res.status(201).json(ticket);
    }
  }
});

// @desc Delete ticket
// @route /api/tickets/:id
// @access Private
const deleteTicket = asyncHandler(async (req, res, next) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    var err = new Error("User not found");
    next(err);
  } else {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      var err = new Error("Ticket not found");
      next(err);
    } else {
      if (ticket.user.toString() !== req.user.id) {
        res.status(401);
        var err = new Error("Not authorized");
        next(err);
      } else {
        await ticket.remove();
        res.status(200).json({ success: true });
      }
    }
  }
});

// @desc Update ticket
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async (req, res, next) => {
  //Get user using the id in the JWT

  const user = await User.findById(req.user.id);

  if (!user) {
    res.status(401);
    var err = new Error("User not found");
    next(err);
  } else {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      var err = new Error("Ticket not found");
      next(err);
    } else {
      if (ticket.user.toString() !== req.user.id) {
        res.status(401);
        var err = new Error("Not authorized");
        next(err);
      } else {
        const updatedTicker = await Ticket.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        res.status(200).json(updateTicket);
      }
    }
  }
});

module.exports = {
  getTickets,
  getTicket,
  deleteTicket,
  createTickets,
  updateTicket,
};
