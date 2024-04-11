import React, { useState, useContext, useEffect } from "react";
import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";
import AuthContext from "../context/auth-context";
import "./Events.css";
import EventList from "../components/Events/EventList/EventList";

const Events = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const titleRef = React.createRef();
  const priceRef = React.createRef();
  const descriptioneRef = React.createRef();

  const context = useContext(AuthContext);

  useEffect(() => {
    fetchEvents();
  }, []);

  const showDetailHandler = (eventId) => {
    return setSelectedEvent(events.find((e) => e._id === eventId));
  };

  const modalConfirmHandler = () => {
    const title = titleRef.current.value;
    const price = parseFloat(priceRef.current.value);
    const date = new Date().toISOString();
    const description = descriptioneRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
        mutation CreateEvent($tittle:String!, $desc:String!, $price: Float!, $date:String!){
          createEvent(eventInput: {tittle: $tittle, description: $desc, price:$price, date:$date}){
            _id
            tittle
            description 
            price
            date
            creator {
              _id
              email
            }
          }
        }
      `,
      variables: {
        tittle: title,
        desc: description,
        price: price,
        date: date,
      },
    };

    const token = context.token;
    const auth = "Authorization";

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        [auth]: "Bearer " + token,
      },
    })
      .then((res) => {
        console.log(`${auth}: Bearer ${token}`);
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const updatedEvents = [...events];
        updatedEvents.push({
          _id: resData.data.createEvent._id,
          tittle: resData.data.createEvent.tittle,
          description: resData.data.createEvent.description,
          price: resData.data.createEvent.price,
          date: resData.data.createEvent.date,
          creator: {
            _id: context.userId,
          },
        });
        setEvents(updatedEvents);
      })
      .catch((err) => {
        throw err;
      });

    setShowModal(false);
  };

  const fetchEvents = () => {
    setIsLoading(true);
    const requestBody = {
      query: ` 
      query{
        events{
          _id
            tittle
            description 
            price
            date
            creator {
              _id
              email
            }
        }
      }
    `,
    };
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        setEvents(events);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        throw err;
      });
  };

  const modalCancelHandler = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const bookEventHandler = () => {
    if (!context.token) {
      setSelectedEvent(null);
      return;
    }
    const requestBody = {
      query: ` 
      mutation BookEvent($id:ID!){
        bookEvent(eventId: $id){
          _id
          createdAt
          updatedAt
        }
      }
    `,
      variables: {
        id: selectedEvent._id,
      },
    };

    const auth = "Authorization";

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        [auth]: "Bearer " + context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        setSelectedEvent(null);
      })
      .catch((err) => {
        setIsLoading(false);
        throw err;
      });
  };

  return (
    <React.Fragment>
      {(showModal || selectedEvent) && <Backdrop />}
      {showModal && (
        <Modal
          title="Add Event"
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={modalConfirmHandler}
          confirmText="Confirm"
        >
          <form action="">
            <div className="form-control">
              <label htmlFor="title">Title</label>
              <input type="text" name="" id="title" ref={titleRef} />
            </div>
            <div className="form-control">
              <label htmlFor="price">Price</label>
              <input type="number" name="" id="price" ref={priceRef} />
            </div>
          </form>
          <div className="form-control">
            <label htmlFor="description">Description</label>
            <textarea
              type="text"
              name=""
              id="description"
              ref={descriptioneRef}
            />
          </div>
        </Modal>
      )}
      {selectedEvent && (
        <Modal
          title={selectedEvent.tittle}
          canCancel
          canConfirm
          onCancel={modalCancelHandler}
          onConfirm={bookEventHandler}
          confirmText={context.token ? "Book" : "Confirm"}
        >
          <h1>{selectedEvent.tittle}</h1>
          <h2>
            {parseFloat(selectedEvent.price)} -{" "}
            {new Date(selectedEvent.date).toLocaleDateString()}{" "}
          </h2>
          <p>{selectedEvent.description}</p>
        </Modal>
      )}
      {context.token && (
        <div className="events-control">
          <p>Share your own Events</p>
          {showModal === false && (
            <button className="btn" onClick={() => setShowModal(true)}>
              Create Event
            </button>
          )}
        </div>
      )}
      {isLoading ? (
        <div className="spinner">
          <div className="lds-heart">
            <div></div>
          </div>
        </div>
      ) : (
        <EventList
          events={events}
          authUserID={context.userId}
          onViewDetail={showDetailHandler}
        />
      )}
    </React.Fragment>
  );
};

export default Events;
