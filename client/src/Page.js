import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import Wave from 'react-wavify';
import ArticleResult from './ArticleResult';
import Config from './Config';
import './Page.css';

// Most of the code probably needs some refactoring, prepare yourself if you're a React developer

const Page = () => {
    const configStrings = Config.strings[Config.language];
    const defaultInputInfo = configStrings.no_input;
    
    const [inputInfo, setInputInformation] = useState(defaultInputInfo);
    const [inputData, setInputData] = useState("");
    const [files, setFiles] = useState([]);
    const [lastUsedInput, setLastUsedInput] = useState("");
    const [fetching, setFetching] = useState(false);
    const [resultsLabelStyle, setResultsLabelStyle] = useState({
        'visibility': 'hidden'
    });

    const [articles, setArticles] = useState(() => {
        return [];
    });

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(
                        file, { preview: URL.createObjectURL(file) }
                    )
                ),
                setInputInfo(false, acceptedFiles[0].name),
                setLastUsedInput("image")
            );
        },
    });

    const setInputInfo = (asText, data) => {
        if(asText) {
            if(data.length == 0 && files.length > 0) setInputInformation(
                `${configStrings.searching_with_image}: "${files[0].name}"`
            );
            else if (data.length == 0) setInputInformation(
                defaultInputInfo
            );
            else {
                setInputInformation(`${configStrings.searching_with_text}: "${data.split(" ").slice(0, 1).join(" ")}..."`);
                setInputData(data);
                setLastUsedInput("text");
            }
        } 
        else setInputInformation(`${configStrings.searching_with_image}: "${data}"`);
    };

    const handleResults = articles => {
        let cleared = articles.filter(article => article.score != 0);
        if(cleared.length > 0) {
            for(let i = 0; i < cleared.length; i++) {
                (i == 0) 
                    ? cleared[i]["bestArticle"] = true
                    : cleared[i]["bestArticle"] = false;
                let reversedIndex = (cleared.length - i == cleared.length) 
                    ? 1 
                    : (cleared.length - i) / 10;
    
                cleared[i]["frameOpacity"] = reversedIndex;
            }
            setResultsLabelStyle({ visibility: "visible" });
            window.location.replace("/#results");
            return cleared;
        }
        else {
            console.log("No articles were found!");
            
            setResultsLabelStyle({ visibility: "hidden" });
            alert(`${configStrings.no_results}`);
            return [];
        }
    };

    const startSearch = () => {
        if(fetching) {
            alert(configStrings.error_request_in_progress);
            return;
        }

        const formData = new FormData();
        if(files[0] && lastUsedInput != "text") {
            formData.append('image', files[0]);

            console.log("Sending a request to the backend...");
            setInputInformation(`${configStrings.request_pending}`);
            setFetching(true);

            axios.post(`${Config.backend}/api/search`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }).then(x => {
                setInputInfo(false, files[0].name);
                setFetching(false);
                let res = x.data;

                if(res['success'] == 1) {
                    console.log("Request successfully completed!");
                    setArticles(handleResults(res?.articles));
                } else {
                    console.log("API returned an error, the search failed!");
                    alert(`${configStrings.server_error}: ${res?.reason}`);
                }
            });
        }
        
        else if(inputData) {
            formData.append('text', inputData);

            console.log("Sending a request to the backend...");
            setInputInformation(`${configStrings.request_pending}`);
            setFetching(true);

            axios.post(`${Config.backend}/api/search`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            }).then(x => {
                setInputInfo(true, inputData);
                setFetching(false);
                let res = x.data;

                if(res['success'] == 1) {
                    console.log("Request successfully completed!");
                    setArticles(handleResults(res?.articles));
                    window.location.replace("/#results");
                } else {
                    console.log("API returned an error, the search failed!");
                    alert(`${configStrings.server_error}: ${res?.reason}`);
                    
                }
            }).catch(error => {
                setInputInfo(
                    lastUsedInput == "image" ? false : true, 
                    lastUsedInput == "image" ? files[0].name : inputData
                );
                setFetching(false);

                try {
                    switch(error.response.status) {
                        case 429:
                            alert(`${configStrings.request_ratelimit_error}`);
                            break;
                        default:
                            alert(`${configStrings.unknown_request_error}\n\n${error.response.status}: ${error.response.statusText}`);
                            break;
                    }
                } catch(err) {
                    alert(`${configStrings.unknown_request_error}\n\n${err}`);
                }
            });
        }
        
        //If no image or text
        else {
            console.log("No data found.");
            alert(configStrings.no_data_set);
        }
    };

    return (
    <>
    <div className="center-frame">
        <div className="center-area">
            <h1 className="title">
                {configStrings.main_title}
                <p className="small-title">{configStrings.secondary_title}</p>
            </h1>
            <div className="inputbox-area">
                <div className="textinput">
                    <textarea 
                        className="textarea" 
                        type="text" 
                        onChange={(e) => setInputInfo(true, e.target.value)} 
                        placeholder={configStrings.text_input_placeholder}
                    />
                </div>
                <div className="dragdropinput" {...getRootProps()}>
                    <input {...getInputProps()} />
                    <div className="dragdropbox">
                        <h1 className="droptext-1">
                            <p>{configStrings.drag_and_drop}</p>
                            <p className="droptext-2">{configStrings.drag_and_drop_filetype}</p>
                        </h1>
                    </div>
                </div>
            </div>
            <p className="tip">{configStrings.instructions}</p>
            <div className="bottompanel">
                <div className="selectedinput"><p className="inputinfo">{inputInfo}</p></div>
                <button className="fetchButton"onClick={startSearch}>{configStrings.fetch_button_search}</button>
            </div>
        </div>
    </div>
    <div className="fill"/>
    <Wave fill='#0099ff' paused={false}/>
    <p id="results" style={resultsLabelStyle}>{configStrings.results}</p>
    <div className="resultContainer">
        {
            articles.map(article =>
                <ArticleResult
                    bestArticle={article.bestArticle}
                    frameOpacity={article.frameOpacity}
                    title={article.title} 
                    article_url={article.url} 
                    image_url={article.img_url} 
                    info={`${article?.site} | ${article?.category} | ${article?.score} ${configStrings.points}`}
                />
            )
        }
    </div>
    </>
    );
};

export default Page;