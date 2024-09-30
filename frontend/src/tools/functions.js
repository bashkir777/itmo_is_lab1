
import { REFRESH_URL } from "./consts";


export const asyncPostRequest = async (body, URL) => fetch(URL, {
    method: "POST",
    body: JSON.stringify({
        ...body,
    }),
    headers: {
        "Content-Type": "application/json"
    }
})

export const decodeJwtToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


export const isJwtTokenExpired = (token) => {
    const decodedToken = decodeJwtToken(token);
    const expirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();
    return currentTime > expirationTime;
};

const cleanUp = (setAccessToken, setRefreshToken, setAuthenticated, setRole) => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    setAccessToken('');
    setRefreshToken('');
    setRole('');
    setAuthenticated(false);
}

export const updateTokensOrLogout = async (setAccessToken, setRefreshToken, setAuthenticated, setRole) => {
    let localRefreshToken = localStorage.getItem("refreshToken");

    if (localRefreshToken !== undefined && localRefreshToken !== null) {

        if (!isJwtTokenExpired(localRefreshToken)) {
            asyncPostRequest({refreshToken: localRefreshToken}, REFRESH_URL).then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    cleanUp(setAccessToken, setRefreshToken, setAuthenticated, setRole);
                    throw new Error("Не удалось обновить access token");
                }
            }).then(data => {
                localStorage.setItem("accessToken", data.accessToken);
                setAccessToken(data.accessToken);
                setRefreshToken(localRefreshToken);
                setAuthenticated(true);
            });
        } else {
            cleanUp(setAccessToken, setRefreshToken, setAuthenticated, setRole);
        }
    }
}
