
export interface IUserCredentials {
    username: string,
    password: string
}

export interface ILogInResponse {
    access_token: string
}

export interface ISlackUser {
    userID: string,
    username: string,
    userAvatar: string
}