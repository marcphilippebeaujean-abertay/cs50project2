export const getLocalUserInformation = () => {
    return {
        'username': window.localStorage.getItem('username'),
        'userId': window.localStorage.getItem('userId')
    }
};