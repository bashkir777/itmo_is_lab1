export const Authentication = {
    Login: 'login',
    Register: 'register',
}

export const Role = {
    User: 'USER',
    Admin: 'ADMIN',
    UnauthorizedUser: 'UnauthorizedUser'
}

export const Pages = {
    List: 'List',
    CreateSpaceMarine: 'CreateSpaceMarine',
    Login: 'Login',
    Account: 'Account'
}


const AUTH_URL = '/api/v1/auth';
export const LOGIN_URL = AUTH_URL + '/login'
export const LOGOUT_URL = AUTH_URL + '/logout'
export const REGISTER_URL = AUTH_URL + '/register'
export const REFRESH_URL = AUTH_URL + '/refresh'

export const SPACE_MARINES_URL = '/api/v1/space-marines';
