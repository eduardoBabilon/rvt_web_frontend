import { AxiosInstance } from "axios";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "@/authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

export function withAuthInstance(request: AxiosInstance) {
  request.interceptors.request.use((config) => {
    const token = localStorage.getItem("idToken");
    const isDev = process.env.NODE_ENV === "development";

    if (isDev) {
      const account = msalInstance.getAllAccounts()[0];
      if (account) {
        config.headers["X-User-Email"] = account.username;
        config.headers["X-User-Name"] = account.name;
      }
    } else if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  });
}