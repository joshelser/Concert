This is a bare-skeleton Django application which demonstrates how you can
add an API to your own applications.

It's a simple blog application, with a "Blogpost" model, with an API on top
of it. It has a fixture which contains a sample user (used as author and 
for auth) and a couple of posts.

You can get started like so:

$ python manage.py syncdb (answer "no" when it asks for superuser creation)
$ python manage.py runserver

Now, the test user has authentication info:

Username: testuser
Password: foobar

The API is accessible via '/api/posts'. You can try it with curl:

$ curl -u testuser:foobar http://127.0.0.1:8000/api/basic_auth/posts/?format=json
[
    {
        "content_length": 27, 
        "author": {
            "username": "testuser"
        }, 
        "title": "Sample blogpost 1", 
        "content": "This is just a sample post.", 
        "created_on": "2009-04-27 04:55:23", 
        "id": 1
    }, 
    {
        "content_length": 32, 
        "author": {
            "username": "testuser"
        }, 
        "title": "Another sample post", 
        "content": "This is yet another sample post.", 
        "created_on": "2009-04-27 04:55:33", 
        "id": 2
    }

You can also try the following command if you prefer to get the data in an alternate format :

$ curl -u testuser:foobar http://127.0.0.1:8000/api/basic_auth/posts/?format=yaml

or

$ curl -u testuser:foobar http://127.0.0.1:8000/api/basic_auth/posts/?format=xml

It is interesting to note that if you point directly your browser to the url below you will be able to download a file which contains the json representation :

* http://127.0.0.1:8000/api/basic_auth/posts/

I would like to bring  your attention on the fact that the default method used by curl is GET so the commandes above are equivalent to :

$ curl -u testuser:foobar -X GET http://127.0.0.1:8000/api/basic_auth/posts/?format=json
$ curl -u testuser:foobar -X GET http://127.0.0.1:8000/api/basic_auth/posts/?format=yaml
$ curl -u testuser:foobar -X GET http://127.0.0.1:8000/api/basic_auth/posts/?format=xml


That's an authorized request, and the user gets back privileged information.

Anonymously:

$ curl -X GET http://127.0.0.1:8000/api/basic_auth/posts/?format=yaml
- {content: This is just a sample post., created_on: !!timestamp '2009-04-27 04:55:23',
  title: Sample blogpost 1}
- {content: This is yet another sample post., created_on: !!timestamp '2009-04-27
    04:55:33', title: Another sample post}

Creating blog post
===================

$ curl -u testuser:foobar -X POST -d title="New post" -d content="This post is created using the api" http://127.0.0.1:8000/api/basic_auth/posts/
{
    "content_length": 34, 
    "author": {
        "username": "testuser"
    }, 
    "title": "New post", 
    "content": "This post is created using the api", 
    "created_on": "2009-10-14 17:45:45", 
    "id": 3
}

(The data returned is the blog post that has been created.)

Anonymous are not allowed:

curl -X POST -d title="New post" -d content="This post is created using the api" http://127.0.0.1:8000/api/basic_auth/posts/
Authorization Required

$ curl -v -X POST -d title="New post" -d content="This post is created using the api" http://127.0.0.1:8000/api/basic_auth/posts/
* About to connect() to 127.0.0.1 port 8000 (#0)
*   Trying 127.0.0.1... connected
* Connected to 127.0.0.1 (127.0.0.1) port 8000 (#0)
> POST /api/posts/ HTTP/1.1
> User-Agent: curl/7.18.2 (x86_64-pc-linux-gnu) libcurl/7.18.2 OpenSSL/0.9.8g zlib/1.2.3.3 libidn/1.10
> Host: 127.0.0.1:8000
> Accept: */*
> Content-Length: 57
> Content-Type: application/x-www-form-urlencoded
> 
* HTTP 1.0, assume close after body
< HTTP/1.0 401 UNAUTHORIZED
< Date: Wed, 14 Oct 2009 22:50:54 GMT
< Server: WSGIServer/0.1 Python/2.6.2
< Vary: Authorization
< Content-Type: text/html; charset=utf-8
< WWW-Authenticate: Basic realm="My sample API"
< 
* Closing connection #0

This is because by default, AnonymousBaseHandler has 'allow_methods' only set to 'GET'.

Form validation
================

*xml output*

$ curl -ucreated using the api" http://127.0.0.1:8000/api/basic_auth/posts/?format=xml
Bad Request <ul class="errorlist"><li>title<ul class="errorlist"><li>This field is required.</li></ul></li></ul>

*json output*

$ curl -u testuser:foobar -X POST -d content="This post is created using the api" http://127.0.0.1:8000/api/basic_auth/posts/?format=json
Bad Request {"title": ["This field is required."]}




Updating a blog post
======================

$ curl -u testuser:foobar -X PUT -d title="Update post" -d content="This post is created using the api" http://127.0.0.1:8000/api/basic_auth/post/3/
cOK


Deleting a blog post
======================

$ curl -u testuser:foobar -X DELETE http://127.0.0.1:8000/api/basic_auth/post/3/


Also, there's plenty of documentation on http://bitbucket.org/jespern/django-piston/

Have fun!