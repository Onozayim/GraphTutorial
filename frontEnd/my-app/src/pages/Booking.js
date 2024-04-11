import React, { useState, useEffect, useContext } from "react";
import authContext from "../context/auth-context";
import "./Bookings.css";

const Bookings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const context = useContext(authContext);

  const fetchBookings = () => {
    setIsLoading(true);

    const requestBody = {
      query: ` 
      query{
        bookings{
          _id
          createdAt
          event {
            _id
            tittle
            description
          }
        }
      }
    `,
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
        const bookings = resData.data.bookings;
        setBookings(bookings);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        throw err;
      });
  };
  return (
    <React.Fragment>
      {isLoading ? (
        <div className="spinner">
          <div className="lds-heart">
            <div></div>
          </div>
        </div>
      ) : (
        <ul className="book__list">
          <AllBookings bookings={bookings} fetchBookings={fetchBookings} />
        </ul>
      )}
    </React.Fragment>
  );
};

const AllBookings = ({ bookings, fetchBookings }) => {
  const [newBookings, setNewBookings] = useState(bookings);

  const context = useContext(authContext);

  const onDelete = (bookingID) => {
    if (!bookingID) {
      return;
    }

    const requestBody = {
      query: ` 
      mutation CancelBooking($id: ID!){
        cancelBooking(bookingId: $id){
          _id
          tittle
          description
          price
        }
      }
    `,
      variables: {
        id: bookingID,
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
        const updatedBookings = newBookings.filter((b) => {
          return b._id !== bookingID;
        });

        setNewBookings(updatedBookings);

        fetchBookings();
      })
      .catch((err) => {
        throw err;
      });
  };

  return bookings.map((booking) => (
    <li key={booking._id} className="book__list__item">
      <div className="bookings__item__data">
        <h1>{booking.event.tittle}</h1>
        <p>{new Date(booking.createdAt).toLocaleDateString()}</p>
        <p>{booking.event.description}</p>
      </div>
      <div className="bookings__item__actions">
        <button className="btn" onClick={() => onDelete(booking._id)}>
          CANCEL
        </button>
      </div>
    </li>
  ));
};

export default Bookings;
