title: Chmod numbers versus letters.
<!-- date: -->
tags: [linux]
blurb: There are some interesting ways to manage file permissions in standard Linux environments.


There are some interesting ways to manage file permissions in standard Linux environments.

`chmod 777 folder`

I’m probably not the only person to be introduced to Linux file permissions through the wonderfully intuitive means of bit chart that looks like this:

	Binary	Becomes
	000		0
	001		1
	010		2
	011		3
	Binary	Becomes
	100		4
	101		5
	110		6
	111		7

`chmod g+s folder`


