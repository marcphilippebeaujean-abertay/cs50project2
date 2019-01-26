export const getLocalUserInformation = () => {
    console.log(window.localStorage.getItem('username'));
    return {
        'username': window.localStorage.getItem('username'),
        'userId': window.localStorage.getItem('userId')
    }
};