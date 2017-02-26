title: Installing GitLab on CentOS 6
date: 2017-02-26 9:00
tags: [devops, centos6, gitlab]
blurb: The long winding road to a functional University wide GitLab server.


# Prelude

Once a month, the various software developers here at UCF gather to discuss tips, tricks, and troubles of our jobs on campus. Sometimes these talks are punctuated by moments of clarity, one of which lead us to the discovery that many of the developers would benefit from having a shared git instance, where we could all see and contribute towards common code.

My department, the Center for Distributed Learning, maintains a department level GitLab server so I volunteered us to lead the charge in standing up a university level instance. This began back in May 2016, where initial requests were made to UCF Computer Services and Technology. CS&T is responsible for standing up CentOS VMs for us developers. 

Due to some early miscommunications, the first server was stood up mid June, but with a Windows 2012 image instead of the required CentOS image. 

## Around August, the box was ready!

Well, sort of, the CS&T department authorized admin access for the guy who *asked* for the VM, which wasn’t me. After some back and forth setting up a network admin account and authorizing it, I was finally able to ssh into the VM. This was early September.

About two weeks later, mid September, we began discussing an appropriate domain name for this machine. Top picks so far are “gitlab.ucf.edu” and “gitlab.ucfit.ucf.edu”. I think we could also work with “ucfit.ucf.edu/gitlab”.



## PYCURL Error 7 Troubles.

In the meantime, I’m working on installing the gitlab-ce packages to the VM following the CentOS 6 install instructions: https://about.gitlab.com/downloads/#centos6 . 
I’ve run into one major roadblock though, the university level Egress filter. Aka, the Big Firewall.

While I have asked for and had the “packages.gitlab.com” rule applied to this machine, it’s still giving me trouble when trying to curl key .xml files from the gitlab repository.

>Setting up Install Process
https://packages.gitlab.com/gitlab/gitlab-ce/el/6/SRPMS/repodata/repomd.xml: [Errno 14] PYCURL ERROR 7 - "couldn't connect to host"


Seen here, PYCURL is having some trouble. This appears to be a common problem with CentOS 6’s yum when located behind a firewall.

## Another way via mitmproxy?

Well, I know that I can get to things on my laptop. It was pointed out to me by a coworker that mitmproxy is a good tool for routing requests through a known good host.

`mitmproxy -p 8888` is all it takes to start the tool.

Then I can use `ssh -R 8888:localhost:8888 me@rando1234.net.ucf.edu` to get into the server I’m working on.

Once I’m logged into the server, I can set the proxy variable and test against reliable google.com:

>[me@server~]$ export http_proxy=http://localhost:8888
[me@server ~]$ curl -i google.com
HTTP/1.1 301 Moved Permanently
Location: http://www.google.com/
Content-Type: text/html; charset=UTF-8
Date: Wed, 12 Oct 2016 18:51:27 GMT
Expires: Fri, 11 Nov 2016 18:51:27 GMT
Cache-Control: public, max-age=2592000
Server: gws
Content-Length: 219
X-XSS-Protection: 1; mode=block
X-Frame-Options: SAMEORIGIN
`<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">`
`<TITLE&gt;301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>`
The document has moved
`<A HREF="http://www.google.com/">here</A>.
</BODY></HTML>`

And back on my laptop, I can see the request come through:

>2016-10-12 14:51:27 GET http://google.com/
                        ← 301 text/html 219B 95ms

Ok, so what now?

Oh right, yum! We need to run `sudo yum update` and see what happens…

>[me@server ~]$ sudo yum update
Loaded plugins: product-id, rhnplugin, search-disabled-repos, security, subscription-manager
This system is receiving updates from RHN Classic or RHN Satellite.
Setting up Update Process
https://packages.gitlab.com/gitlab/gitlab-ce/el/6/x86_64/repodata/repomd.xml: [Errno 14] PYCURL ERROR 7 - "couldn't connect to host"
Trying other mirror.
Error: Cannot retrieve repository metadata (repomd.xml) for repository: gitlab_gitlab-ce. Please verify its path and try again

Well, that doesn’t seem right. What’s going on here?

