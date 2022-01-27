// Returns sentences which average word length is over 2
const validSentences = strArr => {
    let result = [];
    strArr.forEach(sentence => {
        let splitted = sentence.split(" ");
        let lengthsCombined = 0;
    
        splitted.forEach(x => lengthsCombined = lengthsCombined + x.length);
        
        let average = lengthsCombined / splitted.length;
        if(average > 2) result.push(sentence);
    });

    return result;
};

const splitByCapitalLetters = str => {
    ['\n','.'].forEach(x => {
        // Remove the char
        str = str.replaceAll(x, " ")
    });

    let strArr = str.split(/(?=[A-Z])/); // Split by capital letters

    strArr = strArr.filter(x => x.length > 10);
    strArr = validSentences(strArr);

    return strArr;
};

const splitBySentences = str => {
    let strArr = str.split('.'); // Split by dots

    strArr = str.split('\n'); // Split by new lines
    strArr = strArr.filter(x => x.length > 10);
    strArr = validSentences(strArr);
    ['\n','.'].forEach(x => {
        strArr = strArr.map(str => str.replaceAll(x, " "));
    });

    return strArr;
};

/*  Tessearct tries to read images inside the image, which causes random sentences like '$ d --== €% a v' 
-> This function tries to remove those, returns an array of strings (which will be later inputted to the site's search API) */
const cleanOcrResult = str => {
    let strArr = splitByCapitalLetters(str);
    splitBySentences(str).forEach(x => {
        strArr.push(x);
    });

    return strArr;
};

module.exports = { cleanOcrResult };