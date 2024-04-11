const { Booking } = require("../models/booking");

const { Event } = require("../models/event");
const { trasnformBooking, transformEvent } = require("../Schema/merge");

const bookingResolvers = {
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent,
    });
    const result = await booking.save();
    return trasnformBooking(result);
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated");
    }
    try {
      const bookings = await Booking.find({ user: req.userId });
      return bookings.map((booking) => {
        return trasnformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
};

module.exports = {
  bookingResolvers,
};
