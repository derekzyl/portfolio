/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import {
  getLocalAuthData,
  setRedirectUrl,
} from "../../components/utilities/utils";
import { BASE_URL, tokenHeader } from "../config";
import {
  resetAuthData
} from "../slices/branded/auth/auth-slices/auth.slice";

// import BASE_URL, { tokenHeader } from "../config";
// import { resetAuthData, updateToken } from "../slices/auth.data";

export const whiteList = [
  "guestLogin",
  "login",
  "loginStaff",
  "register",
  "verifyEmail",
  "sendLoginMagicLink",
  "sendRegMagicLink",
  "checkEmail",
  "checkMagicTokenValid",
  "getGoogleAuthConfig",
  "getGithubAuthConfig",
  "getSMTPStatus",
  "getLoginConfig",
  "getServerVersion",
  "getServer",
  "getOpenid",
  "getMetamaskNonce",
  "checkIfEmailExists",
  "refresh",
  "getInitialized",
  "createAdmin",
  "getBotRelatedChannels",
  "sendMessageByBot",
  "getAgoraVoicingList",
  "preCheckFileFromUrl",
];
const whiteList401 = ["login", "refresh", "verify", "loginStaff"];
const errorWhiteList = ["preCheckFileFromUrl", "getFavoriteDetails"];
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { endpoint }) => {
    const { token } = getLocalAuthData();
    // const { token } = (getState() as RootState).authData;

    if (token && !whiteList.includes(endpoint)) {
      headers.set(tokenHeader, `bearer ${token}`);
    }
    return headers;
  },
});

let waitingForRenew: null | any = null;
setRedirectUrl(window.location.pathname);
const baseQueryWithTokenCheck = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  if (waitingForRenew) {
    await waitingForRenew;
  }

  const { refreshToken, expireTime, refreshExpireTime } = getLocalAuthData();

  let result = null;

  if (!whiteList.includes(api.endpoint) && dayjs().isAfter(dayjs(expireTime))) {
        // location.href = "/login";

    waitingForRenew = baseQuery(
      {
        url: "/auth/refresh-tokensdd",
        method: "POST",
        body: {
          refreshToken: refreshToken,
        },
      },
      api,
      extraOptions
    );
    result = await waitingForRenew;

    waitingForRenew = null;
    // if (result && result.data && result.data.tokens) {
    //   // store the new token
    //   api.dispatch(updateToken(result.data));
    //   // retry the initial query
    //   result = await baseQuery(args, api, extraOptions);
    // }
  } else if (
    !whiteList.includes(api.endpoint) &&
    dayjs().isAfter(dayjs(refreshExpireTime))
  ) {
    {
      // 证书错误
      if (api.endpoint !== "login" || api.endpoint !== "loginStaff") {
        // 退出登录
        api.dispatch(resetAuthData());
        setRedirectUrl(window.location.pathname);
        location.href = "/login";
      }
    }
  } else {
    result = await baseQuery(args, api, extraOptions);
  }
  if (result?.error) {
    console.error("api error", result.error, args, api.endpoint);
    if (errorWhiteList.includes(api.endpoint)) return result;
    switch (result.error?.originalStatus || result.error?.status) {
      case "FETCH_ERROR":
        {
          // toast.error(`${api.endpoint}: Failed to fetch`);
        }
        break;
      case 400:{
        //console.log(result?.error?.data, "bad request");


let message = "Bad Request";
  if (typeof result.error?.data ==='string') {
            message = result.error.data;

          }
          if (typeof result.error?.data ==='object' && typeof  result.error?.data?.message==='string') {
            message = result.error.data.message;
          }
          // toast.error(message);
        





        toast.error(message);}
        break;
      case 401:
        {
          if (whiteList401.includes(api.endpoint)) {
            toast.error("un authorized access");
            return;
          }
          if (api.endpoint !== "login" || api.endpoint !== "loginStaff") {
            setRedirectUrl(window.location.pathname);
            // api.dispatch(resetAuthData());
            // location.href = "/login";
            // toast.error("API Not Authenticated");
            return;
          }
        }
        break;
      case 403:
        {
          const whiteList403 = ["sendMsg"];
          if (!whiteList403.includes(api.endpoint)) {
            // toast.error("Request Not Allowed");
          }
        }

        break;
      case 404:
        {
          const whiteList404 = [
            "login",
            "loginStaff",
            "getArchiveMessage",
            "preCheckFileFromUrl",
            "deleteMessage",
            "deleteMessages",
          ];
          if (!whiteList404.includes(api.endpoint)) {
            toast.error("Request Not Found");
          }
        }
        break;
      case 413:
        {
          toast.error("File size too large");
        }
        break;
      case 451:
        {
          // 证书错误
          if (api.endpoint !== "login" || api.endpoint !== "loginStaff") {
            // 退出登录
            api.dispatch(resetAuthData());
            setRedirectUrl(window.location.pathname);
            location.href = "/login";
          }
          toast.error(result?.error?.data || "License Error");
        }
        break;
      case 500:
      case 503:
        {
          let message = "Server Error";
          if (typeof result.error?.data ==='string') {
            message = result.error.data;

          }
          if (typeof result.error?.data ==='object' && typeof  result.error?.data?.message==='string') {
            message = result.error.data.message;
          }
          toast.error(message);
        }
        break;

      default:
        break;
    }
  }
  return result;
};

