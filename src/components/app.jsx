import React, { useEffect, useMemo } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Redirect,
    useLocation
} from 'react-router-dom';
import portfolioData from '../data/data.json';
import CategoryList from './category-list';
import DetailItem from './detail-item';
import AboutPage from './about-page';
import HomePage from './home-page';
import Footer from './footer';
import NotFound from './not-found';
import Header from './header';
import { initGA, trackPageView } from '../utils/analytics';

// Component to track route changes for Google Analytics
function RouteChangeTracker() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null;
}

// All portfolio categories for generating detail routes
const ALL_CATEGORIES = [
    portfolioData.ai,
    portfolioData.dev,
    portfolioData.design,
    portfolioData.photo
];

function App() {
    useEffect(() => {
        // Initialize Google Analytics on mount
        initGA();
    }, []);

    const detailRoutes = useMemo(() => {
        return ALL_CATEGORIES.flatMap((category) =>
            category.items.map((item) => (
                <Route
                    key={item.url}
                    exact
                    path={item.url}
                    component={DetailItem}
                />
            ))
        );
    }, []);

    return (
        <Router>
            <div>
                <RouteChangeTracker />
                <Header />

                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/ai" component={CategoryList} />
                    <Route exact path="/dev" component={CategoryList} />
                    <Route exact path="/design" component={CategoryList} />
                    <Route exact path="/photo" component={CategoryList} />
                    <Route exact path="/about" component={AboutPage} />

                    {/* Detail pages for all portfolio items */}
                    {detailRoutes}

                    {/* Handle any indexed /web search results */}
                    <Route exact path="/web">
                        <Redirect to="/" />
                    </Route>

                    <Route path="*" component={NotFound} />
                </Switch>

                <Footer />
            </div>
        </Router>
    );
}

export default App;
