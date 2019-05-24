from flask import Flask, render_template, request, url_for, redirect, session, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit
from passlib.hash import sha256_crypt
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import string
import random
import os

app = Flask(__name__)
if __name__ is "__main__":
    app.run(debug=True)
# Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = 'secret_key'#os.urandom(24)
Session(app)
socketio = SocketIO(app)

# Configure DB
if not os.getenv('DATABASE_URI'):
    raise RuntimeError("DATABASE_URI is not set")
engine = create_engine(os.getenv('DATABASE_URI'))
db = scoped_session(sessionmaker(bind=engine))


def random_string(string_len=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_len))


@app.route('/')
def home():
    return redirect(url_for('login'))


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/login_user', methods=['POST'])
def login_user():
    if request.form.get('email') is None or request.form.get('email') is None:
        return jsonify({'success': False, 'respMessage': 'Invalid request'})
    req_user = db.execute('SELECT * FROM users WHERE email =:email', {
                  'email': request.form['email']}).fetchone()
    if req_user is None:
        return jsonify({'success': False, 'respMessage': 'Email or password did not match!'})
    else:
        if sha256_crypt.verify(request.form['password'], req_user.password):
            session['user_id'] = req_user.userid
            resp_dict = dict(redirect=url_for('user_view', userid=req_user.userid))
            resp_dict['success'] = True
            resp_dict['userId'] = req_user.userid
            resp_dict['username'] = req_user.username
            return jsonify(resp_dict)
        else:
            return jsonify({'success': False})


@app.route('/log_out', methods=['POST'])
def log_out_user():
    if session.get('user_id') is None:
        return jsonify({'success': False})
    else:
        session.pop('user_id')
    resp = dict(redirect=url_for('home'))
    resp['success'] = True
    return jsonify(resp)


@app.route('/register')
def register():
    return render_template('register_form.html')


@app.route('/user/<int:userid>')
def user_view(userid):
    return render_template('user_view.html')


@app.route('/add_user', methods=["POST"])
def register_user():
    sql_query = 'INSERT INTO users (username, password, email) '
    sql_query += 'SELECT :username, :password, :email '
    sql_query += 'WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = :username OR email = :email)'
    row_count = db.execute(sql_query, {
        'username': request.form['name'],
        'password': sha256_crypt.encrypt(request.form['password']),
        'email': request.form['email']}).rowcount
    db.commit()
    if row_count > 0:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'respMessage': 'Username or Email already in use!'})


@app.route('/add_chatroom', methods=['POST'])
def add_chat_room():
    if db.execute('SELECT * FROM chatrooms WHERE roomname =:roomName', {
                'roomName': request.form['roomName']}).fetchone() is not None:
        return jsonify({'success': False, 'respMessage': 'Not a unique chatroom name!'})
    else:
        session_user_id = session.get('user_id')
        if session_user_id is None:
            return jsonify({'success': False, 'respMessage': 'Strange user id!'})
        unique_id = None
        for i in range(5):
            new_id = random_string()
            if db.execute('SELECT * FROM chatrooms WHERE inviteid =:inviteid', {
                'inviteid': new_id}).fetchone() is None:
                unique_id = new_id
                break
        if unique_id is None:
            return jsonify({'success': False, 'respMessage': 'Could not generate unique invite code!'})
        chatroom_id = db.execute('INSERT INTO chatrooms (roomname, userid, inviteid) VALUES (:roomname, :userid, :inviteid) RETURNING chatroomid', {
                    'roomname': request.form['roomName'],
                    'userid': session_user_id,
                    'inviteid': unique_id
                    }).fetchone()[0]
        db.execute('INSERT INTO chatroomusers (userid, chatid) VALUES (:userid, :chatid)', {
            'userid': session_user_id,
            'chatid': chatroom_id
            })
        db.commit()
        return jsonify({
            'success': True,
            'respMessage': 'Generated new room with invite key {}'.format(unique_id),
            'room': {'roomName': request.form['roomName'],
                     'roomOwner': session_user_id,
                     'inviteKey': unique_id,
                     'roomId': chatroom_id}
            })


@app.route('/get_chatrooms', methods=['GET'])
def get_user_chatrooms():
    if session.get('user_id') is None:
        return redirect(url_for('home'))
    else:
        chatrooms = db.execute('SELECT * FROM chatrooms cr join chatroomusers cru on cru.chatid=cr.chatroomid AND cru.userid =:userid', {
                    'userid': session.get('user_id')}).fetchall()
        chatrooms_list = []
        for chatroom in chatrooms:
            chatrooms_list.append({
                'roomId': chatroom[0],
                'roomName': chatroom[1],
                'roomOwner': chatroom[3],
                'inviteKey': chatroom[2]
            })
        return jsonify({
            'chatrooms': chatrooms_list
        })


@app.route('/get_user_info', methods=['GET'])
def get_user_info():
    if session.get('user_id') is None or session.get('user_id') is '':
        resp = dict(redirect=url_for('home'))
        resp['success'] = False
        return jsonify(resp)
    user_info = db.execute('SELECT * FROM users WHERE userid =:userid', {
                'userid': session['user_id']}).fetchone()
    if user_info is None:
        return jsonify({'success': False})
    resp = dict(redirect=url_for('user_view', userid=user_info.userid))
    resp['success'] = True
    resp['userInfo'] = {
            'username': user_info['username'],
            'userid': user_info['userid']
        }
    return jsonify(resp)


