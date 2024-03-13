import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Checkbox,
  FormHelperText,
  useToast,
  Select,
  Button,
  Center,
} from "@chakra-ui/react";

export const Loader = async ({ params }) => {
  const users = await fetch(`http://localhost:3000/users`);
  const categories = await fetch(`http://localhost:3000/categories`);

  return {
    users: await users.json(),
    categories: await categories.json(),
  };
};

export const NewEvent = () => {
  const { users, categories } = useLoaderData();
  const toast = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: Math.floor(Math.random() * 100000),
    createdBy: "",
    title: "",
    description: "",
    image: "",
    categoryIds: [],
    location: "",
    startTime: "",
    endTime: "",
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.categoryIds.length === 0) {
        throw new Error(
          toast({
            title: "An error occurred",
            description: "Failed to create event select a category",
            status: "error",
            duration: 5000,
            isClosable: true,
          })
        );
      }

      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Event created",
          description: "Your event has been successfully created!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
        setFormData({
          id: Math.floor(Math.random() * 100000),
          createdBy: "",
          title: "",
          description: "",
          image: "",
          categoryIds: [],
          location: "",
          startTime: "",
          endTime: "",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error.message);
      toast({
        title: "An error occurred",
        description: "Failed to create event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center height={"100vh"} backgroundColor={"gray.400"}>
      <Box
        as="form"
        marginTop={"2rem"}
        onSubmit={handleSubmit}
        height={"100%"}
        display={"flex"}
        justifyContent={"center"}
        minWidth={"100%"}
        padding={"0 1rem 0 1rem"}>
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
          <Button marginTop={"1rem"} width={"lg"} type="submit" colorScheme="teal" mt={4}>
            Create Event
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
