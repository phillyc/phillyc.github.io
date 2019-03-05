from flask import render_template

from .app import app, pages


@app.route('/experiments/')
def experiments():
    return render_template('experiments.html')

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/posts/')
def posts():
    published_pages = [page for page in pages if 'date' in page.meta]
    sorted_posts = sorted(published_pages, reverse=True,
        key=lambda page: page.meta['date'])
    return render_template('posts.html', pages=sorted_posts)


@app.route('/<path:path>/')
def page(path):
    # Path is the filename of a page, without the file extension
    # e.g. "first-post"
    page = pages.get_or_404(path)
    return render_template('page.html', page=page)


# @app.route('/tags/<tag>')
# def tag(tag):
#     # Get all published pages.
#     published_pages = [page for page in pages if 'date' in page.meta]

#     # List of pages with the given tag.
#     pages_with_tag = [page for page in published_pages if tag in page.meta['tags']]

#     return render_template('index.html', pages=pages_with_tag)

