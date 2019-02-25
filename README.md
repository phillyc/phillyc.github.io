# phillyc.github.io

Built using Frozen-Flask.

[Original source from Steven Loria](http://stevenloria.com/hosting-static-flask-sites-for-free-on-github-pages/)

### How to build

Run the freeze.py file to compile the .md files into HTML. Then push to master.

### How to write a new article 
Add a title.md file to the project/pages/ directory. This will get read and frozen to HTML when freeze.py is run.

Only .md pages with a date: meta tag will be published.

### Local developement
Build a virtualenv.

Run `pip install -r requirements.txt`

Make code changes inside of /project

Run `python freeze.py` from inside the virtualenv.

Push the changes to master.

