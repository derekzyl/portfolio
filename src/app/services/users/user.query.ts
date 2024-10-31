import { createApi } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { RegisterDataI } from "../../slices/branded/auth/auth-types/auth.types";
import { addUser } from "../../slices/branded/user/user.slice";
import { UserI } from "../../slices/branded/user/user.types";
import { closeDeleteModal } from "../../slices/modal/modal.types";
import { setClickCount } from "../../slices/tableDataActions/table-data-actions.types";
import baseQueryWithTokenCheck from "../base.query";

export const userApi = createApi({
  baseQuery: baseQueryWithTokenCheck,
  reducerPath: "userApi",
  endpoints: (builder) => ({
    getUsers: builder.query<UserI[], void>({
      query: () => ({
        url: "/users",
      }),
      async onQueryStarted(_data, { dispatch, queryFulfilled }) {
        try {
          const { data: users } = await queryFulfilled;
          //console.log("users", users);
          dispatch(addUser(users));
        } catch (e) {
          //console.log("error fetching user", e);
        }
      },
    }),
    getUser: builder.query<UserI, string>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      // async onQueryStarted(_data, { queryFulfilled }) {
      //   try {
      //     // const {  } = queryFulfilled;
      //     // //console.log(dat);
      //   } catch (e) {
      //     //console.log(e);
      //   }
      // },
    }),
    addUser: builder.mutation<UserI, RegisterDataI>({
      query: (data) => ({
        url: "/users",
        body: { ...data, role: "04c20cd1428aa816478936df60d5aca5" },
        method: "POST",
      }),
    }),
    updateUser: builder.mutation<
      UserI,
      Partial<RegisterDataI & { id: string }>
    >({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteUser: builder.query<void, string>({
      query: (id) => {
        return {
          url: `/users/${id}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(_data, { queryFulfilled, dispatch }) {
        try {
          dispatch(setClickCount(1)); // Assuming this is used for disabling the button

          const { meta } = await queryFulfilled;
          if (meta.response.status === 204) {
            toast.success("User deleted successfully");
            // dispatch(setClickCount(0)); // Re-enable the button
            // window.location.reload();
          }
          dispatch(closeDeleteModal());
        } catch (e) {
          //console.log(e);
          dispatch(closeDeleteModal());
        }
      },
    }),
  }),
});

export const {
  useAddUserMutation,
  useLazyDeleteUserQuery,
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useLazyGetUserQuery,
} = userApi;
