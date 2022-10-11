import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, validate } from "../data/auth";
import { userLogin, userLogout } from "../redux/slices/userSlice";
import useLocalStorage from "./useLocalStorage";
import toast, { Toaster } from "react-hot-toast";

const useLogin = () => {
  const [user, setUser] = useLocalStorage("user", null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storeUser = (username: string, password: string) => {
    if (validate(username, password)) {
      const newUser = getUser(username);
      setUser(newUser);
      toast.success(newUser?.fullName + " has logged in successfully!");

      if (newUser) {
        dispatch(
          userLogin({
            id: newUser.id,
            username: newUser.fullName,
            role: newUser.role,
          })
        );
        navigate("/categories");
      }
      return newUser;
    }
    toast.error("Invalid Username or Password");
    dispatch(userLogout());
    setUser(null);
    return null;
  };

  return [user, storeUser];
};

export default useLogin;