@app.route('/delete_room', methods=['DELETE'])
def delete_room():
    if request.form.get('roomId') is None:
        return jsonify({'success': False, 'respMessage': 'Invalid request'})
    if request.form.get('userId') is None:
        return jsonify({'success': False, 'respMessage': 'Invalid request'})
    if session.get('user_id') is None:
        return jsonify({'success': False, 'respMessage': 'Log in for this action'})
    if int(session['user_id']) != int(request.form['userId']):
        return jsonify({'success': False, 'respMessage': 'No permission to delete this room'})
    db.execute('DELETE FROM chatrooms WHERE chatroomid =:chatroomid AND userid =:userid', {
        'chatroomid': request.form['roomId'],
        'userid': request.form.get('userId')
        })
    db.commit()
    return jsonify({
        'success': True,
        'roomId': request.form['roomId'],
        'roomName': request.form['roomName']
    })


@app.route('/remove_chat_user', methods=['DELETE'])
def remove_chat_user():
    if request.form.get('roomId') is None:
        return jsonify({'success': False})
    if session.get('user_id') is None:
        return jsonify({'success': False})
    chatuser = db.execute('SELECT * FROM chatroomusers WHERE userid =:userid AND chatid =:roomid', {
        'userid': session['user_id'],
        'roomid': request.form['roomId']}).fetchone()
    if chatuser is not None:
        db.execute('DELETE FROM chatroomusers WHERE userid =:userid AND chatid =:roomid', {
            'userid': session['user_id'],
            'roomid': request.form['roomId']})
        db.commit()
        return jsonify({
            'success': True,
            'roomName': request.form['roomName'],
            'roomId': request.form['roomId']})
    else:
        return jsonify({'success': False})


@app.route('/get_room_msgs', methods=['POST'])
def get_room_msgs():
    if session.get('user_id') is None:
        return jsonify({'success': False})
    # to check if user is in chatroom
    room_id = request.form['roomId']
    if room_id is None:
        return jsonify({'success': False, 'respMessage': 'Invalid room ID'})
    if db.execute('SELECT * FROM chatroomusers WHERE userid =:userid AND chatid =:roomid', {
        'userid': session.get('user_id'),
        'roomid': room_id}).fetchone() is None:
        return jsonify({ 'success': False, 'respMessage': 'User does not have permission to these messages or chatroom does not exist' })
    # Get all messages from a given chatroom
    msgs = db.execute('SELECT * FROM (SELECT *, ROW_NUMBER() OVER (ORDER BY timestamp) FROM messages WHERE chatroomid =:chatroomid) a WHERE row_number <= 30', {
                      'chatroomid': room_id}).fetchall()
    message_list = []
    for msg in msgs:
        message_list.append({
            'message': msg[1],
            'timestamp': msg[2],
            'username': msg[3]
        })
    return jsonify({
        'success': True,
        'messages': message_list
    })


@app.route('/join_chatroom', methods=['POST'])
def join_room():
    if session.get('user_id') is None:
        return jsonify({'success': False,
                        'respMessage': 'Not logged into session'})
    if request.form.get('inviteKey') is None:
        return jsonify({'success': False,
                       'respMessage': 'Invalid inite key'})
    room = db.execute('SELECT * FROM chatrooms WHERE inviteid =:invitekey',{
        'invitekey': request.form.get('inviteKey')
        }).fetchone()
    if room is None:
        return jsonify({
            'success': False,
            'respMessage': 'Key did not match any rooms'
        })
    else:
        sql_query = 'INSERT INTO chatroomusers (userid, chatid) '
        sql_query += 'SELECT :userid, :chatid '
        sql_query += 'WHERE NOT EXISTS (SELECT 1 FROM chatroomusers WHERE userid = :userid AND chatid = :chatid)'
        row_count = db.execute(sql_query, {
                    'userid': session.get('user_id'),
                    'chatid': room.chatroomid}).rowcount
        db.commit()
        if row_count > 0:
            return jsonify({
                'success': True,
                'room': {
                    'roomName': room.roomname,
                    'roomOwner': session.get('user_id'),
                    'inviteKey': request.form.get('inviteKey'),
                    'roomId': room.chatroomid
                }
            })
        else:
            return jsonify({
                'success': False,
                'respMessage': 'Already in room'
            })


@socketio.on('post message')
def add_new_msg(data):
    data['isPending'] = False
    sql_query = 'INSERT INTO messages (chatroomid, messagecontent, timestamp, sendername) '
    sql_query += 'SELECT :chatroomid, :messagecontent, :timestamp, :sendername '
    sql_query += 'WHERE EXISTS (SELECT 1 FROM chatrooms WHERE chatroomid = :chatroomid)'
    row_count = db.execute(sql_query, {
                'chatroomid': data['roomId'],
                'messagecontent': data['message'],
                'timestamp': data['timestamp'],
                'sendername': data['username']
                }).rowcount
    db.commit()
    if row_count > 0:
        emit('server message callback', data, broadcast=True)

