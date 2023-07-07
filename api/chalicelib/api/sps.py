from uuid import uuid4
import bcrypt, re, random, string, json
from bson import json_util
from OpenSSL import crypto
import pymongo
from bson.objectid import ObjectId
from chalicelib.util import database, errors

def get(user, include):
  db = database.get_jackson_db()
  # if include: include = list(map(lambda i: ObjectId(i), include.split(',')))
  # else: include = []

  query = {'_id': {'$regex': '^saml:config.*'}}

  sps = []
  
  for sp in db.jacksonStore.find(query, {'_id':0,'value': 1}):
    sp["value"] = json.loads(sp["value"]["value"])
    sp["tenant"] = sp["value"]["tenant"]
    sp["product"] = sp["value"]["product"]
    sps.append(sp)

  return {'sps': sps}

def get_one(user, tenant, product):
  db = database.get_jackson_db()
  # if include: include = list(map(lambda i: ObjectId(i), include.split(',')))
  # else: include = []

  query = {'_id': {'$regex': '^saml:config.*'}}
  
  for sp in db.jacksonStore.find(query, {'_id':0,'value': 1}):
    sp["value"] = json.loads(sp["value"]["value"])
    sp["tenant"] = sp["value"]["tenant"]
    sp["product"] = sp["value"]["product"]
    if(sp["tenant"] == tenant and sp["product"] == product):
      return sp

  return {}

def delete(user, tenant, product):
  db = database.get_jackson_db()
  # if include: include = list(map(lambda i: ObjectId(i), include.split(',')))
  # else: include = []

  query = {'_id': {'$regex': '^saml:config.*'}}
  
  for sp in db.jacksonStore.find(query, {'value': 1}):
    sp["value"] = json.loads(sp["value"]["value"])
    sp["tenant"] = sp["value"]["tenant"]
    sp["product"] = sp["value"]["product"]
    if(sp["tenant"] == tenant and sp["product"] == product):
      target_query = {'_id': sp['_id']}
      db.jacksonStore.delete_one(target_query)
      return {'tenant': sp["tenant"], 'product': sp["product"]}

  return {}
