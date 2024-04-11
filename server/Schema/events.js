const { Event } = require("../models/event");
const { User } = require("../models/users");
const { transformEvent } = require("../Schema/merge");

const EventResolvers = {
  events: async (args, req) => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return transformEvent(event);
      });
    } catch (err) {
      throw err;
    }
  },

  createEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const event = new Event({
      tittle: args.eventInput.tittle,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.userId,
    });
    let createdEvents;
    try {
      const result = await event.save();
      createdEvents = transformEvent(result);
      const creator = await User.findById(req.userId);
      if (!creator) {
        throw new Error("User not found");
      }
      creator.createdEvents.push(event);
      await creator.save();
      return createdEvents;
    } catch (err) {
      throw err;
    }
  },
};

module.exports = { EventResolvers };
