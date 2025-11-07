import React from 'react';
import portfolioData from '../data/data.json';

export default class DetailItemContent extends React.Component {
    render() {
        const path = this.props.location.pathname;
        const category = path.split('/')[1];
        const objectNum = portfolioData[category].items.findIndex(item => item.url === path);
        const detailItem = portfolioData[category].items[objectNum];
        const subContent = detailItem.subContent;
        let subContentTitle;
        let subContentLink;
        let subContentDesc;
        let subContentVideo;

        if (subContent.link) {
            subContentTitle = <h2><a href={subContent.link} target="_blank" rel="noopener noreferrer">{detailItem.name}</a></h2>;
            subContentLink = <a className="detail-link" href={subContent.link} target="_blank" rel="noopener noreferrer">Visit The Site: {subContent.link}</a>;
        } else {
            subContentTitle = <h2>{detailItem.name}</h2>;
        }

        if (subContent.desc) {
            subContentDesc = <p dangerouslySetInnerHTML={{__html: subContent.desc}}></p>;
        }

        if (subContent.videoLink) {
            subContentVideo = <video preload="true" controls>      
                 <source src={`${subContent.videoLink}.webm`} type='video/webm; codecs="vp8, vorbis"' />
                 <source src={`${subContent.videoLink}.mp4`} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                 This web browser does not support HTML5.    
            </video>;
        }

        return (
            <div id="sub-content">
                <div className="grid-d-12">
                    {subContentTitle}
                    {subContentDesc}
                    {subContentLink} 
                    {subContentVideo}

                    <div className="images">
                        {subContent.images.map(image => (
                            <img key={image} src={image} alt="" />
                        ))}
                    </div>               
                </div>
            </div>
        );
    }
}

