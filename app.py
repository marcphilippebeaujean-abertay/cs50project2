from flask import Flask, render_template, request, url_for, redirect, session, jsonify
from flask_session import Session
from flask_socketio import SocketIO, emit
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
import string
import random
import os

# Configure DB
if not os.getenv('DATABASE_URI'):
    raise RuntimeError("DATABASE_URI is not set")
engine = create_engine(os.getenv('DATABASE_URI'))
db = scoped_session(sessionmaker(bind=engine))

app = Flask(__name__)
# Configure session
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SECRET_KEY"] = 'secret!'
Session(app)
socketio = SocketIO(app)


def random_string(string_len=10):
    """Generate a random string of fixed length """
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(string_len))


@app.route('/')
def home():
    if session.get('user_id') is None:
        return redirect(url_for('login'))
    return redirect(url_for('user_view', userid=session.get('user_id')))


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/login_user', methods=['POST'])
def login_user():
    req_user = db.execute('SELECT * FROM users WHERE email =:email AND password =:password', {
                  'email': request.form['email'],
                  'password': request.form['password']}).fetchone()
    if req_user is None:
        return jsonify({'success': False, 'respMessage': 'Email or password did not match!'})
    else:
        session['user_id'] = req_user.userid
        return jsonify(dict(redirect=url_for('user_view', userid=req_user.userid)))


@app.route('/log_out')
def log_out_user():
    if session.get('user_id') is not None:
        session['user_id'] = None
    return redirect(url_for('home'))


@app.route('/register')
def register():
    return render_template('register_form.html')


@app.route('/user/<int:userid>')
def user_view(userid):
    session_user_id = session.get('user_id')
    if session_user_id is None:
        return redirect(url_for('home'))
    if session_user_id is not userid:
        return redirect(url_for('home'))
    username = db.execute('SELECT username FROM users WHERE userid =:userid', {
                'userid': session_user_id
                }).fetchone().username
    return render_template('user_view.html', username=username)


@app.route('/add_user', methods=["POST"])
def register_user():
    if db.execute('SELECT COUNT(*) FROM users WHERE username =:username OR email =:email', {
                  'username': request.form['name'],
                  'email': request.form['email']}) > 0:
        # user entry already exists in one form or another
        return jsonify({'success': False, 'respMessage': 'Username or Email already in use!'})
    else:
        db.execute('INSERT INTO users (username, password, email) VALUES (:username, :password, :email)', {
                   'username': request.form['name'],
                   'password': request.form['password'],
                   'email': request.form['email']})
        db.commit()
        return jsonify({'success': True})


@app.route('/add_chatroom', methods=["POST"])
def add_chat_room():
    print(request.form)
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
        db.execute('INSERT INTO chatrooms (roomname, userid, inviteid) VALUES (:roomname, :userid, :inviteid)', {
            'roomname': request.form['roomName'],
            'userid': session_user_id,
            'inviteid': unique_id
            })
        db.commit()
        return jsonify({
            'success': True,
            'respMessage': f'Generated new room with invite key {unique_id}',
            'room': {'roomName': request.form['roomName'],
                     'roomOwner': session_user_id,
                     'inviteKey': unique_id}
        })


@app.route('/get_chatrooms', methods=["GET"])
def get_user_chatrooms():
    if session.get('user_id') is None:
        return redirect(url_for('home'))
    else:
        chatrooms = db.execute('SELECT * FROM chatrooms WHERE userid =:userid', {
                    'userid': session.get('user_id')}).fetchall()
        chatrooms_list = []
        for chatroom in chatrooms:
            chatrooms_list.append({
                'roomId': chatroom[0],
                'roomName': chatroom[1],
                'roomOwner': chatroom[2],
                'inviteKey': chatroom[3]
            })
        return jsonify({
            'chatrooms': chatrooms_list
        })


@app.route('/get_user_info', methods=["GET"])
def get_user_info():
    if session.get('user_id') is None:
        return redirect(url_for('home'))
    user_info = db.execute('SELECT * FROM users WHERE userid =:userid', {
                'userid': session.get('user_id')}).fetchone()
    return jsonify({
        'username': user_info['username'],
        'userid': user_info['userid']
    })


@socketio.on('post message')
def add_new_msg(data):
    data['isPending'] = False
    emit('server message callback', data, broadcast=True)
