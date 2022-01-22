const Tesseract = require("tesseract.js");

const read = (file, callback) => {
    console.log(`Tesseract is analyzing ${file}...`)
    Tesseract.recognize(
        file, 
        'fin',
    ).then(({ data: { text } }) => {
        console.log("Tesseract successfully extracted data from the image!")
        callback(text);
    });
}

module.exports = { read };