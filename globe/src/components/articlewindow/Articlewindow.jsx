import React from 'react'
import './ArticleWindow.css'
import articles from '../../articles'
export const Articlewindow = (props) => {
    let index = Math.floor(Math.random() * articles.length);
    console.log(index);
    console.log(props.pointTitle);
    let article = articles.filter((article) =>  article.text === props.pointTitle);
    console.log(articles.filter((article) =>  article.text === props.pointTitle))
    index = articles.indexOf(article[0]);
    return (
        <div id='articleContainer' >
            <div id='articleWindow'>
                <button onClick={props.closeFn}>Close</button>
                <h1>{articles[index].text}</h1>
                <p>{articles[index].author}</p>
                <p>{articles[index].content}</p>
            </div>
        </div>
    )
}
