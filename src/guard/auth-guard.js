import { useAccesoStore } from "../store/acceso_store";

const isAutenticatedGuard = async (to, from, next) => {
  const auth_store = useAccesoStore();
  const resp = await auth_store.checkToken();
  if (resp) {
    next();
  } else {
    window.localStorage.clear();
    window.location = "http://sistema.ieenayarit.org:9371/#/";
  }
};

export default isAutenticatedGuard;
