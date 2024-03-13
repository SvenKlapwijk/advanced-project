import React from "react";
import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  Text,
  Box,
  Image,
  Flex,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  FormHelperText,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

export const Loader = async ({ params }) => {
  const users = await fetch("http://localhost:3000/users");
  const event = await fetch(`http://localhost:3000/events/?id=${params.eventId}`);
  const categories = await fetch(`http://localhost:3000/categories`);

  return {
    users: await users.json(),
    eventData: await event.json(),
    categories: await categories.json(),
  };
};

export const EventPage = () => {
  const { users, eventData, categories } = useLoaderData();
  const event = eventData[0];
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: event.id,
    createdBy: event.createdBy,
    title: event.title,
    description: event.description,
    image: event.image,
    categoryIds: event.categoryIds,
    location: event.location,
    startTime: event.startTime,
    endTime: event.endTime,
  });

  const {
    isOpen: isDeleteConfirmationOpen,
    onOpen: onOpenDeleteConfirmation,
    onClose: onCloseDeleteConfirmation,
  } = useDisclosure();

  const handleDelete = () => {
    onOpenDeleteConfirmation();
  };

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

  const findUser = () => {
    return users.filter((user) => {
      return user.id === event.createdBy;
    });
  };

  const createdBy = findUser()[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUserChange = (userId) => {
    setFormData({ ...formData, createdBy: userId });
  };

  const handleCheckboxChange = (categoryId) => {
    const updatedCategoryIds = formData.categoryIds.includes(categoryId)
      ? formData.categoryIds.filter((id) => id !== categoryId)
      : [...formData.categoryIds, categoryId];

    setFormData({ ...formData, categoryIds: updatedCategoryIds });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (formData.categoryIds.length === 0) {
        throw new Error("At least one category must be selected.");
      }

      const response = await fetch(`http://localhost:3000/events/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        navigate("/");
        toast({
          title: "Event updated",
          description: "Your event has been successfully updated!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error.message);
      toast({
        title: "An error occurred",
        description: "Failed to update event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${formData.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onCloseDeleteConfirmation();
        navigate("/");
        toast({
          title: "Event deleted",
          description: "Your event has been successfully deleted!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error.message);
      toast({
        title: "An error occurred",
        description: "Failed to delete event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      width="100%"
      padding="1rem"
      minHeight="calc(100vh - 56px)"
      alignItems="center"
      flexDirection="column"
      justifyContent="center">
      <Card width={"800px"}>
        <CardHeader padding={"0.75rem"}>
          <Box
            borderRadius={"lg"}
            backgroundImage={`url(${event.image})`}
            backgroundSize="cover"
            backgroundPosition="center"
            height={"300px"}></Box>
        </CardHeader>
        <CardBody
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          textAlign={"center"}
          padding={"1rem"}>
          <Stack spacing={"1rem"}>
            <Heading marginBottom={"0.5rem"} fontSize={"2rem"}>
              {event.title}
            </Heading>
            <Text fontSize={"1.25rem"}>
              <Text fontSize={"1.25rem"} fontWeight={"600"} as={"span"}>
                Description:
              </Text>{" "}
              {event.description}
            </Text>
            <Box display={"flex"} flexWrap={"wrap"} justifyContent={"center"} gap={"5px"}>
              <Text fontSize={"1.25rem"} fontWeight={"600"}>
                Categories:{" "}
              </Text>
              {eventCategories ? (
                eventCategories.map((category) => (
                  <Text fontSize={"1.25rem"} key={category.id}>
                    {category.name}
                  </Text>
                ))
              ) : (
                <Text fontWeight={"600"}>No categories found</Text>
              )}
            </Box>
            <Box display={"flex"} justifyContent={"center"} gap={"1rem"}>
              <Text fontWeight={"600"} fontSize={"1rem"}>
                Starts: {startTime}
              </Text>
              <Text fontWeight={"600"} fontSize={"1rem"}>
                Ends: {endTime}
              </Text>
            </Box>
            <Box display={"flex"} alignItems={"center"} justifyContent={"center"} gap={"1rem"}>
              <Text fontSize={"1.25rem"}>Created by: {createdBy.name}</Text>
              <Image height={"80px"} borderRadius={"50%"} src={createdBy.image} />
            </Box>
            <Button onClick={onOpen}>Edit event</Button>
            <Button onClick={handleDelete} colorScheme="red">
              Delete event
            </Button>
          </Stack>
        </CardBody>
      </Card>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box as={"form"}>
              <Stack height={"100%"} spacing={"0.5rem"}>
                <FormControl id="title" isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input variant={"filled"} name="title" value={formData.title} onChange={handleChange} />
                </FormControl>
                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Input variant={"filled"} name="description" value={formData.description} onChange={handleChange} />
                </FormControl>
                <FormControl id="image" isRequired>
                  <FormLabel>Image URL</FormLabel>
                  <Input variant={"filled"} name="image" value={formData.image} onChange={handleChange} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>User</FormLabel>
                  <Select
                    placeholder="Select user"
                    value={formData.createdBy}
                    onChange={(e) => handleUserChange(e.target.value)}>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Categories</FormLabel>
                  <Stack spacing={3}>
                    {categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        isChecked={formData.categoryIds.includes(category.id)}
                        onChange={() => handleCheckboxChange(category.id)}>
                        {category.name}
                      </Checkbox>
                    ))}
                  </Stack>
                  <FormHelperText>Choose a category</FormHelperText>
                </FormControl>
                <FormControl id="location" isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input variant={"filled"} name="location" value={formData.location} onChange={handleChange} />
                </FormControl>
                <FormControl id="startTime" isRequired>
                  <FormLabel>Start Time</FormLabel>
                  <Input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} />
                </FormControl>
                <FormControl id="endTime" isRequired>
                  <FormLabel>End Time</FormLabel>
                  <Input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} />
                </FormControl>
              </Stack>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleUpdate} variant="ghost">
              Confirm edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isCentered isOpen={isDeleteConfirmationOpen} onClose={onCloseDeleteConfirmation}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure you want to delete?</ModalHeader>
          <ModalCloseButton />
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseDeleteConfirmation}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDelete}>
              Confirm Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
