from flask import render_template

from app import app, pages


@app.route('/about/')
def about():
    return render_template('about.html')

@app.route('/')
def home():
    published_pages = [page for page in pages if 'date' in page.meta]
    # Sort pages by date
    sorted_posts = sorted(published_pages, reverse=True,
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
    published_pages = [page for page in pages if 'date' in page.meta]

    tags = []
    for post in published_pages:
        for tag in post.meta['tags']:
            tags.append(tag)
    tags = set(tags)
    tags = list(tags)

    return render_template('tags.html', tags=tags)

# @app.route('/pages/<tag>/')
# def tag(tag):
#     # Get all published pages.
#     published_pages = [page for page in pages if 'date' in page.meta]

#     # List of pages with the given tag.
#     pages_with_tags = [page for page in published_pages if tag in page.meta['tags']]

#     return render_template('pages_with_tag.html', pages=pages_with_tags)

# @freezer.register_generator
# def tag_details():
#     for tag in models.Tags.all():
#         yield {'tag_id': tag.id}

# @freezer.register_generator
# def product_details():
#     for product in models.Product.all():
#         yield {'product_id': product.id}
