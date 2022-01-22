import React from 'react';
import './ArticleResult.css';

const ArticleResult = ({ frameOpacity, bestArticle, title, article_url, image_url, info }) => {
    const frameStyle = {
        "opacity": frameOpacity
    }
    const articleType = bestArticle ? "bestArticle" : "regularArticle";

    return (
    <div className={articleType}>
        <div className="container" style={frameStyle}>
            <div className="articleImgContainer">
                <img className="articleImage" src={image_url}/>
            </div>
            <div className="articleInfoContainer">
                <a className="articleTitle" href={article_url} target="_blank" rel="noopener">
                    {title}
                    <p className="articleInfo">{info}</p>
                </a>
            </div>
        </div>
    </div>
    );
  };
  
  export default ArticleResult;