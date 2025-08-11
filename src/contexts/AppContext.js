import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { verifyToken } from '../utils/api';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  isAuthenticated: false,
  loading: true,
  error: null,
  employees: [],
  tasks: [],
  sidebarOpen: false,
};

export const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  DELETE_EMPLOYEE: 'DELETE_EMPLOYEE',
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_SIDEBAR: 'SET_SIDEBAR',
  VERIFY_TOKEN_SUCCESS: 'VERIFY_TOKEN_SUCCESS',
  VERIFY_TOKEN_FAILURE: 'VERIFY_TOKEN_FAILURE',
};

const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    // ... (other cases remain unchanged)
    case ActionTypes.VERIFY_TOKEN_SUCCESS:
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('role', action.payload.user.role);
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.user.role,
        isAuthenticated: true,
        loading: false,
      };
    case ActionTypes.VERIFY_TOKEN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        role: null,
        isAuthenticated: false,
        loading: false,
      };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    console.log("Initial token from localStorage:", localStorage.getItem('token'));
    const token = localStorage.getItem('token');
    if (token) {
      const checkToken = async () => {
        dispatch({ type: ActionTypes.SET_LOADING, payload: true });
        try {
          const response = await verifyToken(token);
          console.log("API Response on load:", await response.json());
          if (response.ok) {
            const data = await response.json();
            dispatch({
              type: ActionTypes.VERIFY_TOKEN_SUCCESS,
              payload: { user: data.user },
            });
          } else {
            throw new Error('Token verification failed');
          }
        } catch (error) {
          console.error("Token verification error:", error);
          dispatch({ type: ActionTypes.VERIFY_TOKEN_FAILURE });
          localStorage.removeItem('token');
          localStorage.removeItem('role');
        }
      };
      checkToken();
    } else {
      console.log("No token found, dispatching VERIFY_TOKEN_FAILURE");
      dispatch({ type: ActionTypes.VERIFY_TOKEN_FAILURE });
    }
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    console.log("Current State after update:", state);
  }, [state]);

  const actions = {
    setLoading: (loading) => dispatch({ type: ActionTypes.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ActionTypes.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ActionTypes.CLEAR_ERROR }),
    loginSuccess: (data) => {
      console.log("Login Success, storing token:", data.token);
      if (!data.token) {
        console.error("No token provided in loginSuccess data:", data);
        return;
      }
      try {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user', JSON.stringify(data.user));
        const storedToken = localStorage.getItem('token');
        console.log("Token after storage:", storedToken);
        dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: data });
      } catch (e) {
        console.error("Error storing token in localStorage:", e);
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
      dispatch({ type: ActionTypes.LOGOUT });
    },
    // ... (other actions remain unchanged)
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};