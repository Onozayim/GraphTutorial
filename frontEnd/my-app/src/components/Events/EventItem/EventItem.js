import React from "react";
import "./EventItem.css";

const EventItem = (data) => {
  return (
    <li key={data.event._id} className="events__list__item">
      <div>
        <h1>{data.event.tittle}</h1>
        <h2>
          $ {parseFloat(data.event.price)} -{" "}
          {new Date(data.event.date).toLocaleDateString()}
        </h2>
      </div>
      <div>
        {data.userId === data.event.creator._id ? (
          <p>You are the owner of the item </p>
        ) : (
          <button
            className="btn"
            onClick={data.onDetail.bind(this, data.event._id)}
          >
            View Details
          </button>
        )}
      </div>
    </li>
  );
};

export default EventItem;
