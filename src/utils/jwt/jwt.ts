import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = <T extends { exp: number }>(
  token: string | null,
) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode<T>(token);
    const currentTime = Date.now() / 1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

export const decodeToken = <T extends object>(token: string) => {
  try {
    return jwtDecode<T>(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
