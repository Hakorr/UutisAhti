const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const multer = require("multer");
const path = require("path");
const cors = require("cors");
const rateLimit = require('express-rate-limit');

const ArticleHandler = require("./utils/ArticleHandler");
const settings = require("./settings");

let corsOptions = {
    origin: settings.config.frontend,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

const limitRequests = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 2
});

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, callback) => {
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 //1 MB
    }
});

if(process.env.NODE_ENV == "production") {
    console.log("Using production build")
    app.use(express.static("client/build"));
    app.get("*", (req, res) => {
        req.sendFile(path.resolve(__dirname, "client/build", "index.html"));
    });
}

app.post("/api/search", upload.single('image'), limitRequests, (req, res) => {
    console.log("\nReceived an API request to mass search articles...");
    let imagePath = req?.file?.path;
    if(imagePath) {
        ArticleHandler.initiateSearch(imagePath, 'image', result => {
            console.log("\nResponding to the API call!");
            res.json(result);
        });
    } else  {
        let reqText = req.body?.text;
        if(reqText) {
            ArticleHandler.initiateSearch(reqText, 'text', result => {
                console.log("\nResponding to the API call!");
                res.json(result);
            });
        } else {
            console.log("Aborting! Neither text or image was found on the request.")
            res.json({
                'success': 0,
                'reason': "Invalid data"
            });
        }
    }
});

function errHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        res.json({
            'success': 0,
            'message': err.message
        });
    }
}

app.use(errHandler);

app.listen(port, () => console.log(`Backend up and running on port ${port}`));