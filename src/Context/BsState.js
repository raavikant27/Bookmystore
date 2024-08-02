import React, { useState, useEffect } from "react";
import BsContext from "./BsContext";

const BsState = (props) => {
  
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [time, changeTime] = useState("");
  const [movie, changeMovie] = useState("");
  const [noOfSeat, changeNoOfSeats] = useState({
    A1: "",
    A2: "",
    A3: "",
    A4: "",
    D1: "",
    D2: "",
  });
  const [lastBookingDetails, setLastBookingDetails] = useState(null);

  const handlePostBooking = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: movie, slot: time, seats: noOfSeat }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setErrorPopup(true);
      setErrorMessage(data.message);

      if (response.status === 200) {
        changeTime("");
        changeMovie("");
        changeNoOfSeats({
          A1: "",
          A2: "",
          A3: "",
          A4: "",
          D1: "",
          D2: "",
        });
        setLastBookingDetails(data.data);
        window.localStorage.clear();
      }
    } catch (error) {
      console.error("Failed to post booking:", error);
      setErrorPopup(true);
      setErrorMessage("Failed to post booking. Please try again later.");
    }
  };

  const handleGetLastBooking = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/booking`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLastBookingDetails(data.data);
    } catch (error) {
      console.error("Failed to fetch last booking:", error);
      setErrorPopup(true);
      setErrorMessage("Failed to fetch last booking. Please try again later.");
    }
  };

  useEffect(() => {
    const movie = window.localStorage.getItem("movie");
    const slot = window.localStorage.getItem("slot");
    const seats = JSON.parse(window.localStorage.getItem("seats"));

    if (movie) {
      changeMovie(movie);
    }
    if (slot) {
      changeTime(slot);
    }
    if (seats) {
      changeNoOfSeats(seats);
    }
  }, []);

  return (
    <BsContext.Provider
      value={{
        handlePostBooking,
        handleGetLastBooking,
        movie,
        changeMovie,
        time,
        changeTime,
        noOfSeat,
        changeNoOfSeats,
        lastBookingDetails,
        errorPopup,
        setErrorPopup,
        errorMessage,
        setErrorMessage,
      }}>
      {props.children}
    </BsContext.Provider>
  );
};

export default BsState;
