from flask import request
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


@app.route('/user/<int:user_id>', methods=['GET'])
def read_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user:
        return user.as_dict(), 200
    return create_error('Not Found', 404, ['resource does not exist']), 404

@app.route('/user/<username>', methods=['GET'])
def read_user_by_username(username):
    user = User.query.filter_by(username=username).first()
    if user:
        return user.as_dict(), 200
    return create_error('Not Found', 404, ['resource does not exist']), 404

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
            isrefiller = request.json.get('isrefiller')
            password = request.json.get('password')
            # if username is None  or password is None:
            #     error = 'missing either username or password'
            if username and not wordRe.fullmatch(username):
                error = 'invalid username (3 to 12 chars, alphanumeric, dashes and underscores)'
            elif User.query.filter_by(username=username).first() is not None and User.query.filter_by(username=username).first().id != user_id:
                error = 'username already in use on another account'
            else:
                userToUpdate = User.query.filter_by(id=user_id).first()
                if userToUpdate is not None:
                    userToUpdate.username = username if username else userToUpdate.username
                    userToUpdate.email = email if email else userToUpdate.email
                    userToUpdate.isrefiller = isrefiller if isrefiller else userToUpdate.isrefiller
                    userToUpdate.password = hash_password(password) if password else userToUpdate.password
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

@app.route('/vehicle', methods=['POST'])
@auth_required
def create_vehicle():
    if request.method == 'POST':
        if not request.json:
            return create_error('Bad Request', 400, ['no json sent']), 400
        battery = request.json.get('battery')
        latitude = request.json.get('latitude')
        longitude = request.json.get('longitude')
        vehicle_type = request.json.get('vehicle_type')
        available = request.json.get('available')
        #TODO:better verifs
        battery = battery if battery else 100
        vehicle_type = vehicle_type if vehicle_type else 'trottinette'
        available = available if available else True
        new_vehicle = Vehicle(
            battery=battery,
            latitude=latitude,
            longitude=longitude,
            vehicle_type=vehicle_type,
            available=available)
        db.session.add(new_vehicle)
        db.session.commit()
        return { 'message' : 'OK', 'data': new_vehicle.as_dict() }, 201

@app.route('/run', methods=['POST'])
@auth_required
def create_run():
    if request.method == 'POST':
        if not request.json:
            return create_error('Bad Request', 400, ['no json sent']), 400
        startedAt = request.json.get('startedAt')
        endedAt = request.json.get('endedAt')
        user_id = request.json.get('user_id')
        vehicle_id = request.json.get('vehicle_id')
        #TODO:better verifs
        if not user_id or not vehicle_id:
            return create_error('Bad Request', 400, ['missing at least one of : user_id, vehicle_id']), 400

        new_run = Run(
            startedAt=startedAt,
            endedAt=endedAt,
            user_id=user_id,
            vehicle_id=vehicle_id)
        db.session.add(new_run)
        db.session.commit()
        return { 'message' : 'OK', 'data': new_run.as_dict() }, 201

# @app.route('/run/new/')