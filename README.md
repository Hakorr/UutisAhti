# UutisAhti - A Finnish News Article Mass Searcher

There's no need to ponder which site a quote was taken from, or if a screenshot of an article was modified, anymore. UutisAhti helps people to find articles with a click of a button. Users can input either text or an image.

UutisAhti uses the site's search API to find results. It uses a basic scoring system based the amount of sentences found, and their lengths. The system perfoms poorly if the site's search API returns unmatching results. This is unfortunetaly the case for many Finnish news article sites, many don't even have an API in the first place. 

## Example use case

A subreddit (specifically r/Suomi) had an image containing a piece of an article, by downloading the image and using UutisAhti, I was able to get the exact article the screenshot was taken from. If you're curious, [here's the article](https://www.iltalehti.fi/ulkomaat/a/8cc1a2b7-9c4c-4a8b-8f08-e93f97543be3).

<img src="https://github.com/Hakorr/UutisAhti/blob/master/assets/example.png" alt="example" style="width:700px;"/>

## Currently supported sites

* Aamulehti
* Helsingin Sanomat
* Iltalehti
* IltaSanomat
* Kauppalehti
* Satakunnan Kansa
* Tivi
* Uusi Suomi
* Yle

## Dependencies

#### Front-end (React)

* axios

#### Back-end (Node.js)

* cors
* express
* express-rate-limit
* multer
* request
* tesseract.js

## Configuration & Development

To get UutisAhti working on your local machine, you'll need to change one thing.

* Navigate to `client/src/Config.js` & change the backend's value to localhost:5000

The basic npm commands start the application.

* Front-end & back-end both start with `npm start`

The front-end auto refreshes, however the back-end needs an restart for changes to appear.

## Important notes

If you're a professional developer, approach the project carefully, as this was my first front-end, back-end and fullstack development project. You will find some oddities in file structure and the code itself. I hope you understand, and don't lose your calm.
