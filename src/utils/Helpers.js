import { showError } from "./Alert";

export const RE_DIGIT = new RegExp(/^\d+$/);

export const setToken = async (data) => {
  try {
    const accessToken = data;
    console.log(accessToken, "token");
    localStorage.setItem("axxToken", accessToken);
  } catch (error) {
    console.log("Could not set accessToken ", error.message);
  }
};

export const shortenXterLength = (string, number = 10) => {
  if (string) {
    if (string.length <= number) {
      return string;
    }
    return `${string.slice(0, number)}..`;
  }
  return "";
};

export const setFlow = async (data) => {
  try {
    localStorage.setItem("flow", data);
  } catch (error) {
    console.log("Could not set flow", error.message);
  }
};

export const retrieveFlow = () => {
  try {
    const data = localStorage.getItem("flow");
    return data;
  } catch (error) {
    console.log("Could not retrieve flow ", error.message);
    return null; // Handle the error as needed
  }
};

export const handleFirebaseError = (firebaseError) => {
  if (firebaseError.code && firebaseError.message) {
    const errorMessage = firebaseError.message;

    // Check if the message starts with the expected prefix
    if (errorMessage.startsWith("Firebase: Error (")) {
      // Extract the part after the prefix
      const startIndex = "Firebase: Error (".length;
      const endIndex = errorMessage.indexOf(")");
      showError(errorMessage.substring(startIndex, endIndex));
    } else {
      showError(errorMessage);
    }
  } else {
    showError("An unexpected error occurred.");
  }
};
