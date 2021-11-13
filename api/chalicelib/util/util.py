import json, datetime
from bson.objectid import ObjectId

def filter_keys(obj, allowed_keys):
  filtered = {}
  for key in allowed_keys:
    if key in obj:
      filtered[key] = obj[key]
  return filtered

def build_updater(obj, allowed_keys):
  if not obj: return {}
  allowed = filter_keys(obj, allowed_keys)
  updater = {}
  for key in allowed:
    if not allowed[key]:
      if '$unset' not in updater: updater['$unset'] = {}
      updater['$unset'][key] = ''
    else:
      if '$set' not in updater: updater['$set'] = {}
      updater['$set'][key] = allowed[key]
  return updater

class MongoJsonEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, (datetime.datetime, datetime.date)):
      return obj.isoformat()
    elif isinstance(obj, ObjectId):
      return str(obj)
    return json.JSONEncoder.default(self, obj)

def jsonify(*args, **kwargs):
  return json.dumps(dict(*args, **kwargs), cls=MongoJsonEncoder)
