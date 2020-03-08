#!/usr/bin/env bash
source .env
#mongoimport --db almond --collection "resources" --drop --type json --host "localhost:27017" --file src/data/resources.json
mongoimport --uri="$MONGODB_URI" --collection="resources" --drop --file=src/data/resources.json --jsonArray
mongoimport --uri="$MONGODB_URI" --collection="permissions" --drop --file=src/data/permissions.json --jsonArray
mongoimport --uri="$MONGODB_URI" --collection="devices" --drop --file=src/data/devices.json --jsonArray
mongoimport --uri="$MONGODB_URI" --collection="roles" --drop --file=src/data/roles.json --jsonArray
