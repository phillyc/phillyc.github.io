title: A tagging system for Flask blogs

tags: [python, flask, code]

blurb: Implementing a tag system for a Flask based blog can be a snap if you know what to do. This post will walk you through the basics of creating and handling tags in Flask.

Implementing a tag system for a Flask based blog can be a snap if you know what to do. This post will walk you through the basics of creating and handling tags in Flask.

This post is assuming that you are using some kind of post processor, that allows you to write posts in Markdown, or reStructuredText, then run them through a proccessor that turns them into objects.

First, let's take a look at the format of the tags in each post.

    title: A tagging system for Flask blogs
    tags: [python, flask, code]

You can see here that we've created a simple python list with our chosen tags in it. 

Our freeze.py file will take care of attaching this list to each page object as part of the .meta.



My display is a pretty basic one, since I'm using [Bootstrap](http://getbootstrap.com/) to handle the UI layer.

    <div class="tags">
        {% for tag in page.meta.tags %}
            <a href="/tags/{{ tag }}"><span class="label label-primary">{{ tag }}</span></a>
        {% endfor %}
    </div>