export default baseQueryWithTokenCheck;
/* The above code is a TypeScript file that defines a base query function for making API requests with
authentication token handling. Here is a summary of what the code is doing: */
 
// import { fetchBaseQuery } from "@reduxjs/toolkit/query";
// import dayjs from "dayjs";
// import toast from "react-hot-toast";
// import {
//   getLocalAuthData,
//   setRedirectUrl,
// } from "../../components/utilities/utils";
// import { BASE_URL, tokenHeader } from "../config";
// import { resetAuthData } from "../slices/branded/auth/auth-slices/auth.slice";

// export const whiteList = [
//   "guestLogin",
//   "login",
//   "loginStaff",
//   "register",
//   "verifyEmail",
//   "sendLoginMagicLink",
//   "sendRegMagicLink",
//   "checkEmail",
//   "checkMagicTokenValid",
//   "getGoogleAuthConfig",
//   "getGithubAuthConfig",
//   "getSMTPStatus",
//   "getLoginConfig",
//   "getServerVersion",
//   "getServer",
//   "getOpenid",
//   "getMetamaskNonce",
//   "checkIfEmailExists",
//   "getInitialized",
//   "createAdmin",
//   "getBotRelatedChannels",
//   "sendMessageByBot",
//   "getAgoraVoicingList",
//   "preCheckFileFromUrl",
// ];
// const whiteList401 = ["login", "verify", "loginStaff"];
// const errorWhiteList = ["preCheckFileFromUrl", "getFavoriteDetails"];

// const baseQuery = fetchBaseQuery({
//   baseUrl: BASE_URL,
//   prepareHeaders: (headers, { endpoint }) => {
//     const { token } = getLocalAuthData();

//     if (token && !whiteList.includes(endpoint)) {
//       headers.set(tokenHeader, `bearer ${token}`);
//     }
//     return headers;
//   },
// });

// setRedirectUrl(window.location.pathname);

// const baseQueryWithTokenCheck = async (
//   args: any,
//   api: any,
//   extraOptions: any
// ) => {
//   const { expireTime } = getLocalAuthData();

//   // Check if access token is expired
//   if (!whiteList.includes(api.endpoint) && dayjs().isAfter(dayjs(expireTime))) {
//     // Token is expired, redirect to login
//     api.dispatch(resetAuthData());
//     setRedirectUrl(window.location.pathname);
//     location.href = "/login";
//     return;
//   }

//   const result = await baseQuery(args, api, extraOptions);

//   if (result?.error) {
//     console.error("api error", result.error, args, api.endpoint);
//     if (errorWhiteList.includes(api.endpoint)) return result;
    
//     switch (result.error?.status) {
//       case "FETCH_ERROR": {
//         toast.error(`${api.endpoint}: Failed to fetch`);
//         break;
//       }
//       case 400: {
//         let message = "Bad Request";
//         if (typeof result.error?.data === 'string') {
//           message = result.error.data;
//         }
//         if (typeof result.error?.data === 'object' && typeof (result.error?.data as any)?.message === 'string') {
//           message = (result.error.data as any)?.message;
//         }
//         toast.error(message);
//         break;
//       }
//       case 401: {
//         if (whiteList401.includes(api.endpoint)) {
//           toast.error("un authorized access");
//           return;
//         }
//         if (api.endpoint !== "login" || api.endpoint !== "loginStaff") {
//           setRedirectUrl(window.location.pathname);
//           api.dispatch(resetAuthData());
//           location.href = "/login";
//           return;
//         }
//         break;
//       }
//       case 403: {
//         const whiteList403 = ["sendMsg"];
//         if (!whiteList403.includes(api.endpoint)) {
//           toast.error("Request Not Allowed");
//         }
//         break;
//       }
//       case 404: {
//         const whiteList404 = [
//           "login",
//           "loginStaff",
//           "getArchiveMessage",
//           "preCheckFileFromUrl",
//           "deleteMessage",
//           "deleteMessages",
//         ];
//         if (!whiteList404.includes(api.endpoint)) {
//           toast.error("Request Not Found");
//         }
//         break;
//       }
//       case 413: {
//         toast.error("File size too large");
//         break;
//       }
//       case 451: {
//         if (api.endpoint !== "login" || api.endpoint !== "loginStaff") {
//           api.dispatch(resetAuthData());
//           setRedirectUrl(window.location.pathname);
//           location.href = "/login";
//         }
//         toast.error(result?.error?.data? (result?.error as any)?.data:  "License Error");
//         break;
//       }
//       case 500:
//       case 503: {
//         let message = "Server Error";
//         if (typeof result.error?.data === 'string') {
//           message = result.error.data;
//         }
//         if (typeof result.error?.data === 'object' && typeof (result.error?.data as any)?.message === 'string') {
//           message = (result.error.data as any).message;
//         }
//         toast.error(message);
//         break;
//       }
//       default:
//         break;
//     }
//   }
//   return result;
// };

// export default baseQueryWithTokenCheck;