title: Installing PostgreSQL on MacOSX

tags:[postgresql, macosx, django, heroku, python]

# 

Following [Getting started with django](https://devcenter.heroku.com/articles/getting-started-with-django) on Heroku.

Once you've installed the basic PostgreSQL setup with the graphical installer, you'll want to move back to the terminal.

Here you'll likely need to install the psycopg2 package which acts as an interface between Django and PostgreSQL. (confirmation?)

    PATH=$PATH:/Library/Postgres/9.3/bin/ sudo pip install psycopg2


[More info](http://blog.jonypawks.net/2008/06/20/installing-psycopg2-on-os-x/)
