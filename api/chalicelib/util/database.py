import os
from pymongo import MongoClient

db = None
jdb = None

def get_db():
  global db
  if not db:
    db = MongoClient(os.environ.get('MONGO_URL'))[os.environ.get('MONGO_DATABASE')]
  return db

def get_jackson_db():
  global jdb
  if not jdb:
    jdb = MongoClient(os.environ.get('MONGO_URL'))["test"]
  return jdb