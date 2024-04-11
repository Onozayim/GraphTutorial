const { Event } = require("../models/event");
const { User } = require("../models/users");
const { dateToString } = require("../helpers/date");
const dataloader = require("dataloader");

const eventLoader = new dataloader((eventsIds) => {
  return events(eventsIds);
});

const userLoader = new dataloader((userIDS) => {
  return User.find({ _id: { $in: userIDS } });
});

const user = async (userID) => {
  try {
    const user = await userLoader.load(userID.toString());
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: () => eventLoader.loadMany(user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

const events = async (eventsIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventsIds } });
    events.sort((a, b) => {
      return (
        eventsIds.indexOf(a._id.toString()) -
        eventsIds.indexOf(b._id.toString())
      );
    });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await eventLoader.load(eventId.toString());
    return event;
  } catch (err) {
    throw err;
  }
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

const trasnformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

module.exports = {
  user,
  events,
  singleEvent,
  transformEvent,
  trasnformBooking,
};
