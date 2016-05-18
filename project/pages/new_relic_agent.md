title: Setting up the New Relic agent for Django .wsgi
date: 2016-5-20 9:00
tags: [python, new relic]
blurb: Quick and dirty New Relic agent setup for Django's .wsgi file system.

Setting up the New Relic agent is quite easy for a .wsgi application.

We have a pretty typical .wsgi file:

	import os,sys
	import newrelic.agent
	
	newrelic.agent.initialize()
	
	sys.stdout = sys.stderr
	
	sys.path.append('/usr/local/lib/python2.7')
	sys.path.append('/usr/local/lib/python2.7/site-packages')
	
	os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
	
	root_path = os.path.abspath(os.path.split(__file__)[0])
	sys.path.insert(0, root_path)
	
	from django.core.wsgi import get_wsgi_application
	application = get_wsgi_application()

### The important bit is here:

	import newrelic.agent
	
	newrelic.agent.initialize()

Two things to note here, first, the import and init of the agent *must come first* in the .wsgi file, otherwise the New Relic agent won't function properly. Now notice that the `initialize()` function is currently empty. This means the agent will initialize nothing and we won't see any reporting metrics in our New Relic dashboard.

Every time I deploy, I need to add the absolute path to the New Relic agent initializer in the .wsgi file. This tells the New Relic agent where to find the newrelic.ini file, which carries settings flags. I can’t check the path into the Git repo, because developer instances run the Django included `runserver` and the QA path is going to be different than the Production path.

	[me@server application]$ l
	total 60K
	drwxrwxr-x.  8 me	 nginx  4.0K 	Apr 14 14:00 .
	drwxrwsr-x. 14 nginx nginx  4.0K 	Mar 16 09:05 ..
	lrwxrwxrwx   1 me	 me	   	28 		Apr 14 14:00 current -> releases/2016.04.14_13.53.50
	drwxrwxr-x.  8 me	 me	 	4.0K 	Mar 12  2015 .git
	-rwxrwxr-x.  1 me	 me	   	72 		Mar 12  2015 .gitignore
	-rwxrwxr-x.  1 me	 me	  	448 	Mar 12  2015 go
	drwxrwxr-x.  2 me	 me	 	4.0K 	Apr 14 14:00 gobot
	-rwxrwxr-x.  1 me	 me	  	562 	Apr 14 13:45 go_config.json
	drwxrwsr-x.  2 me	 nginx  4.0K 	May 18 04:00 logs
	-rwxrwxr-x   1 me	 nginx  8.6K 	Mar 11 17:16 newrelic.ini
	lrwxrwxrwx   1 me	 me	   	29 		Apr 14 14:00 prev -> releases/2016.03.31_16.52.49/
	-rwxrwxr-x.  1 me	 me	 	1.9K 	Mar 12  2015 README.md
	drwxrwxr-x.  7 me	 nginx  4.0K 	Apr 14 13:53 releases
	drwxrwxr-x.  3 me	 nginx  4.0K 	Mar 12  2015 .repositories
	drwxrwxr-x.  3 me	 nginx  4.0K 	Mar 12  2015 shared	

Here you can see that the `newrelic.ini` file currently lives in the parent directory as a sibling of the release directories. This isn't the best place to put it though, since our nifty little GoBot is already configured to symlink the `shared` directory across releases. 

## There’s a better way to do this.

### Preserving the state of the newrelic.ini file on deploy.
First, I want my `newrelic.ini` file to have deploy persistance, basically, I want it to always be available in the `current` directory.

Second, I want to keep track of what the file looked like on previous deploys. This would allow me to debug problems with the New Relic settings.

As it happens, our GoBot can handle both of these tasks. Basically, it will copy the `newrelic.ini` file from `shared` into `current`, switch the `current` symlink to the new release, then create a symlink in the new `current` to the original `newrelic.ini` file in `shared`. That file is never moving, but we are preserving the state of the file as it was when we are deploying new code. This will make it much easier to spot configuration drift if something goes wrong with New Relic.

### Telling .wsgi where to find the newrelic.ini

Remember this line from before? `newrelic.agent.initialize()`?

We need to insert the path to newrelic.ini in the init function, like so: `newrelic.agent.initialize('/path/to/newrelic.ini')`

I need this path to be absolute, because it's the New Relic agent looking, not the Python process.

Turns out, I can reuse some Python code, with the `sys` library. Even better that I already have what I need in the .wsgi file!

	sys.path[0]

This is pretty basic, but it outputs the first item in the `sys.path` list, which happens to be the absolute path to the current file.

In this case I get `/var/www/vhosts/site/application` and I need to append `newrelic.ini`.

So we'll put the `newrelic.ini` file in `/shared` after configuring GoBot to symlink it into `/current`. 

Now our code should look like this:

	import newrelic.agent
	
	newrelic.agent.initialize(sys.path + '/newrelic.ini')

The cool thing is, I can now check my .wsgi file into git and not worry about server configuration!

