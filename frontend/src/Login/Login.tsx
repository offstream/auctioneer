import type { AxiosError } from "axios";
import React, { useEffect, useReducer } from "react";
import { useForm } from "react-hook-form";

import { login } from "../shared/authService";
import styles from "./Login.module.scss";

type LoginFormData = {
  username: string;
  password: string;
};

type LoginState = {
  status: string;
  submittedData: Partial<LoginFormData>;
  formError: string;
};

type LoginEvent =
  | { type: "SUBMIT"; submittedData: LoginFormData }
  | { type: "CLEAR_FORM_ERROR" }
  | { type: "RESOLVE" }
  | { type: "REJECT"; error: AxiosError };

const getApiRequesErrorMessage = (error?: AxiosError): string => {
  const DEFAULT_ERROR_MESSAGE = "There was an error";
  if (!error) return DEFAULT_ERROR_MESSAGE;
  // TODO: fix generic error message
  const { response, message } = error;
  return response ? response.data?.detail ?? DEFAULT_ERROR_MESSAGE : message;
};

const loginReducer = (state: LoginState, event: LoginEvent): LoginState => {
  switch (state.status) {
    case "idle":
      switch (event.type) {
        case "SUBMIT":
          return {
            ...state,
            status: "loading",
            submittedData: event.submittedData,
            formError: "",
          };
        case "CLEAR_FORM_ERROR":
          if (state.formError) {
            return { ...state, formError: "" };
          }
          break;
      }
      break;
    case "loading":
      switch (event.type) {
        case "RESOLVE":
          return { ...state, status: "success" };
        case "REJECT":
          return {
            ...state,
            status: "idle",
            formError: getApiRequesErrorMessage(event.error),
          };
      }
      break;
  }
  return state;
};

const initialLoginState: LoginState = {
  status: "idle",
  submittedData: {},
  formError: "",
};

const Login: React.FC = () => {
  const { register, handleSubmit, errors, reset } = useForm<LoginFormData>({
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const [{ status, formError, submittedData }, dispatch] = useReducer(
    loginReducer,
    initialLoginState,
  );

  const onSubmit = async (data: LoginFormData) => {
    dispatch({ type: "SUBMIT", submittedData: data });
    if (status === "idle") {
      login(data)
        .then(() => dispatch({ type: "RESOLVE" }))
        .catch(error => dispatch({ type: "REJECT", error }));
    }
  };

  useEffect(() => {
    if (status === "idle") {
      reset({ username: submittedData?.username ?? "" });
    }
    if (status === "success") {
      // to redirect or not to redirect?
      // react router is already handling this on rerender
    }
  }, [status, submittedData, reset]);

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit(onSubmit, () => {
          dispatch({ type: "CLEAR_FORM_ERROR" });
        })}
        className={styles.form}
      >
        {!!formError && <span className={styles.error}>{formError}</span>}
        <div className={styles.input_group}>
          <label htmlFor='username'>USERNAME</label>
          <input
            type='text'
            name='username'
            id='username'
            ref={register({ required: "Please enter your username" })}
          />
          {errors.username && (
            <span className={styles.error}>{errors.username.message}</span>
          )}
        </div>
        <div className={styles.input_group}>
          <label htmlFor='password'>PASSWORD</label>
          <input
            type='password'
            name='password'
            id='password'
            ref={register({
              required: "Please enter your password",
              minLength: {
                value: 8,
                message: "Passwords are at least 8 characters long",
              },
            })}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>
        <input
          type='submit'
          value='Login'
          disabled={status === "loading"}
          className={styles.button}
        />
      </form>
    </div>
  );
};

export const LOGIN_ROUTE = {
  path: "login",
  element: <Login />,
};
