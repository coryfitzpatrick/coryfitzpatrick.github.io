import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';
import portfolioData from '../data/data.json';
import PropTypes from 'prop-types';
import { toKebabCase } from '../utils/string';

export default function DetailItem({ location }) {
    const detailData = useMemo(() => {
        const path = location.pathname;
        const category = path.split('/')[1];
        const categoryData = portfolioData[category];

        if (!categoryData) {
            return null;
        }

        const item = categoryData.items.find(item => item.url === path);
        return item || null;
    }, [location.pathname]);

    if (!detailData) {
        return (
            <div id="sub-content">
                <div className="grid-d-12">
                    <h2>Item not found</h2>
                </div>
            </div>
        );
    }

    const { subContent, name } = detailData;
    const sanitizedDesc = subContent.desc ? DOMPurify.sanitize(subContent.desc) : '';
    const itemClass = toKebabCase(name);

    return (
        <div id="sub-content" className={itemClass}>
            <div className="grid-d-12">
                <h2>{name}</h2>

                {subContent.desc && (
                    <p dangerouslySetInnerHTML={{ __html: sanitizedDesc }}></p>
                )}

                {subContent.videoLink && (
                    <video preload="true" controls>
                        <source src={`${subContent.videoLink}.webm`} type='video/webm; codecs="vp8, vorbis"' />
                        <source src={`${subContent.videoLink}.mp4`} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                        This web browser does not support HTML5.
                    </video>
                )}

                <div className="images">
                    {subContent.images.map((image, index) => (
                        <img
                            key={image}
                            src={image}
                            alt={`${name} - Image ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

DetailItem.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
};
