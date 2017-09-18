# phillyc.github.io

Built using Frozen-Flask.

[Original source from Steven Loria](http://stevenloria.com/hosting-static-flask-sites-for-free-on-github-pages/)

### Build

Run the freeze.py file to compile the .md files into HTML. Then push to master.

### Write
Add a title.md file to the project/pages/ directory. This will get read and frozen to HTML when freeze.py is run.

### Develop
Build a virtualenv.

Run `pip install -r requirements.txt`

Run `python freeze.py` from inside the virtualenv.

Push the changes to master.

