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

# Configure session variables
current_user_id = ''


@app.route('/')
def home():
    if session.get('current_user_id') is None:
        return redirect(url_for('login'))
    return render_template()


@app.route('/login')
def login():
    return render_template('login.html')


@app.route('/register')
def register():
    return render_template('register_form.html')


@app.route('/add_user', methods=["POST"])
def register_user():
    print(f'attempting to register {request.form["email"]}')
    print(f'attempting to register {request.form["name"]}')
    return ' '


@app.route('/<string:user_id>')
def user_view(user_id):
    if session.get('current_user_id') is not user_id:
        return redirect(url_for('login'))
    return render_template('user_view.html', user_id=user_id)


if __name__ == '__main__':
    app.run(debug=True)
