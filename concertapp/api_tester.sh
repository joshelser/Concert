#!/bin/bash

url_base="http://localhost:8000";
api_url="/api/1/audiosegment/1/"
session_id="ba4b33ed6e45384ce97a5436191342a5";
json_data='{"name":"asdasd","creator":"/api/1/user/1/","beginning":"1","end":"5","audioFile":"/api/1/audioFile/1/"}'

curl "$url_base$api_url" -H "Content-Type:application/json" -X 'PUT' --data-binary $json_data -b "sessionid=$session_id" > temp.html;

chromium-browser temp.html;