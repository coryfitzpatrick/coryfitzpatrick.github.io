import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import Chatbot from './chatbot';
import portfolioData from '../data/data.json';

const FEATURED_CATEGORIES = [portfolioData.ai, portfolioData.dev];

export default function HomePage() {
    const categories = useMemo(() => FEATURED_CATEGORIES, []);

    return (
        <div id="content">
            <div className="container">
                {categories.map(category => (
                    <div key={category.name} className="grid-d-6 grid-t-6 grid-panel">
                        <NavLink to={category.path}>
                            <figure>
                                <img src={category.image} alt={category.name} />

                                <figcaption>
                                    <h2>{category.name}</h2>
                                    <div className="view">View</div>
                                </figcaption>
                            </figure>
                        </NavLink>
                    </div>
                ))}
            </div>

            <Chatbot />
        </div>
    );
}
