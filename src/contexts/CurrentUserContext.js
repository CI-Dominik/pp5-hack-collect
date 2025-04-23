import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from 'react-router';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';

export const CurrentUserContext = createContext()
export const SetCurrentUserContext = createContext()

export const useCurrentUser = () => useContext(CurrentUserContext)
export const useSetCurrentUser = () => useContext(SetCurrentUserContext)

// Provider for the homepage to get the currently logged-in user

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const history = useHistory();

  // Refresh authentication token

  const handleMount = async () => {
    try {
      const { data } = await axiosRes.get('dj-rest-auth/user/')
      setCurrentUser(data);
    } catch (error) {
      console.log("ERROR:", error)
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  // Add interceptor for requests

  useMemo(() => {
    axiosReq.interceptors.request.use(
      async (config) => {
        if (shouldRefreshToken()) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/")
          } catch (error) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/sign-in");
              }
              return null;
            });
            removeTokenTimestamp();
            return config;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add interceptor for responses

    axiosRes.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await axios.post("/dj-rest-auth/token/refresh/")
          } catch (error) {
            setCurrentUser((prevCurrentUser) => {
              if (prevCurrentUser) {
                history.push("/sign-in");
              }
              return null;
            });
            removeTokenTimestamp();
          }
          return axios(error.config);
        }
        return Promise.reject(error);
      }
    );
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  )
}