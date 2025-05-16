// Access token management functions
export const getAccessToken = () => {
  return sessionStorage.getItem("access_token");
};

export const saveAccessToken = (value: string) => {
  return sessionStorage.setItem("access_token", value);
};

export const removeAccessToken = () => {
  return sessionStorage.removeItem("access_token");
};

// Refresh token management functions
export const getRefreshToken = () => {
  return localStorage.getItem("refresh_token");
};

export const saveRefreshToken = (value: string) => {
  return localStorage.setItem("refresh_token", value);
};

export const removeRefreshToken = () => {
  return localStorage.removeItem("refresh_token");
};
