import { useDispatch } from "react-redux";
import { getUser, validate } from "../data/auth";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import useLocalStorage from "./useLocalStorage";

const useLogin = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const dispatch = useDispatch();
  const storeUser = (username: string, password: string, flag: boolean) => {
    if (validate(username, password)) {
      const newUser = getUser(username);
      if (flag) {
        setUser(newUser);
      }
      if (newUser) {
        dispatch(
          userLogin({
            id: newUser.id,
            name: newUser.fullName,
            role: newUser.role,
          })
        );
      }
      return newUser;
    }
    dispatch(userLogout());
    setUser(null);
    return null;
  };

  return [user, storeUser];
};

export default useLogin;
