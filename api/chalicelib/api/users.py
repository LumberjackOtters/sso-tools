from bson.objectid import ObjectId
from chalicelib.util import database, util, errors

def me(user):
  db = database.get_db()
  return {
    '_id': user['_id'],
    'firstName': user.get('firstName'),
    'lastName': user.get('lastName'),
    'email': user.get('email'),
    'subscriptions': user.get('subscriptions', []),
  }

def get(user, id):
  db = database.get_db()
  if str(user['_id']) != id: raise errors.Forbidden('Not allowed')
  return db.users.find_one({'_id': ObjectId(id)}, {'firstName': 1, 'lastName': 1})

def update(user, id, data):
  if not data: raise errors.BadRequest('Invalid request')
  db = database.get_db()
  if str(user['_id']) != id: raise errors.Forbidden('Not allowed')
  allowed_keys = ['firstName', 'lastName']
  updater = util.build_updater(data, allowed_keys)
  if updater:
    db.users.update({'_id': ObjectId(id)}, updater)
  return get(user, id)
