// Stub
export function getHash(data: string): string {
    return data
}

export function getCurrentJWT(): string {
    return window.localStorage.getItem('accessToken') || ""
}

// Backend await JWT as bearer token, i.e. request headers must contain {"Authorization": "Bearer {JWT}"}
export function getAuthToken(): string {
    return "Bearer " + getCurrentJWT()
}

export function parseJwt (token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
