import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

// Created the auth context
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Error while registering a user
  const [registerError, setRegisterError] = useState(null);
  // Loading while registering a user
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  // Form information
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: ""
  });
  
  const [loginError, setloginError] = useState(null);
  // Loading while registering a user
  const [isloginLoading, setIsloginLoading] = useState(false);

    // Success message
  const [registerSuccess, setRegisterSuccess] = useState(null);

  const [loginInfo, setloginInfo] = useState({
    email: "",
    password: ""
  });

  console.log("loginInfo", loginInfo)

  useEffect(() => {
    const user = localStorage.getItem("User");

    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);

  const updateLoginInfo = useCallback((info) => {
    setloginInfo(info);
  }, []);

  // Registering a user
  const registerUser = useCallback(async (e) => {
    e.preventDefault();

    setIsRegisterLoading(true);
    setRegisterError(null);
    setRegisterSuccess(null);

      // Hardcoded invite code check
      const INVITE_CODE = '244466666';
      if (registerInfo.inviteCode !== INVITE_CODE) {
        setIsRegisterLoading(false);
        return setRegisterError('Invalid invite code');
      }

    const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));

    setIsRegisterLoading(false);

    // if (response.error) {
    //   return setRegisterError(response.error);
    // }

    if (response.error) {
        const errorMessage = response.error.message || response.error; // Handle different error formats
        return setRegisterError("Something went wrong !!",errorMessage);
      }

    localStorage.setItem("User", JSON.stringify(response));
    setUser(response);

    // Clear form fields and set success message
    setRegisterInfo({ name: "", email: "", password: "" });
    setRegisterSuccess("User registered successfully!");
  }, [registerInfo]);

    // login user
    const loginUser = useCallback(async(e) => {

      e.preventDefault();

      setIsloginLoading(true)
      setloginError(null)


      const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));

      setIsloginLoading(false)

      if (response.error) {
        const errorMessage = response.error.message || response.error; // Handle different error formats
        return setloginError("Something went wrong!!",errorMessage);
      }

      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
      
    }, [loginInfo]);

    // logout the user
    const logoutUser = useCallback(() => {
      localStorage.removeItem("User");
      setUser(null);
    }, []);

  return (
    // Provide all the context which we will be using for the auth context
    <AuthContext.Provider value={{
      user,
      registerInfo,
      updateRegisterInfo,
      registerUser,
      registerError,
      isRegisterLoading,
      registerSuccess,
      logoutUser,
      loginUser,
      loginError,
      loginInfo,
      isloginLoading,
      setloginInfo,
      updateLoginInfo
    }}>
      {children}
    </AuthContext.Provider>
  );
};
