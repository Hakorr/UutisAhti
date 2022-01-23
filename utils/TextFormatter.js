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

/*  Tessearct tries to read images inside the image, which causes random sentences like '$ d --== €% a v' 
-> This function tries to remove those, returns an array of strings (which will be later inputted to the site's search API) */
const cleanOcrResult = str => {
    ['\n','.'].forEach(x => {
        // Remove the char
        str = str.replaceAll(x, " ")
    })
    strArr = str.split(/(?=[A-Z])/); // Split by sentences
    strArr = strArr.filter(x => x.length > 10);
    strArr = validSentences(strArr);
    return strArr;
};

module.exports = { cleanOcrResult };