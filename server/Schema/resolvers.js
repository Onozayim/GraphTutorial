const { Authresolvers } = require("./auth");
const { bookingResolvers } = require("./booking");
const { EventResolvers } = require("./events");

const resolvers = {
  ...Authresolvers,
  ...bookingResolvers,
  ...EventResolvers,
};

module.exports = { resolvers };