Let’s take a look at the yum.conf file in /etc/

>[main]
cachedir=/var/cache/yum/$basearch/$releasever
keepcache=0
debuglevel=2
logfile=/var/log/yum.log
exactarch=1
obsoletes=1
gpgcheck=1
plugins=1
installonly_limit=3
...
proxy=https://localhost:1080

Ah, so here at the last line it looks like I left in the proxy from the last time I was doing this. But wait, didn’t I use port 8888 this time? I did! So I’ll have to modify the proxy= line to point at port 8888 on my laptop where my mitmproxy is running.

>[me@server ~]$ sudo yum update
Loaded plugins: product-id, rhnplugin, search-disabled-repos, security, subscription-manager
This system is receiving updates from RHN Classic or RHN Satellite.
Setting up Update Process
https://packages.gitlab.com/gitlab/gitlab-ce/el/6/x86_64/repodata/repomd.xml: [Errno 14] Peer cert cannot be verified or peer cert invalid
Trying other mirror.
It was impossible to connect to the Red Hat servers.
This could mean a connectivity issue in your environment, such as the requirement to configure a proxy,
or a transparent proxy that tampers with TLS security, or an incorrect system clock.
Please collect information about the specific failure that occurs in your environment,
using the instructions in: https://access.redhat.com/solutions/1527033 and open a ticket with Red Hat Support.

>Error: Cannot retrieve repository metadata (repomd.xml) for repository: gitlab_gitlab-ce. Please verify its path and try again

Ok, so at least we’re getting somewhere. Now the update process is complaining about an invalid cert. This is probably because SSL is designed to fail when you have a man in the middle, right?

Right, so let’s disable that. I would never leave the server in this condition, but for the purpose of installing this one package, it’s ok. When I was looking for the /etc/yum.conf file I noticed another interesting dir.

>[me@server ~]$ ls /etc/yum.repos.d/
gitlab_gitlab-ce.repo  redhat.repo  rhel-source.repo

This gitlab_gitlab-ce.repo was added at a previous stage, when working on installing GitLab Community Edition. Let’s investigate!

