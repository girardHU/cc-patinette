from flask import request, render_template, make_response
from secrets import token_hex
import re

from flask import current_app as app
from src.models import db, User, Token, Run, Vehicle, Discount
from src.utils import *

## REGEX
wordRe = re.compile('[a-zA-Z0-9_-]{3,12}')

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        if not request.json:
            return create_error('Bad Request', 400, ['no json sent']), 400
        username = request.json.get('username')
        password = request.json.get('password')
        error = None
        if username is None or password is None:
            error = 'missing either username, password or both'
        elif not isinstance(username, str) or not isinstance(password, str):
            error = 'username or password are not string, or both'
        if error is None:
            relatedUser = User.query.filter_by(username=username).first()
            if relatedUser is not None and verify_password(relatedUser.password, password):
                existingToken = Token.query.filter_by(user_id=relatedUser.id).first()
                if existingToken is not None:
                    return { 'message': 'OK', 'data': existingToken.as_dict() }, 200
                else:
                    newToken = Token(code=token_hex(16), user_id=relatedUser.id)
                    db.session.add(newToken)
                    db.session.commit()
                    return { 'message': 'OK', 'data': newToken.as_dict() }, 201
            else:
                error = 'user referenced with this username and password does not exist'
        return create_error('Bad Request', 400, [error]), 400


@app.route('/user/<id>', methods=['GET'])
def read_user(id):
    user = User.query.filter_by(id=id).first()
    if user:
        return user.as_dict()
    return make_response(f"No user found for the id `{id}`")

@app.route('/user', methods=['POST'])
def create_user():
    if request.method == 'POST':
        if not request.json:
            return create_error('Bad Request', 400, ['no json sent']), 400
        username = request.json.get('username')
        password = request.json.get('password')
        isrefiller = request.json.get('isrefiller')
        if username is None or password is None:
            error = 'missing either username or password'
        elif not wordRe.fullmatch(username):
            error = 'invalid username (3 to 12 chars, alphanumeric, dashes and underscores)'
        elif User.query.filter_by(username=username).first() is not None:
            error = 'username already in use on another account'
        else:
            new_user = User(username=username,
                            password=hash_password(password),
                            isrefiller=isrefiller)
            db.session.add(new_user)
            db.session.commit()
            return { 'message' : 'OK', 'data': new_user.as_dict() }, 201
        return create_error('Bad Request', 400, [error]), 400

@app.route('/user/<int:user_id>', methods=['DELETE', 'PUT', 'GET'])
@auth_required
def update_user(user_id):
    if request.method == 'DELETE':
        if ownership(request, user_id):
            userToDelete = User.query.filter_by(id=user_id).first()
            db.session.delete(userToDelete)
            db.session.commit()
            return { 'message' : 'OK' }, 204
        else:
            return create_error('Forbidden', 403, ['you don\'t have access to this resource']), 403

    if request.method == 'PUT':
        if ownership(request, user_id):
            if not request.json:
                return create_error('Bad Request', 400, ['no json sent']), 400
            username = request.json.get('username')
            email = request.json.get('email')
            pseudo = request.json.get('pseudo')
            password = request.json.get('password')
            if username is None  or password is None:
                error = 'missing either username or password'
            elif not wordRe.fullmatch(username):
                error = 'invalid username (3 to 12 chars, alphanumeric, dashes and underscores)'
            elif User.query.filter_by(username=username).first() is not None and User.query.filter_by(username=username).first().id != user_id:
                error = 'username already in use on another account'
            else:
                userToUpdate = User.query.filter_by(id=user_id).first()
                if userToUpdate is not None:
                    userToUpdate.username = username
                    userToUpdate.email = email
                    userToUpdate.pseudo = pseudo
                    userToUpdate.password = hash_password(password)
                    db.session.commit()
                    return { 'message' : 'OK', 'data': userToUpdate.as_dict() }, 201
                else:
                    return create_error('Not Found', 404, ['resource does not exist']), 404
            return create_error('Bad Request', 400, [error]), 400
        else:
            return create_error('Forbidden', 403, ['you don\'t have access to this resource']), 403

    if request.method == 'GET':
        user = User.query.filter_by(id=user_id).first()
        if user is not None:
            return { 'message': 'OK', 'data': user.as_dict() }, 200
        else:
            return create_error('Not Found', 404, ['resource does not exist']), 404
