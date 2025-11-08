import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import portfolioData from '../data/data.json';
import { getGridClass } from '../utils/grid';

export default function CategoryList({ location, navToggle }) {
    const categoryData = useMemo(() => {
        const url = location.pathname;
        const category = url.replace(/[^\w\s]/gi, '');
        const data = portfolioData[category];

        if (!data || !data.items) {
            console.warn(`Category "${category}" not found, falling back to dev`);
            return { items: portfolioData.dev.items, category: 'dev' };
        }

        return { items: data.items, category };
    }, [location.pathname]);

    const gridClass = useMemo(() =>
        getGridClass(categoryData.items.length),
        [categoryData.items.length]
    );

    const handleClick = navToggle || (() => {});

    return (
        <div id="content">
            {categoryData.items.map(item => (
                <div key={item.url} className={`${gridClass} grid-t-6 grid-panel`}>
                    <NavLink to={item.url} onClick={handleClick}>
                        <figure>
                            <img
                                src={item.thumbPath}
                                title={item.imageTitle || item.name}
                                alt={item.name}
                            />

                            <figcaption>
                                <h2>{item.name}</h2>
                                <div className="view">View</div>
                            </figcaption>
                        </figure>
                    </NavLink>
                </div>
            ))}
        </div>
    );
}

CategoryList.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
    }).isRequired,
    navToggle: PropTypes.func,
};

CategoryList.defaultProps = {
    navToggle: null,
};
