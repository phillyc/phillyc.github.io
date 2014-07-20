title: Getting the most out of part time developers.
date: 2014-07-20 10:13
tags: [management, workflow]
blurb: I've been managing a small team of part time web developers for just over a year. I'd like to share what I've learned about workflow in a small team, and specifically how to keep track of dozens of issues across a part time team.

I've been managing a small team of part time web developers for just over a year. I'd like to share what I've learned about workflow in a small team, and specifically how to keep track of dozens of issues across a part time team.

As a lead developer for a suite of twelve applications, I have a critical need to leverage the help of my part time developers to the best effect. My part timers are students here at the University of Central Florida, and so they have to fit working for me into an already busy schedule of classes, homework, and beer pong.

I've adopted several techniques and tools to help me manage the chaos of supporting a legacy system with part time students. 


### Communication

The first critical peice of the managment stack is communication. I know it's cliched, but sometimes cliches are true. If your team lacks good communication tools and culture, your products will suffer.

Our shop has a self hosted [GitLab][1] server, where we track all of our open issues. Every issue gets a number automatically, which we use heavily in our communication. Developers are also encouraged to use the issue discussion wall as a sort of mental dumping ground for any info that may be relevant to solving the issue. 

[Basecamp](https://basecamp.com/) handles our outward facing communications. Any time I'm contacted by a user about a bug or feature, I ask them if I can cross post the result of our discussion to Basecamp. This helps bring one on one conversations into the open, where other users who may be affected by the same issues can eavesdrop, or even contribute. Additionally, this improves my part timers ability to see context for the work they are assigned.

We use [Hipchat](http://hipchat.com) for our day to day chatting. I've found that having a less permanent comm tool helps greese the wheels of progress. This is where your team culture can really shine. We typically use this to share links, make jokes, and blow off steam. We only allow developers into this channel and that allows us to grow our own culture, in a less professional setting. Since we effectively have this channel open all the time, it allows for instant and critical messages to be broadcast to the whole team. 


### Organization

As mentioned before [GitLab][1] is really the lifeblood of our organization. It works the same way as GitHub, there are issues, pull requests, and milestones. Our team has found a comfortable working pace of one milestone per month. It's my duty to confer with the users and prioritze the issues into milestones. Then the part time developers get assigned to several issues within the current milestone based on their skill set and interest. 

Once a given developer feels her issue is solved, she puts up a pull request (in [GitLab][1], they are refferd to as Merge Requests). Then she usually notifies the team that she has a pull request up for review. 

This is where I try to leverage the part time nature of my crew to full effect. I'm working on issues of my own, so I don't always have time to drop what I'm doing to QA fixes from other developers. All pull requests have at least one review before they are accepted into the develop branch. Many times, a given part timer may only have an hour to work between classes. This is usually enough time to review someone else's fix, but rarely enough time to dig into one's own problem. The reviewer can run automated tests, scan the affected code, and highlight problems.


### Tracking

GitLab unfortuantely has a limited interface when it comes to monitoring work across a team and over time. Because of this, I've turned to [Gantt Project](http://www.ganttproject.biz/) as an additional tool in my management stack.

Gantt charting can be a bit like astrological charting, in that people expect accurate predictions out of wildly to impossibly hard to predict processes. Unlike astrology though, it has a few redeeming merits. (Sorry astrologers)

First, I've found that over the last eight months, with a milestone every 30 days or so, my team can be relied on to resolve around twenty two issues per milestone. 

Second, the Gannt chart allows me to identfy developers who are under or over burdened at a glance. That kind of knoweldge would take several screens in [GitLab][1].

Third, being able to keep an eye on individual issues that have been open for several days let's me step in to offer additional help to a developer who may be struggling, or just plain forgot he had an open issue!

There are a few more reasons to incorporate Gantt charting into your management stack, but I'll save those for a future article. Suffice to say, it's a pretty damn good management tool.

### Trust

Ultimately, a good team is built on trust. As the project manager and lead programmer, I have to trust that my part time developers are doing good work. They, in turn, have to trust that I am leading the project in the right direction. I have to trust that they are capable of good QA practices. They have to trust that I've given them the right problems to solve. 

Without trust in each other, this system breaks down. 

Hopefully, you've found some of these tips to be useful. Try implementing one at a time in your management stack and see if things improve.


[1]: https://about.gitlab.com/
