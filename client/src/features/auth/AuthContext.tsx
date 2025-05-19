import {
  Profile,
  useLazyGetProfileQuery,
  useLogoutMutation,
  useSignInMutation,
} from "@/services/apis/auth/auth.api";
import {
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from "@/services/util/token.util";
import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "../routes";
import { CustomError } from "@/services/config/api.model";
import { SerializedError } from "@reduxjs/toolkit";

interface AuthContextType {
  isAuthenticated: boolean;
  profile?: Profile;
  sigIn: {
    request: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    isSuccess: boolean;
    error?: CustomError | SerializedError;
  };
  logout: {
    request: () => Promise<void>;
    isLoading: boolean;
    isSuccess: boolean;
    error?: CustomError | SerializedError;
  };
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [sigInRequest, sigInStatus] = useSignInMutation();
  const [logoutRequest, logoutStatus] = useLogoutMutation();
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    setIsLoading(true);
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    getProfile()
      .then((resp) => {
        setProfile(resp.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      const ignore = PUBLIC_ROUTES.map((x) => `/${x.path}`).includes(
        location.pathname
      );
      if (ignore) {
        return;
      }

      navigate("/login", { replace: true });
    }
  }, [isLoading, isAuthenticated, location.pathname]);

  const sigIn = async (email: string, password: string) => {
    sigInRequest({
      login: email,
      password,
    }).then((res) => {
      if (!res.data) {
        throw new Error("Login failed");
      }
      const { accessToken, refreshToken } = res.data;
      saveAccessToken(accessToken);
      saveRefreshToken(refreshToken);
      setIsAuthenticated(true);
    });
  };

  const logout = async () => {
    logoutRequest()
      .then(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        removeAccessToken();
        removeRefreshToken();
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        sigIn: {
          request: sigIn,
          ...sigInStatus,
        },
        logout: {
          request: logout,
          ...logoutStatus,
        },
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
