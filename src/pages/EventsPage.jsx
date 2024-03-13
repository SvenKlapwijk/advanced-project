import React from "react";
import { useState, useEffect } from "react";
import { Heading, Box, Flex } from "@chakra-ui/react";
import { EventCard } from "../components/EventCard";
import { useLoaderData } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch("http://localhost:3000/events");

    const eventsData = await response.json();
    setEvents(eventsData);
  };

  const fetchCategories = async () => {
    const response = await fetch("http://localhost:3000/categories");

    const categoryData = await response.json();
    setCategories(categoryData);
  };
  return (
    <Box
      as={"main"}
      minHeight={"100vh"}
      minWidth={"100%"}
      display={"flex"}
      alignItems={"center"}
      flexDirection={"column"}
      padding={"0 1rem 0 1rem"}>
      <Heading marginTop={"1rem"}>Event list for fun</Heading>
      <Flex
        marginTop={"2rem"}
        height={"100%"}
        width={"100%"}
        flexWrap={"wrap"}
        gap={"1rem"}
        justifyContent={"center"}
        alignItems={"center"}>
        {events.length > 0 &&
          categories.length > 0 &&
          events.map((event) => <EventCard key={event.id} event={event} categories={categories} />)}
      </Flex>
    </Box>
  );
};
