#!/bin/bash

url_base="http://localhost:8000";
api_url="/api/1/collection/";

session_id="48e83649bc4288cc5868f0f73a0a554f";
json_data='{"name":"newest_collection","admin":"/api/1/user/1/"}';


curl "$url_base$api_url" -H "Content-Type:application/json" -X 'POST' --data-binary $json_data -b "sessionid=$session_id" > adams_temp.html;

#
chromium-browser adams_temp.html;