>[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/6/$basearch
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

>[gitlab_gitlab-ce-source]
name=gitlab_gitlab-ce-source
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/6/SRPMS
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

So here we can see that sslverify is set to 1, enabled. This means that any time we are trying to pull updates from either of these sources, yum is going to try to verify that we aren’t being hit with a man in the middle attack. Yet, this is exactly what we are trying to do at the moment. Let’s set both of these sources to sslverify=0 and see what happens when we run yum update.

>[me@server ~]$ sudo yum update
Loaded plugins: product-id, rhnplugin, search-disabled-repos, security, subscription-manager
This system is receiving updates from RHN Classic or RHN Satellite.
Setting up Update Process
gitlab_gitlab-ce/signature                                                                                                                                                          |  836 B     00:00
Retrieving key from https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
Importing GPG key 0xE15E78F4:
 Userid: "GitLab B.V. (package repository signing key) <packages@gitlab.com>"
 From  : https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
Is this ok [y/N]: y
gitlab_gitlab-ce/signature                                                                                                                                                          | 1.0 kB     00:10 ...
gitlab_gitlab-ce/primary                                                                                                                                                            | 532 kB     00:00
gitlab_gitlab-ce                                                                                                                                                                                   173/173
gitlab_gitlab-ce-source/signature                                                                                                                                                   |  836 B     00:00
Retrieving key from https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
Importing GPG key 0xE15E78F4:
 Userid: "GitLab B.V. (package repository signing key) <packages@gitlab.com>"
 From  : https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
Is this ok [y/N]: y
gitlab_gitlab-ce-source/signature                                                                                                                                                   |  951 B     00:31 ...
gitlab_gitlab-ce-source/primary                                                                                                                                                     |  175 B     00:00
Resolving Dependencies
--> Running transaction check
…

Great! Now yum update asks us to add GPG keys for both of these sources, this means traffic is successfully routed through my laptop. 

I can actually see this happening back in mitmproxy in my other terminal window:

>GET https://packages.gitlab.com/gitlab/gitlab-ce/el/6/x86_64/repodata/repomd.xml
       ← 302 text/html [no content] 150ms

Now it’s just a matter of hopping back into our CentOS 6 build instructions:
https://about.gitlab.com/downloads/#centos6

Uh oh, problem with step 2.

>[me@server ~]$ curl -sS https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.rpm.sh | sudo bash
Detected operating system as redhatenterpriseserver/6.
Checking for curl...
Detected curl...
Downloading repository file: https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/config_file.repo?os=redhatenterpriseserver&dist=6&source=script
done.
Installing pygpgme to verify GPG signatures...
Loaded plugins: product-id, rhnplugin, search-disabled-repos, security, subscription-manager
This system is receiving updates from RHN Classic or RHN Satellite.
Setting up Install Process
https://packages.gitlab.com/gitlab/gitlab-ce/el/6/SRPMS/repodata/repomd.xml: [Errno 14] Peer cert cannot be verified or peer cert invalid
Trying other mirror.
It was impossible to connect to the Red Hat servers.
. . .

So this problem again? `“[Errno 14] Peer cert cannot be verified…”` ?? 
I thought I solved this with the sslverify=0 change. Let me inspect my /etc/yum.repos.d/gitlab_gitlab-ce.repo file again;

>[gitlab_gitlab-ce]
name=gitlab_gitlab-ce
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/6/$basearch
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

>[gitlab_gitlab-ce-source]
name=gitlab_gitlab-ce-source
baseurl=https://packages.gitlab.com/gitlab/gitlab-ce/el/6/SRPMS
repo_gpgcheck=1
gpgcheck=0
enabled=1
gpgkey=https://packages.gitlab.com/gitlab/gitlab-ce/gpgkey
sslverify=1
sslcacert=/etc/pki/tls/certs/ca-bundle.crt
metadata_expire=300

It’s back to 1?? What the hell. Something must be resetting it in the script.rpm.sh I’m pulling in step two.

Yup, here’s the offending line:

>Downloading repository file: https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/config_file.repo?os=redhatenterpriseserver&dist=6&source=script
done.

Peering into the shell script confirms that it’s overwriting my sslverify hack:

>yum_repo_path=/etc/yum.repos.d/gitlab_gitlab-ce.repo
  echo "Downloading repository file: ${yum_repo_config_url}"
  curl -sSf "${yum_repo_config_url}" > $yum_repo_path


Can we overload this source explicit flag with the more general yum.conf?

Apparently not:

>Total download size: 281 M
Installed size: 748 M
Is this ok [y/N]: y
Downloading Packages:
https://packages.gitlab.com/gitlab/gitlab-ce/el/6/x86_64/gitlab-ce-8.12.6-ce.0.el6.x86_64.rpm: [Errno 14] Peer cert cannot be verified or peer cert invalid

What if I manually grab the shell script and modify it before running it? I already have the required gitlab_gitlab-ce.repo file on hand…

Well, I could do that, but further inspection of the shell script reveals what it’s really doing, which I can repeat manually myself after disabling the sslverify flag.

>yum install -y pygpgme --disablerepo='gitlab_gitlab-ce'
yum install -y yum-utils --disablerepo='gitlab_gitlab-ce'
yum -q makecache -y --disablerepo='*' --enablerepo='gitlab_gitlab-ce'

These three key lines install pygpgme, yum-utils and makes a cache of everything. Makecache is purely a download speed performance improvement, so we can safely ignore that for now.

>[me@server ~]$ sudo yum install -y pygpgme --disablerepo='gitlab_gitlab-ce'
Loaded plugins: product-id, rhnplugin, search-disabled-repos, security, subscription-manager
This system is receiving updates from RHN Classic or RHN Satellite.
Setting up Install Process
gitlab_gitlab-ce-source/signature                                                                                                                      |  836 B     00:00
gitlab_gitlab-ce-source/signature                                                                                                                      |  951 B     00:00 ...
Package pygpgme-0.1-18.20090824bzr68.el6.x86_64 already installed and latest version
Nothing to do

>[me@server ~]$ sudo yum install -y yum-utils --disablerepo='gitlab_gitlab-ce'
Loaded plugins: product-id, rhnplugin, search-disabled-repos, security, subscription-manager
This system is receiving updates from RHN Classic or RHN Satellite.
Setting up Install Process
Package yum-utils-1.1.30-37.el6.noarch already installed and latest version
Nothing to do

Ok, great. Done with this shell script then!

Now we can move on to installing gitlab-ce…

Except every time I call sudo yum install gitlab-ce the install process times out when trying to grab the actual package. */rage*

# Scp is god.

So after dicking around with mitmproxy configuration for what felt like *way* too long, I finally gave up and called a friend in to rescue me. His focus is pen testing, so I thought surely he’d be able to tell me exactly what I was doing wrong. After explaining what I was trying to do, and the reason I wanted that package, he asked the dumb question: 

“Why don’t you just FTP it from your laptop to the server?”

Uh, because! Uh, because I thought mitmproxy was better? Uh, fuck you’re probably right. Ok, fine, but I don’t want to use FTP since I already have ssh access. 

Maybe I can just use scp.

10 minutes later I have the offending package waiting for me on the server.

Yum can install local packages.
https://wiki.centos.org/TipsAndTricks/YumAndRPM#head-3c061f4a180e5bc90b7f599c4e0aebdb2d5fc7f6

It’s not in the yum --help readout, but yum localinstall /path works a charm to install a local package.

![GitLab Command line logo](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_01.PNG)

## Don’t be afraid to admit defeat.

After spending a crazy long time trying to accomplish what I set out to, I was finally smart enough to realize that I was too dumb to do it a certain way. Always look for more than one way to skin a server. In this case, I could have used scp the first time and saved myself a lot of headache. Lesson learned.

![GitLab login page](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_02.PNG)
*The money shot!*

## Setting up LDAP
![My notes on LDAP](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_03.PNG)

After showing the UCF Dev Group the running server, they wanted to be able to login via their LDAP credentials. This is just a username/password combo, but it’s shared across university services. By default, GitLab uses a simple email/password for login.

Based on my conversation with Thomas, a server admin here who has done this before, I need to update some fields in a gitlab.yml file. So I need to find this particular file on my server:

`sudo find / -name ‘gitlab.yml’`

Reveals two files:

>/var/opt/gitlab/gitlab-rails/etc/gitlab.yml
/opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml

I’m guessing it’s probably the first, since the second looks like it’s buried in embedded services. The first is also located in `/var/opt` which is kinda typically where options variables are stored…

> This file is managed by gitlab-ctl. Manual changes will be
 erased! To change the contents below, edit /etc/gitlab/gitlab.rb
 and run `sudo gitlab-ctl reconfigure`.

Whoops. Ok, so it is an options file, but one that is auto generated. So let’s take a look at gitlab.rb:

> Configuration options with # in front are not active and they were
 valid at install time. Updating the package does not update this file
 automatically.

Here we go!

> For setting up LDAP
 see https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md#setting-up-ldap-sign-in
 Be careful not to break the indentation in the ldap_servers block. It is in
 yaml format and the spaces must be retained. Using tabs will not work.

On the right track.

Following the docs here: https://docs.gitlab.com/ce/administration/auth/ldap.html
So I put in all my user credentials for the LDAP settings and ran the sudo gitlab-ctl reconfigure command, where I saw the server compiling the results:

>Running handlers:
Running handlers complete
Chef Client finished, 9/289 resources updated in 31 seconds
gitlab Reconfigured!

But when I try logging into the server I get rejected on my LDAP creds. What’s up?

Fortunately, there’s a troubleshooting trick: 
`sudo gitlab-rake gitlab:ldap:check`

![Checking LDAP...](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_04.PNG)

Hm, that doesn’t seem right. I thought the compile command from before was supposed to set that flag in gitlab.yml?

![LDAP Settings](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_05.PNG)

>  ## LDAP settings
  # You can inspect a sample of the LDAP users with login access by running:
  #   bundle exec rake gitlab:ldap:check RAILS_ENV=production
  ldap:
    enabled: true
    sync_time:
    servers:
      main: {"label":"LDAP","host":"ldap://server.ucf.edu","port":389,"uid":"user@server.ucf.edu","method":"plain","bind_dn":"ou=Peopl$

Well that’s odd, because it looks like some of my settings were picked up properly. Somehow the enabled flag got set to false though.

Let’s examine the gitlab.rb file again:

![GitLab Settings](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_06.PNG)

>  gitlab_rails['ldap_enabled'] = false
  gitlab_rails['ldap_servers'] = YAML.load <<-'EOS' # remember to close this block with 'EOS' below
    main: # 'main' is the GitLab 'provider ID' of this LDAP server
      label: 'LDAP'


So, whoops! I forgot the flip the flag in here.

Let’s recompile and run our ldap check command again:

![Checking LDAP again](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_07.PNG)

>[me@server ~]$ sudo gitlab-rake gitlab:ldap:check
Checking LDAP ...

>LDAP users with access to your GitLab server (only showing the first 100 results)
Server: ldapmain
rake aborted!
Net::LDAP::Error: getaddrinfo: Name or service not known
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap/connection.rb:47:in `open_connection'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap/connection.rb:16:in `initialize'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap.rb:1240:in `new'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap.rb:1240:in `new_connection'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap.rb:682:in `block in open'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap/instrumentation.rb:19:in `instrument'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap.rb:680:in `open'
/opt/gitlab/embedded/service/gem/ruby/2.3.0/gems/net-ldap-0.12.1/lib/net/ldap.rb:616:in `open'
/opt/gitlab/embedded/service/gitlab-rails/lib/gitlab/ldap/adapter.rb:7:in `open'
/opt/gitlab/embedded/service/gitlab-rails/lib/tasks/gitlab/check.rake:786:in `block in print_users'
/opt/gitlab/embedded/service/gitlab-rails/lib/tasks/gitlab/check.rake:784:in `each'
/opt/gitlab/embedded/service/gitlab-rails/lib/tasks/gitlab/check.rake:784:in `print_users'
/opt/gitlab/embedded/service/gitlab-rails/lib/tasks/gitlab/check.rake:771:in `block (3 levels) in <top (required)>'
/opt/gitlab/embedded/bin/bundle:22:in `load'
/opt/gitlab/embedded/bin/bundle:22:in `<main>'
Tasks: TOP => gitlab:ldap:check
(See full trace by running task with --trace)

## Ah so at least we’re getting somewhere now.

Name or service not known? Maybe the host I provided isn’t accessible from this machine? I know there’s a university level firewall and these VMs are pretty tightly controlled. I wonder if I can curl it?

>DN:
	currentTime: 20161115153910.0Z
	subschemaSubentry: CN=Aggregate,CN=Schema,CN=Configuration,DC=root,DC=ucf,DC=edu
	dsServiceName: CN=NTDS Settings,CN=NET1400,CN=Servers,CN=AzureEastUS,CN=Sites,CN=Configuration,DC=root,DC=ucf,DC=edu

So I get some results back. Probably not a firewall issue.

After asking my Sysadmin, he said I should use ldaps since it requires a secure binding.

>Checking LDAP ...

>LDAP users with access to your GitLab server (only showing the first 100 results)
Server: ldapmain
rake aborted!
Net::LDAP::Error: getaddrinfo: Name or service not known

Still no dice though. :/ 

After looking through the gitlab.rb file again and on the advice of my SysAdmin I made some adjustments to the settings.

>  gitlab_rails['ldap_enabled'] = true
  gitlab_rails['ldap_servers'] = YAML.load <<-'EOS' # remember to close this block with 'EOS' below
    main: # 'main' is the GitLab 'provider ID' of this LDAP server
      label: 'LDAP'
      host: 'server.ucf.edu'
      port: 636
      uid: 'username'
      method: 'ssl' # "tls" or "ssl" or "plain"
      bind_dn: 'username@server.ucf.edu'
      password: 'password'
      active_directory: true
      allow_username_or_email_login: false
      block_auto_created_users: false
      base: 'CN=UCF - Enterprise Email,OU=Exchange,OU=Groups,DC=net,DC=ucf,DC=edu'
      user_filter: ''
      attributes:
       	username: ['uid', 'userid', 'sAMAccountName']
       	email:    ['mail', 'email', 'userPrincipalName']
       	name:       'cn'
       	first_name: 'givenName'
       	last_name:  'sn'
     ## EE only
      group_base: ''
      admin_group: ''
      sync_ssh_keys: false

It turns out, I needed to specify “ssl” as the method and that meant I could drop the “ldaps://” portion of the host I provided, since it would be automatically added by the connector.

![Some LDAP success](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_09.PNG)

Money shot!

## But can I login now?

![Failed login](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_10.PNG)

*Apparently not.*

So what’s going on here? The server clearly has access to LDAP now, and it’s not throwing any more configuration errors. Still, I can’t login with my known good credentials.

Could it be “bind_dn” or “base”?

According to the docs here: https://docs.gitlab.com/ce/administration/auth/ldap.html

>“If there is an unexpected error while authenticating the user with the LDAP backend, the login is rejected and details about the error are logged to production.log.”

So let’s find and tail that file: `/var/log/gitlab/gitlab-rails/production.log`

>[me@server ~]$ sudo tail /var/log/gitlab/gitlab-rails/production.log
Completed 200 OK in 37ms (Views: 15.1ms | ActiveRecord: 2.4ms)
Scheduling removal of build artifacts
Started POST "/users/auth/ldapmain/callback" for 10.171.155.57 at 2016-11-16 10:53:23 -0500
Processing by OmniauthCallbacksController#failure as HTML
  Parameters: {"utf8"=>"✓", "authenticity_token"=>"longstring", "username"=>"me", "password"=>"[FILTERED]"}
Redirected to http://server.ucf.edu/users/sign_in
Completed 302 Found in 19ms (ActiveRecord: 1.9ms)
Started GET "/users/sign_in" for 10.171.155.57 at 2016-11-16 10:53:23 -0500
Processing by SessionsController#new as HTML
Completed 200 OK in 41ms (Views: 17.5ms | ActiveRecord: 2.9ms)

So there really aren’t many clues here…

Let’s take a look at the ldapcheck response again:

![Clueless LDAP](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_11.PNG)

So if we read this carefully, I should expect to see a list of authorized users here. Does that mean the request is going through but getting no results?

I finally got my SysAdmin to show me how he was doing it. Turns out, I had a few other things mixed up.

‘Uid’ is supposed to be set to “sAMAccountName” which I assume means that’s where the ldap call is looking to match the user id against what I’ve supplied in the first field of “base”. 

Also, we need to fill bind_dn with “user@server.ucf.edu” 

Finally, we need to add a user_filter so we don’t get everyone in the university.  

This is what it all looks like, I’ve obfuscated server names and passwords:

>  gitlab_rails['ldap_enabled'] = true
  gitlab_rails['ldap_servers'] = YAML.load <<-'EOS' # remember to close this block with 'EOS' below
    main: # 'main' is the GitLab 'provider ID' of this LDAP server
      label: 'LDAP'
      host: 'server.ucf.edu'
      port: 636
      uid: 'sAMAccountName'
      method: 'ssl' # "tls" or "ssl" or "plain"
      bind_dn: 'user@server.ucf.edu'
      password: '#######'
      active_directory: true
      allow_username_or_email_login: false
      block_auto_created_users: false
      base: 'OU=People,DC=net,DC=ucf,DC=edu'
      user_filter: '(memberOf=CN=UCF - Enterprise Email,OU=Exchange,OU=Groups,DC=net,DC=ucf,DC=edu)'
      attributes:
       	username: ['uid', 'userid', 'sAMAccountName']
       	email:    ['mail', 'email', 'userPrincipalName']
       	name:       'cn'
       	first_name: 'givenName'
       	last_name:  'sn'
     ## EE only
      group_base: ''
      admin_group: ''
      sync_ssh_keys: false



## Yatta!

There you have it. It may have taken a while, but I learned a lot along the way. When you apply yourself to a new task, don’t be overwhelmed, be overwhelming!
 
![Yatta!](https://raw.githubusercontent.com/phillyc/phillyc.github.io/master/static/img/ucf_gitlab_12.PNG)
