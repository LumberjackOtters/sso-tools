from flask import Flask, jsonify, request
from flask_cors import CORS
import werkzeug

from chalicelib.util import util, errors
from chalicelib.api import accounts, users, idps
errors = errors.errors

app = Flask(__name__)
CORS(app)

def get_user(required = True):
  headers = request.headers
  if not headers.get('Authorization') and required:
    raise errors.Unauthorized('This resource requires authentication')
  if headers.get('Authorization'):
    user = accounts.get_user_context(headers.get('Authorization').replace('Bearer ', ''))
    if user is None and required:
      raise errors.Unauthorized('Invalid token')
    return user
  return None

@app.errorhandler(werkzeug.exceptions.BadRequest)
def handle_bad_request(e):
  return jsonify({'message': e.description}), 400
@app.errorhandler(werkzeug.exceptions.Unauthorized)
def handle_not_authorized(e):
  return jsonify({'message': e.description}), 401
@app.errorhandler(werkzeug.exceptions.Forbidden)
def handle_forbidden(e):
  return jsonify({'message': e.description}), 403
@app.errorhandler(werkzeug.exceptions.NotFound)
def handle_not_found(e):
  return jsonify({'message': e.description}), 404

# ACCOUNTS

@app.route('/accounts', methods=['POST'])
def register():
  return util.jsonify(accounts.create(request.json))

@app.route('/accounts/enrol', methods=['POST'])
def enrol():
  return util.jsonify(accounts.enrol(request.json))

@app.route('/accounts/sessions', methods=['POST'])
def login():
  return util.jsonify(accounts.login(request.json))

@app.route('/accounts/sessions', methods=['DELETE'])
def logout():
  return util.jsonify(accounts.logout(get_user()))

@app.route('/accounts', methods=['DELETE'])
def delete_account():
  body = request.json
  return util.jsonify(accounts.delete(get_user(), body.get('password')))

@app.route('/accounts/password', methods=['PUT'])
def password():
  body = request.json
  return util.jsonify(accounts.update_password(get_user(required=False), body))

@app.route('/accounts/password/reset', methods=['POST'])
def reset_password():
  body = request.json
  return util.jsonify(accounts.reset_password(body))

# Users

@app.route('/users/me', methods=['GET'])
def users_me():
  return util.jsonify(users.me(get_user()))

@app.route('/users/<id>', methods=['PUT'])
def user_route(id):
  return util.jsonify(users.update(get_user(), id, request.json))

# IDPs

@app.route('/idps', methods=['GET', 'POST'])
def idps_route():
  if request.method == 'POST':
    return util.jsonify(idps.create(get_user(required=False), request.json))
  if request.method == 'GET':
    params = request.args or {}
    return util.jsonify(idps.get(get_user(required=False), params.get('include')))

@app.route('/idps/<id>', methods=['GET', 'PUT', 'DELETE'])
def idp_route(id):
  if request.method == 'GET':
    return util.jsonify(idps.get_one(get_user(required=False), id))
  if request.method == 'PUT':
    return util.jsonify(idps.update(get_user(required=False), id, request.json))
  if request.method == 'DELETE':
    return util.jsonify(idps.delete(get_user(required=False), id))

@app.route('/idps/<id>/sps', methods=['GET', 'POST'])
def idp_sps_route(id):
  if request.method == 'GET':
    return util.jsonify(idps.get_sps(get_user(required=False), id))
  if request.method == 'POST':
    return util.jsonify(idps.create_sp(get_user(required=False), id, request.json))

@app.route('/idps/<id>/sps/<sp_id>', methods=['PUT', 'DELETE'])
def idp_sp_route(id, sp_id):
  if request.method == 'DELETE':
    return util.jsonify(idps.delete_sp(get_user(required=False), id, sp_id))
  if request.method == 'PUT':
    return util.jsonify(idps.update_sp(get_user(required=False), id, sp_id, request.json))

@app.route('/idps/<id>/users', methods=['GET', 'POST'])
def idp_users_route(id):
  if request.method == 'GET':
    return util.jsonify(idps.get_users(get_user(required=False), id))
  if request.method == 'POST':
    return util.jsonify(idps.create_user(get_user(required=False), id, request.json))

@app.route('/idps/<id>/users/<user_id>', methods=['PUT', 'DELETE'])
def idp_user_route(id, user_id):
  if request.method == 'DELETE':
    return util.jsonify(idps.delete_user(get_user(required=False), id, user_id))
  if request.method == 'PUT':
    return util.jsonify(idps.update_user(get_user(required=False), id, user_id, request.json))

@app.route('/idps/<id>/attributes', methods=['GET', 'POST'])
def idp_attributes_route(id):
  if request.method == 'GET':
    return util.jsonify(idps.get_attributes(get_user(required=False), id))
  if request.method == 'POST':
    return util.jsonify(idps.create_attribute(get_user(required=False), id, request.json))

@app.route('/idps/<id>/attributes/<attr_id>', methods=['PUT', 'DELETE'])
def idp_attribute_route(id, attr_id):
  if request.method == 'DELETE':
    return util.jsonify(idps.delete_attribute(get_user(required=False), id, attr_id))
  if request.method == 'PUT':
    return util.jsonify(idps.update_attribute(get_user(required=False), id, attr_id, request.json))

@app.route('/idps/<id>/logs', methods=['GET'])
def idp_logs_route(id):
  return util.jsonify(idps.get_logs(get_user(required=False), id))