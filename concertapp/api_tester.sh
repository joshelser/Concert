content_type="content-type:application/json";
url_base="http://localhost:8000";
api_url="/api/1/collection/";
session_id="cbdc39b163bfeec5ba497e22fdbd99ce";
json_data='{"name":"curled_coll_3","users":["/api/1/user/1/"],"admin":"/api/1/user/1/","user_is_admin":true,"num_users":1,"requests":[]}';


curl -H $content_type "$url_base$api_url" --data-binary $json_data -b "sessionid=$session_id";