import { boot } from "quasar/wrappers";
import axios from "axios";
import { EncryptStorage } from "storage-encryption";
// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const api = axios.create({
  //baseURL: "http://sistema.ieenayarit.org:9370/api",
  baseURL: "http://sistema.ieenayarit.org:9470/api",
  //http://ieen.ieenayarit.org:9470/
});
//const api = axios.create({ baseURL: "https://sistema.ieenayarit.org:9270/api" });
api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${encryptStorage.decrypt("tokenE")}`,
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
      //window.location = "http://sistema.ieenayarit.org:9471?return=false";
      window.location = "http://sistema.ieenayarit.org:9471/";
    }
    return Promise.reject(error);
  }
);

export { api };
