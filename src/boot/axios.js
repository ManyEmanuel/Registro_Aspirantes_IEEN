import { boot } from "quasar/wrappers";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: "http://sistema.ieenayarit.org:9470/api",
  //baseURL: "http://192.168.2.110:9370/api",
});
//const api = axios.create({ baseURL: "https://sistema.ieenayarit.org:9270/api" });
api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem("tokenE")}`,
  };
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      alert("Su sesión ha expirado, sera redireccionado al logín");
      window.localStorage.clear();
      window.location = "http://sistema.ieenayarit.org:9471?return=false";
      //window.location = "http://localhost:8080?return=false";
    }
    return Promise.reject(error);
  }
);
/*api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status == 401) {
      alert("Su sesión ha expirado, sera redireccionado al logín");
      localStorage.clear();
      window.location = "http://sistema.ieenayarit.org:9171?return=false";
    }
    return Promise.reject();
  }
);*/

export { api };
