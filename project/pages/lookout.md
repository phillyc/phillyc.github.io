title: Lookout for cheaters!
date: 2017-02-28 9:00
tags: [infosec, machine learning]
blurb: How do we know student employees aren't using their power to cheat?

## Intro

We love working with student employees. 

They have the best ideas because they feel the pain of daily student life. We need to give them elevated powers in Canvas so they can help us build awesome tools, but with great power comes great responsibility. 

*How do we know they aren't using this power to cheat?*

Great security comes in multiple layers. If you were trying to rob a bank, do you think the bank would *only* use security cameras? No! Banks have heavy front doors, guards, alarms, bullet-proof glass, dye-packed bills, etc. etc. etc. 

Similar to banks, we have a variety of security measures and principles in place to keep our employees honest.

I should point out that is is not only student employees who should be monitored, but anyone with elevated permissions in the system!

## The chilling effect of monitoring.

The first layer of security comes from training.

We make a big point of educating every new hire on our ability to monitor and catch bad actors.

We make no secret of our security principles, but our security practices are secret. 

We take pains to inform every new employee that we have lots of ways of catching them, but we never tell them exactly how or what we are doing. 

*In this case, it is quite alright to rely on the chilling effect of fear!*

## Principle of least privilege.

The second layer of security comes from access control. 

In the infosec and compsci fields, we have a rule of thumb we call [“Principle of Least Privilege.”][https://en.wikipedia.org/wiki/Principle_of_least_privilege]

This just means, don’t give powers to people who don’t need it!

In the bank example, you wouldn’t give the keys to the vault to the janitor. He only needs the keys to the front door and the bathroom. Where the teller may only need keys to the cash drawer and nothing else. In this way, the bank limits the number of people who have keys to the whole kingdom!

In our case, Canvas gives us the ability to limit the power a particular user role has within the system. We spend a good deal of time deciding who gets the more dangerous powers, like manipulating grades. We accept that part of our job as good stewards is making these decisions. 

We *never* write blank checks when it comes to access!

## Collect behavioral data.

The third layer of security comes from monitoring.

We collect and analyze behavioral data from Canvas. There is a critical piece of data known as a page_view that represents a given user’s request for a system resource.

This is what they look like:

```
Working Network ID:
	Foo1234
Course Name:
	Online@UCF Support Training
Course Code:
	Webcourses@UCF Support Training
Course ID:
726415	
Datetime:
	2017-02-27T16:07:09Z
URL:
	https://webcourses.ucf.edu/courses/726415/quizzes/918413
Action:
	Show
IP:
	131.170.15.255
```

The general idea is that a user logs into Canvas, look around at a few pages and then logs out. Each step of the way a page view is logged. If they are just looking, it will be tagged as “show.” If they take an action, “action”, and if they edit, “edit”.

We collect all of this data to get an idea of where the user was going and what they were doing in the system.

In the metaphorical bank, this is the footage from the security cameras.

## Auto flag suspicious behavior.

Once all of the behavioral data is collected, we scan it for suspicious activity.

Think of this like the motion detectors in the bank.

Our script parses through thousands of lines of page views and highlights courses and actions that meet certain criteria. I won’t go into specifics here, for security reasons, but we end up with a much shorter list of possibly suspicious page views. 

## Human inspect the results.

Every morning, with coffee, two employees briefly review the previous night’s results.

This is like the bank managers reviewing the daily records.

We use two people, so that a single reviewer can’t cheat.

In the military, this is called “two person accountability.” If it’s good enough to guard state secrets, it’s good enough for us!

If we see something suspicious, we raise the alarm to our superiors.

99.9% of the time the results are harmless, but when something stands out, it is evaluated and passed up the organization to the executive team.

## Good security requires adaptation.

Like any good bank, we are constantly evolving and improving our detection methods. 

I’ve only outlined the general framework here to highlight how to solve this problem. 
The interesting thing about security is that it is a never ending game. The bad guys are always trying to figure out new methods and us good guys get to stop them.

Since we are tasked with staying one step in front of the bad guys, we are starting to build a machine learning network to incorporate more adaptive filtering of the behavioral data. 

## The risk is worth the rewards.

We get amazing results from hiring student employees. It is so critical for university staff to stay connected in meaningful ways with the student population, so we can’t be afraid of letting them carry some of the weight.

It can be scary trusting part time student employees, but with the right tools in place, it is a huge win for the university.
