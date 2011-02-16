#!/bin/bash


url_base="http://localhost:8000";
api_url="/api/1/audio/1/";
session_id="7624df7731765ea2318628cf756c4e14";
json_data='{"name":"new_audio","uploader":"/api/1/user/1/","collection":"/api/1/collection/1/"}'

curl "$url_base$api_url" -H "Content-Type:application/json" -X 'PUT' --data-binary $json_data -b "sessionid=$session_id";