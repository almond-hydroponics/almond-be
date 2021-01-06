#!/bin/sh

#sleep 10
echo " "
echo "<<<<<<<< Database Setup and Migrations Starts >>>>>>>>>"
echo " "

#sleep 20
export NODE_ENV=production
yarn seed:data

sleep 10
echo " "
echo "<<<<<<< Database Setup and Migrations Complete >>>>>>>>>>"
echo " "

sleep 10
echo " "
echo "<<<<<<<<<<< 😎 Starting Server API 😎 >>>>>>>>>>>>>"
echo " "
yarn start

exit 0
