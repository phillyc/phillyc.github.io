# -*- coding: utf-8 -*-

from flask import Flask
from flask_flatpages import FlatPages
from flask_frozen import Freezer

app = Flask(__name__)
app.config.from_pyfile('settings.py')
pages = FlatPages(app)
freezer = Freezer(app)


# @freezer.register_generator
# def pages_with_tag():

#     # Get all published pages.
#     published_pages = [page for page in pages if 'date' in page.meta]

#     # Make a list of unique tags from the published pages.
#     tags = []
#     for page in published_pages:
#         for tag in page.meta['tags']:
#             tags.append(tag)
#     tags = set(tags)
#     tags = list(tags)

#     # Attach our url stub to the tag.
#     tags = ['/tags/%s/' % tag for tag in tags]

#     # Yield each url.
#     for tag in tags:
#         yield tag

