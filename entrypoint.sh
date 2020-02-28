#!/bin/sh

echo " "
echo "<<<<<<<< Creating mongo users >>>>>>>>>"
echo " "
mongo admin --host mongo -u root -p toor --eval "db.createUser({user: 'almond', pwd: 'froyogreen', roles: [{role: 'userAdminAnyDatabase', db: 'almond'}]});"
echo "<<<<<<<< Mongo users created >>>>>>>>>"
echo " "

sleep 10
echo " "
echo "<<<<<<<< Database Setup and Migrations Starts >>>>>>>>>"
echo " "

sleep 20
export NODE_ENV=development
yarn seed:data

sleep 10
echo " "
echo "<<<<<<< Database Setup and Migrations Complete >>>>>>>>>>"
echo " "

sleep 5
echo " "
echo "<<<<<<<<<<<<<<<<<<<< STARTING API >>>>>>>>>>>>>>>>>>>>>>>>"
echo " "
yarn start:dev

exit 0
