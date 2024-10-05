export const Authentication = {
    Login: 'login',
    Register: 'register',
    AdminRegister: 'admin-register',
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
    Account: 'Account',
    Applications: 'Applications'
}


const AUTH_URL = '/api/v1/auth';
export const LOGIN_URL = AUTH_URL + '/login'
export const LOGOUT_URL = AUTH_URL + '/logout'
export const REGISTER_URL = AUTH_URL + '/register'
export const REFRESH_URL = AUTH_URL + '/refresh'

export const ADMIN_APPLICATION_URL = AUTH_URL + '/admin-application'
export const ADMIN_APPLICATIONS = "/api/v1/admin-applications"
export const ACCEPT_APPLICATION = ADMIN_APPLICATIONS + "/accept"
export const REJECT_APPLICATION = ADMIN_APPLICATIONS + "/reject"

export const SPACE_MARINES_URL = '/api/v1/space-marines';

export const SPACE_MARINES_INFO_URL = '/api/v1/info/space-marines';
export const COORDINATES_INFO_URL = '/api/v1/info/coordinates';
export const CHAPTERS_INFO_URL = '/api/v1/info/chapters';
