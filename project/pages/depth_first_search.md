title: Nested comments in Python using a Depth First Search
date: 2014-06-22 11:00
tags: [python]

    class Comment(models.Model):
      request = models.ForeignKey(Request, related_name = 'request')
      parent = models.ForeignKey('Comment', related_name = 'child', null = True)
      time_log = models.ForeignKey(TimeLog, related_name = '+', null = True)
      author = models.ForeignKey(User, related_name = 'comment')
      data = models.TextField()
      posted = models.DateTimeField(auto_now_add = True, null = False)

You can see here that the request field represents the object that comments are attached to. This could be anything, an article model, car, etc. It’s just a way to associate a set of comments with a thing.

The main field we’re concerned with here is the parent field. As you can see, this is a foreign key relationship back to the Comment model. This is how we keep track of nested comments. If there is no parent, then the comment we’re looking at is a top level comment, that is, a comment that is not a reply to another comment.

Since we need to be able to make sense of this in some sort of ordered list, we devised a quick little Python snippet to give us a depth first traverse.

First I’ll show you how we did it in pseudocode, for the raw code, look to the bottom.

First we start with a list off all the comments that do not have a parent:

    starting_list = [1, 2, 3, 4]

Python has two great list operators, pop and append. They by default work on the end of the list. It’s faster and simpler to reverse the list so we can pop and append then reverse back.

Reverse

    starting_list = [4, 3, 2, 1]

Now we need to pop that last item from the list. In Python, pop has the added benefit of returning the item removed from the list. This allows us to pop and append in a single line of code, but it’s really two actions.

Pop

     starting_list = [4, 3, 2]

Append to ordered list

     ordered_list = [1]

Now we need to look for all the comments that have a parent of the comment that we just popped.

    For all comments with parent == 1

And in this for loop, we’ll append any of the found comments to the starting_list. Let’s assume it found two.

Append

    starting_list = [4, 3, 2, 17, 27]

Now all that’s left is reversing the list back to the original condition.

Reverse

    starting_list = [27, 17, 2, 3, 4]
    ordered_list = [1]

And repeat! We would wrap this entire process in a while loop that checks starting_list for more items.

If we ran through this again, we’d be checking for any children of comment 27. Assuming we found none, the condition of our two lists would be:

    starting_list = [17, 2, 3, 4]
    ordered_list = [1, 27]

Following this basic approach will net you a list of ordered comments that can be further manipulated. It’s important to note that this can be achieved in more than one way, but this is a fairly quick and simple method for nested comments in Python.

Original code:

    class Comment(models.Model):
      request = models.ForeignKey(Request, related_name = 'request')
      parent = models.ForeignKey('Comment', related_name = 'child', null = True)
      time_log = models.ForeignKey(TimeLog, related_name = '+', null = True)
      author = models.ForeignKey(User, related_name = 'comment')
      data = models.TextField()
      posted = models.DateTimeField(auto_now_add = True, null = False)

    # Load up any comments.
    comments = Comment.objects.filter(request_id = request_id)
    # Make a list of parent comments to start our recursion.
    starting_comments = [comment for comment in comments if comment.parent_id == None]
    # Make a list of all comments.
    all_comments = [comment for comment in comments]
    # Init the ordered comments list.
    ordered_comments = []

    # Have to reverse to get oldest children first.
    all_comments.reverse()

    # While we still have comments to traverse.
    while len(starting_comments) > 0:
      # Reverse the starting comments so we can pop and append
      starting_comments.reverse()
      # Append the last starting_comments to the ordered_comments
      #    and pop from starting_comments
      ordered_comments.append(starting_comments.pop())

      # Look for comments with parent_id that matches the parent
      for comment in all_comments:
        # Does this comment.parent_id match the last ordered_comments.id?
        if comment.parent_id == ordered_comments[-1].id:
          # Append the found child to the ordered list behind it's parent and to the starting_comments.
          starting_comments.append(comment)

      # Reverse back to correct order.
      starting_comments.reverse()
