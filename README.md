# girelloni.com - A tool to generate and maintain a blog using Google spreadsheets

The tool automatically download data from Google Drive and generate all the posts of the Blog.

It handles multi-part posts, labels, images, etc.

It also handle bilingual blogs.

This the Google spreadsheet used to generate the blog:
Girelloni

[https://docs.google.com/spreadsheets/d/1fW-LlMLBUNP6d7UaAP8C1PuBhKBOcJpE62dBYwr1vKA/pubhtml](Google Spreadsheet)

This is the resulting blog:

* English: [http://www.girelloni.com](www.girelloni.com)
* Japanese: [http://ja.girelloni.com](http://ja.girelloni.com)

## Installation

Clone the project and run

`npm install`

To generate the css files run

`grunt build`

## Commands

To download the data from Google Spreadsheet

`$ node source/scripts/download.girelloni.com.js > ./last.json`

To generate the pages

`$ node source/scripts/home.js`

Pages are generate in the folder

`build/development/`

