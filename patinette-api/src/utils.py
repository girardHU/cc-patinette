import os, hashlib, binascii
from functools import wraps

from src.models import Token

#TODO: Gerer l'expiration du Token

def auth_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        requestToken = request.headers.get('Authorization')
        tokenObj = Token.query.filter_by(code=requestToken).first()
        if tokenObj is None:
            return { 'message': 'Token is invalid' }, 401
        return f(*args, **kwargs)
    return decorated_function

def res_ownership_required(f):
    @wraps(f)
    def decorated_function(user_id, *args, **kwargs):
        requestToken = request.headers.get('Authorization')
        tokenObj = Token.query.filter_by(code=requestToken).first()
        if tokenObj is not None:
            if tokenObj.user_id != user_id:
                return { 'message': 'You can\'t access this resource' }, 403
        else:
            return { 'message': 'Token is invalid' }, 401
        return f(user_id, *args, **kwargs)
    return decorated_function

def ownership(request, user_id):
    requestToken = request.headers.get('Authorization')
    tokenObj = Token.query.filter_by(code=requestToken).first()
    if tokenObj:
        return tokenObj.user_id == user_id
    return False

def hash_password(password):
    """Hash a password for storing."""
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), 
                                salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')

def verify_password(stored_password, provided_password):
    """Verify a stored password against one provided by user"""
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha512', 
                                provided_password.encode('utf-8'), 
                                salt.encode('ascii'), 
                                100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password

def create_error(message, code, data):
    return {
        'message': message,
        'code': code,
        'data': data
    }
