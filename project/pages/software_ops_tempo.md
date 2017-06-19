title: Measuring Software Operations Tempo
date: 2017-06-19 9:00
tags: [business, devops, excel]
blurb: As a long time member of the twenty two person strong web development team at UCF’s Center for Distributed Learning, I have stepped up to the challenge of measuring Ops Tempo for our group.

# What is Ops Tempo?

In the military, there is a frequently used term “Ops Tempo” which usually denotes the pace and frequency of operations on a military base, a unit, or even for an individual. There are several key things at each level that are measured to give command staff an understanding of current workload and what they may be able to accomplish under similar circumstances.

As a long time member of the twenty two person strong web development team at UCF’s Center for Distributed Learning, I have stepped up to the challenge of measuring Ops Tempo for our group.

I’d like to share my efforts and findings with the broader community. I’ve changed all the names to protect my coworker’s privacy.

## The setup:

We have a single shared Google Sheet, which represents our overall portfolio of projects. We put everything on there that is relevant to the work we do. Many of the rows in the sheet are ongoing or pending applications, but a few things are research efforts or other support type projects.

While we don’t have a good measure of the total time each project absorbs, we can start with some simple counts as a first attempt metric.

## Basic counts:

Fortunately, Google Sheets has some useful formulas that I can bend to my needs.

Since each row in the Overall Portfolio sheet represents a project, I can count the number of times a person is mentioned by name in the Assigned To column.

I’m working on a different tab in the same document, so I’ll need to import the data range first:

`=IMPORTRANGE(“1289hsuhsdf982HIUHF89”, “Overall Portfolio!C2:2000”)`

The first argument is the unique id of the Google Sheet, which is part of the url: 

`https://docs.google.com/spreadsheets/d/1289hsuhsdf982HIUHF89/`

This brings in every entry in that column between row 2 and 2000.

Then we just stick this into a COUNTIF, where the second argument is the string we are looking for. I’ve added asterisks to either side, because sometimes there are multiple comma separated values in the field.

`=COUNTIF(IMPORTRANGE("1289hsuhsdf982HIUHF89", "Overall Portfolio!C2:C20000"), “*Philip*")`

And we get a nice count of every time I’m mentioned by name in the Assigned To column.

I’m not sure yet if this is an important metric, but we can argue it out now.

## To be cont.
