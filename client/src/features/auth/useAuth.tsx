import { useContext } from "react";
import { AuthContext } from "./AuthContext";

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Missing Auth Context");
  }

  return context;
}

export default useAuth;
