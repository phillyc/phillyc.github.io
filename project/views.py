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

@app.route('/rivermap')
def rivermap():
    return render_template('rivermap.html')
