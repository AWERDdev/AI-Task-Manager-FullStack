import { useState } from "react";
import config from '../Config';

/**
 * Title validation function
 * @param {string} Title - Title to validate
 * @returns {boolean} Whether the title is valid
 */
export const isValidTitle = (Title) => {
  return Title && Title.trim().length > 0;
};

/**
 * Description validation function
 * @param {string} Description - Description to validate
 * @returns {boolean} Whether the description is valid
 */
export const isValidDescription = (Description) => {
  return Description && Description.trim().length > 0;
};

/**
 * Type validation function
 * @param {string} Type - Type to validate
 * @returns {boolean} Whether the type is valid
 */
export const isValidType = (Type) => {
  return Type && Type.trim().length > 0;
};

/**
 * Priority validation function
 * @param {string} Priority - Priority to validate
 * @returns {boolean} Whether the priority is valid
 */
export const isValidPriority = (Priority) => {
  return Priority && Priority.trim().length > 0;
};

/**
 * Due date validation function
 * @param {string} Due - Due date to validate
 * @returns {boolean} Whether the due date is valid
 */
export const isValidDue = (Due) => {
  return Due && Due.trim().length > 0;
};

/**
 * Form validation hook for task creation
 * @returns {Object} Form state and validation functions
 */
export const useTaskFormValidation = () => {
  const [Title, setTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [Priority, setPriority] = useState("");
  const [Type, setType] = useState("");
  const [Due, setDue] = useState("");
  const [Task, setTask] = useState({});

  const validateForm = () => {
    let newErrors = {};
    
    if (!isValidTitle(Title)) {
      newErrors.title = "Title is required";
    }
    
    if (!isValidDescription(Description)) {
      newErrors.description = "Description is required";
    }
    
    if (!isValidPriority(Priority)) {
      newErrors.Priority = "Priority is required";
    }

    if (!isValidType(Type)) {
      newErrors.Type = "Type is required";
    }

    if (!isValidDue(Due)) {
      newErrors.Due = "Due is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  return {
    Title,
    setTitle,
    Description,
    setDescription,
    errors,
    setErrors,
    validateForm,
    setPriority,
    setType,
    Priority,
    Type,
    setTask,
    Task,
    setDue,
    Due
  };
};

/**
 * Send task creation data to the server
 * @param {string} Title - Task title
 * @param {string} Description - Task description
 * @param {string} Priority - Task priority
 * @param {string} Type - Task type
 * @param {string} Due - Task due date
 * @returns {Promise<Object>} Result of the task creation attempt
 */
export const sendTaskData = async (Title, Description, Priority, Type, Due) => {
  try {
    if (config.enableDebugMode) {
      console.log("Sending task data:", { Title, Description, Priority, Type, Due });
    }
    
    const userData = JSON.parse(localStorage.getItem("user"));
    const response = await fetch(`${config.nodeApiUrl}/api/CreateTask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Title, Description, Priority, Type, Due, userData }),
    });
    
    const data = await response.json();
    
    if (config.enableDebugMode) {
      console.log("Server Response:", data);
    }
    
    if (response.ok) {
      return { success: true };
    } else {
      return { success: false, message: data.message, status: response.status };
    }
  } catch (error) {
    console.error(`Network Error: ${error}`);
    return { success: false, message: "Network error", status: 500 };
  }
};

/**
 * Handle task creation error responses
 * @param {Object} result - API response result
 * @returns {Object} Formatted errors
 */
export const handleTaskErrors = (result) => {
  let newErrors = {};
  
  if (result.status === 400) {
    newErrors.title = result.message || "Invalid input. Please check your details.";
    newErrors.description = "";
  } else if (result.status === 404) {
    newErrors.title = result.message || "Task not found.";
  } else if (result.status === 401) {
    newErrors.description = result.message || "Unauthorized action.";
  } else if (result.status === 409) {
    newErrors.title = result.message || "There is already an existing Task with the same Title";
  } else {
    newErrors.title = "Something went wrong. Please try again later.";
    newErrors.description = "";
  }
  
  return newErrors;
};
