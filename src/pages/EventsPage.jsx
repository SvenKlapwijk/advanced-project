import React from "react";
import { useState, useEffect } from "react";
import { Heading, Box, Flex, Input, FormControl, FormLabel, Stack, Checkbox } from "@chakra-ui/react";
import { EventCard } from "../components/EventCard";
import { Link } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

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

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) && selectedCategories.length === 0) ||
      event.categoryIds.some((id) => selectedCategories.includes(id))
  );

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

      <Input
        variant={"outline"}
        borderColor={"black"}
        backgroundColor={"gray.200"}
        marginTop={"1rem"}
        width={"sm"}
        type="text"
        name="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <FormControl display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Stack width={"200px"} display={"flex"} alignItems={"flex-start"} spacing={2}>
          <FormLabel>Filter by Category</FormLabel>
          {categories.map((category) => (
            <Checkbox
              colorScheme={"red"}
              display={"flex"}
              justifyContent={"center"}
              key={category.id}
              isChecked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}>
              {category.name}
            </Checkbox>
          ))}
        </Stack>
      </FormControl>

      <Flex
        marginTop={"2rem"}
        height={"100%"}
        maxWidth={"1100px"}
        flexWrap={"wrap"}
        gap={"1rem"}
        justifyContent={"center"}
        alignItems={"center"}>
        {events.length > 0 &&
          categories.length > 0 &&
          filteredEvents.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <EventCard event={event} categories={categories} />
            </Link>
          ))}
      </Flex>
    </Box>
  );
};
