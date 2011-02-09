#!/bin/bash

content_type="";
url_base="http://localhost:8000";
api_url="/api/1/tag/";
session_id="34003fe8203856325dba0761b1d73d09";
json_data='{"name":"new_tag","creator":"/api/1/user/1/","collection":"/api/1/collection/1/","pk":4}';

curl -H "content-type:application/json" "$url_base$api_url" --data-binary $json_data -b "sessionid=$session_id";