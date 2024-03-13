import React from "react";
import { Card, CardBody, CardHeader, Box, Heading, Text, Stack } from "@chakra-ui/react";

export const EventCard = ({ event, categories }) => {
  // title, description, image, startTime & endTime, categories;
  function formatTimestamp(timestampStr) {
    const timestamp = new Date(timestampStr);

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    };

    // Format the timestamp into a user-friendly format
    return new Intl.DateTimeFormat("nl-NL", options).format(timestamp);
  }
  const startTime = formatTimestamp(event.startTime);
  const endTime = formatTimestamp(event.endTime);

  const filterCategories = (categoryIds) => {
    return categories.filter((category) => {
      return categoryIds.includes(category.id);
    });
  };
  const eventCategories = filterCategories(event.categoryIds);
  console.log(eventCategories);
  return (
    <Card
      height={"175px"}
      width={"500px"}
      display={"flex"}
      flexDirection={"row"}
      borderRadius={"lg"}
      overflow={"hidden"}>
      <CardHeader width={"200px"} padding={0}>
        <Box
          backgroundImage={`url(${event.image})`}
          backgroundSize="cover"
          backgroundPosition="center"
          height="100%"></Box>
      </CardHeader>
      <CardBody
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        textAlign={"center"}
        padding={"0.25rem"}>
        <Stack spacing={"0.5rem"}>
          <Heading marginBottom={"0.5rem"} fontSize={"1.25rem"}>
            {event.title}
          </Heading>
          <Text>
            <Text fontSize={"0.9rem"} fontWeight={"600"} as={"span"}>
              Description:
            </Text>{" "}
            {event.description}
          </Text>
          <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} gap={"5px"}>
            <Text fontSize={"0.9rem"} fontWeight={"600"}>
              Categories:{" "}
            </Text>
            {eventCategories ? (
              eventCategories.map((category) => (
                <Text fontSize={"0.9rem"} key={category.id}>
                  {category.name}
                </Text>
              ))
            ) : (
              <Text fontWeight={"600"}>No categories found</Text>
            )}
          </Box>
          <Box display={"flex"} justifyContent={"center"} gap={"5px"}>
            <Text fontWeight={"600"} fontSize={"0.8rem"}>
              Starts: {startTime}
            </Text>
            <Text fontWeight={"600"} fontSize={"0.8rem"}>
              Ends: {endTime}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
