import React from "react";
import EventItem from "../EventItem/EventItem";
import "./EventList.css";

const EventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        event={event}
        userId={props.authUserID}
        onDetail={props.onViewDetail}
      />
    );
  });
  return (
    <div>
      <ul className="events__list">{events}</ul>
    </div>
  );
};

export default EventList;
