title: Code first hiring sucks for everyone involved
date: 9/17/2017 15:00
tags: [business, code]
blurb: You may want to reconsider your hiring habits.

## I realize this is inflammatory. 

You may have a special snowflake reason for putting potential hires through code tests before asking culture or company fit questions. I'm going to make the case for why this hiring practice should be avoided.

First, a little background. I've been job hunting full-time for a little over two months now after relocating for family reasons. I'm a mid to senior level developer with over 6 years of experience with my stack and 11+ years of highly technical work. I'm confident in my skills and approach to complex programming problems. 

*I have no issue with code homework as hiring practice.*

I have an issue with asking for homework before talking directly with candidates first.

## No love, no work.

As a company, you have built little or no rapport with me as an engineer. If the first thing I am greeted with is a canned email instructing me to complete homework, we're already off to a bad start. As a company, are you really so *inundated* with engineering talent that you can afford to be robotic about hiring humans? When you fail to build basic rapport with potential employees before asking for homework, it sets a bad tone. 

Going through some preliminary questions and getting to know you is important. As a potential employee, I'm *much* more willing to do some homework if I feel like I can trust you. Asking for code first signals that your company may treat other interactions in a similar manner. 

*I want to work with humans, not task robots.*

## Homework eats developer time.

Code homework takes a lot of developer time. Basic interview questions could weed out many potentials well before you ask for *hours* of time from busy job seekers. 

As a job seeker, I need to know some critical information about your company before I proceed. How long have you been in business? How are you funded? What does your daily routine look like? How is your management team structured? What is the salary range for the position? Really, I want to know if you as a company will be in business in six months to a year. I may self-select out of the process before ever reaching the homework stage if a basic get-to-know-you is done. 

A 3 to 4 hour coding assignment is *half* of my productive day.

Consider that I could likely research and apply to 10 other companies in that same amount of time. Ask yourself, are they all making me do code homework before at least having a pre-screen? Can you afford to alienate a good developer when others aren't? 

It's even worse if you consider already full-time employed engineers. Ask yourself if you would be willing to sacrifice a night of rest and recovery with your family or friends for a shot at a company who hasn't even bothered to reach out to you personally. 

## Homework eats hiring team time.

Code homework takes a lot of hiring team time. Consider that you get 10 candidates and ask for code up front. If each exercise takes 3-4 hours to complete, it's a large enough project that it will take at least a hour to review. How many people on your team are reviewing homework? 2? That's 20 hours of review time that your team as spent on candidates. Then consider the amount of time spent in back and forth emails about the project. If you ask some preliminary questions first, you could potentially reduce the number of homeworks for review to in half, and thus cut your hiring team time in half.

Bottom line: *stop wasting your time in homework first situations.*

## You miss out on great developers.

Put yourself in the shoes of a solid mid-to-senior level developer with 10 years of experience. They will likely receive 5-10 unsolicited recruitment messages a month through various social media channels. Most of these chats go nowhere, but when a solid senior level developer is ready to make a career change, it happens fast. I've personally seen senior devs hired within 24 hours of asking their network.

If presented with code-before-talk situations, great developers will skip.

## Other really common mistakes. 

Still, you may insist on using coding homework as a talent validation. There's nothing wrong with this in the right place in the hiring pipeline, but hiring employers need to get it right the first time or the candidates will walk.

1. No specific deadlines or time lines. 
	"Please do your coding exercise as soon as possible"
	You need to tell me what a reasonable amount of time to completion. 

2. Poor grammar, spelling, punctuation.
	It makes your company look sloppy and unprofessional.

3. Unclear parameters or goals for the code.
	Be very specific and clear about what is required in the homework will cut way down on back-and-forth emails.

4. Unclear where or how to ask for feedback.
	Be specific about how to get feedback or clarification in your initial design document.

## Here's a real code-first email I've received. 

I've only changed the company name and links.

"""
subject: Your application @ COMPANY for the role as Full Stack Developer

Dear Philip

Thank you for your application and your interest in COMPANY.

Your CV has caught our attention, your skillset might be the one we're looking for. We @ COMPANY are happy to have a great team of talents on board. Every candidate has the opportunity to show his skills before the interview. Therefore we have created a code challenge on the link below:

https://docs.google.com/document/d/foo

Please do your coding exercise as soon as possible and once completed send the access to a Git repo (Github or Gitbucket).

We look forward reviewing the results and hopefully welcome YOU onboard soon.

Do your best and while your doing it don't forget to have fun!

COMPANY Talent Team
"""

And here's what I found in the linked document. 


Job Evaluation: Senior Python/ Django Developer

Build a single page app with a full viewport map on top and a list of addresses below based on Django 1.9.

Use case: If I click any location on the map: validate that this has a real address and it’s not some wood/mountain/ocean, etc. 
If valid: save it to a simple db table with lat, lon, address (can be single string) and also to google fusion tables (decide what data). 
Have a marker appear instantly after the click on the map based on the google fusion table data. 
Update the list of addresses underneath the map with the location where you clicked. 
Duplicates on google fusion table are not allowed. 
I can reset all data on google fusion tables and the database and start fresh

Please note: solution can be ugly, but code quality, architecture, completeness should be as good as you can. This solution is doable in 3-4 hours.

Criteria for the evaluation:
	documentation
	do others understand the code without knowing the task
	architecture / performance / code structure
	bugs?
	task completely done?
	communication before and after the task
	runs out of the box with `virtualenv .ve && pip install -r requirements.txt && ./manage.py [syncdb|migrate|runserver]` on python3/sqlite

## TL;DR

Don't ask for code homework before having a basic screening conversation. It's wasting everyone's time.

