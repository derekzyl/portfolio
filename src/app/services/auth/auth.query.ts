/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { getLocalAuthData } from "../../../components/utilities/utils";
import {
  isEmailSent,
  setAuthData,
} from "../../slices/branded/auth/auth-slices/auth.slice";
import {
  AuthPayloadI,
  LoginDataI,
  RefreshTokenI,
  RegisterDataI,
  forgotPasswordI,
  resetPasswordI,
} from "../../slices/branded/auth/auth-types/auth.types";
import baseQueryWithTokenCheck from "../base.query";

export const authApi = createApi({
  baseQuery: baseQueryWithTokenCheck,
  reducerPath: "authApi",

  endpoints: (builder) => ({
    login: builder.mutation<AuthPayloadI, LoginDataI>({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(setAuthData(data));
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),

    register: builder.mutation<AuthPayloadI, RegisterDataI>({
      query: (data) => ({
        url: "auth/register",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data) dispatch(setAuthData(data));
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        body: {
          refreshToken: getLocalAuthData().refreshToken,
        },
      }),
      transformResponse: (response) => {
        return response;
      },

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data)
            dispatch(
              setAuthData({
                ...data,
                refreshToken: data.refresh,
                token: data.access,
              })
            );
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loginStaff: builder.mutation<AuthPayloadI, LoginDataI>({
      query: (data) => ({
        // url: "/staffs/staff/login",
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) dispatch(setAuthData(data));
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    refresh: builder.mutation<AuthPayloadI, RefreshTokenI>({
      query: (data) => ({
        url: "/auth/refresh-tokens",
        method: "POST",
        data,
      }),
      transformResponse: (response) => response.data,

      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data)
            dispatch(
              setAuthData({
                ...data,
              })
            );
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    forgotPassword: builder.mutation<null, forgotPasswordI>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        data,
      }),
      transformResponse: (response) => response.data,

      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) toast.success("Email sent");
          // dispatch(
          //   setAuthData({
          //     ...data,
          //   })
          // );
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    resetPassword: builder.query<null, resetPasswordI>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        data,
      }),
      transformResponse: (response) => response.data,

      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data) toast.success("Password changed successfully");
          // dispatch(
          //   setAuthData({
          //     ...data,
          //   }
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    verifyEmail: builder.mutation<null, string>({
      query: (data) => ({
        url: `/auth/verify-email?token=${data}`,
        method: "POST",
      }),
      transformResponse: (response) => response,

      async onQueryStarted(_args, { queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;
          if (meta?.response?.status === 204) {
            toast.success(
              "hey Champ, email is successfully verified. You can now login",
              { duration: 5000 }
            );
          }
          if (data) toast.success("Email verified");
          // dispatch(
          //   setAuthData({
          //     ...data,
          //   }
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    checkIfEmailExists: builder.mutation<boolean, { email: string }>({
      query: (data) => ({
        url: `/auth/check-email-existence`,
        method: "POST",
        body: data,
      }),
    }),
    sendVerifyEmail: builder.mutation<string, void>({
      query: () => ({
        url: "/auth/send-verification-email",
        method: "POST",
      }),

      async onQueryStarted(_args, { queryFulfilled, dispatch }) {
        try {
          const { data, meta } = await queryFulfilled;
          console.log(data, meta, "send verify email");
          if (meta?.response?.status === 204) {
            dispatch(isEmailSent(true));
            toast.success(
              "hey Champ, email has successfully been sent to your mail"
            );
            dispatch(isEmailSent(true));
          }
          // dispatch(
          //   setAuthData({
          //     ...data,
          //   }
          // localStorage.setItem("token", data.token);
        } catch (error) {
          console.log(error);
        }
      },
    }),
    testAuth0: builder.query<any, void>({
      query: () => ({
        url: "/auth/test-auth",
        method: "GET",
      }),
    })
    

  }),
});

export const {
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useRegisterMutation,
  useResetPasswordQuery,
  useVerifyEmailMutation,
  useSendVerifyEmailMutation,
  useCheckIfEmailExistsMutation,
  useLoginStaffMutation,useTestAuth0Query
} = authApi;
