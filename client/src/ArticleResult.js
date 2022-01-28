import React from 'react';
import './ArticleResult.css';

const ArticleResult = ({ frameOpacity, title, article_url, image_url, info }) => {
    const frameStyle = {
        "opacity": frameOpacity
    }
    const imageURL = 
        image_url == undefined
            ? "logo512.png"
            : image_url.includes("undefined") 
                ? "logo512.png"
                : image_url;
        
    return (
    <div className="articleContainer" style={frameStyle}>
        <div className="articleImgContainer">
            <img className="articleImage" src={imageURL}/>
        </div>
        <div className="articleInfoContainer">
            <a className="articleTitle" href={article_url} target="_blank" rel="noopener">
                {title}
                <p className="articleInfo">{info}</p>
            </a>
        </div>
    </div>
    );
  };
  
  export default ArticleResult;