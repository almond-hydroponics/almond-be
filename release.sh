#!/usr/bin/env bash
set -o errexit
#set -o nounset
set -o pipefail

source .env

folder=""
if [ "$NODE_ENV" == "production" ]; then folder="build"; else folder="src"; fi

echo $folder

mongoimport --uri="$MONGODB_URI" --collection="resources" --drop --file=$folder/data/resources.json --jsonArray
mongoimport --uri="$MONGODB_URI" --collection="permissions" --drop --file=$folder/data/permissions.json --jsonArray
mongoimport --uri="$MONGODB_URI" --collection="devices" --drop --file=$folder/data/devices.json --jsonArray
mongoimport --uri="$MONGODB_URI" --collection="roles" --drop --file=$folder/data/roles.json --jsonArray

if [ "$(mongo db:27017 --eval 'db.getMongo().getDBNames().indexOf("almond")' --quiet)" == -1 ]; then
  echo "Almond db sadly does not exist. Check your configurations."
else
  echo "Almond exists!"
  echo " "
  echo "$MONGODB_URI"

  #mongoimport --db almond --collection "resources" --drop --type json --host "localhost:27017" --file src/data/resources.json
  if [ "$(mongo "$MONGODB_URI" --eval 'db.getCollectionNames().indexOf("resources")' --quiet)" -lt 0 ]; then
    mongoimport --uri="$MONGODB_URI" --collection="resources" --drop --file=$folder/data/resources.json --jsonArray
    mongoimport --uri="$MONGODB_URI" --collection="permissions" --drop --file=$folder/data/permissions.json --jsonArray
    mongoimport --uri="$MONGODB_URI" --collection="devices" --drop --file=$folder/data/devices.json --jsonArray
    mongoimport --uri="$MONGODB_URI" --collection="roles" --drop --file=$folder/data/roles.json --jsonArray
  else
    echo "Collections happily coexists on almond!"
  fi
fi
