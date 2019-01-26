export const getLocalUserInformation = () => {
    return {
        'username': window.localStorage.getItem('username'),
        'userid': parseInt(window.localStorage.getItem('userId'))
    }
};

export const getLocalRoomInformation = () => {
    return {
        'roomName': window.localStorage.getItem('roomName'),
        'roomId': window.localStorage.getItem('roomId'),
        'inviteKey': window.localStorage.getItem('inviteKey')
    }
};

export const updateLocalRoomInformation = (roomInfo) => {
    window.localStorage.setItem('roomName', roomInfo['roomName']);
    window.localStorage.setItem('roomId', roomInfo['roomId']);
    window.localStorage.setItem('inviteKey', roomInfo['inviteKey']);
};