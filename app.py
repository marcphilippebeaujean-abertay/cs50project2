from flask import Flask, render_template, request, url_for, redirect, session, jsonify
from flask_session import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
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
Session(app)


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


@app.route('/register')
def register():
    return render_template('register_form.html')


@app.route('/user/<int:userid>')
def user_view(userid):
    session_user = session.get('user_id')
    print(session_user)
    print(userid)
    if session_user is None:
        return redirect(url_for('home'))
    if session_user is not userid:
        return redirect(url_for('home'))
    return render_template('user_view.html')


@app.route('/add_user', methods=["POST"])
def register_user():
    if db.execute('SELECT * FROM users WHERE username =:username OR email =:email', {
                  'username': request.form['name'],
                  'email': request.form['email']}).fetchone() is not None:
        # user entry already exists in one form or another
        return jsonify({'success': False, 'respMessage': 'Username or Email already in use!'})
    else:
        db.execute('INSERT INTO users (username, password, email) VALUES (:username, :password, :email)', {
                   'username': request.form['name'],
                   'password': request.form['password'],
                   'email': request.form['email']})
        db.commit()
        return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True)
