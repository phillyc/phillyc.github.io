from flask import render_template

from app import app, pages


@app.route('/')
def home():
    posts = [page for page in pages if 'date' in page.meta]
    # Sort pages by date
    sorted_posts = sorted(posts, reverse=True,
        key=lambda page: page.meta['date'])
    return render_template('index.html', pages=sorted_posts)


@app.route('/<path:path>/')
def page(path):
    # Path is the filename of a page, without the file extension
    # e.g. "first-post"
    page = pages.get_or_404(path)
    return render_template('page.html', page=page)

@app.route('/tags/')
def tags():
    posts = [page for page in pages if 'date' in page.meta]
 
    tags = []
    for post in posts:
        for tag in post.meta['tags']:
            tags.append(tag)
    tags = set(tags)
    tags = list(tags)
    
    
    return render_template('tags.html', tags=tags)
