import React from 'react';
import portfolioData from '../data/data.json';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation
} from 'react-router-dom';
import CategoryList from './category-list';
import DetailItem from './detail-item';
import AboutPage from './about-page';
import ChatbotPage from './chatbot-page';
import Footer from './footer';
import NotFound from './not-found';
import Header from './header';
import { initGA, trackPageView } from '../utils/analytics';

// Component to track route changes for Google Analytics
function RouteChangeTracker() {
    const location = useLocation();

    React.useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null;
}

export class App extends React.Component {
    constructor(props) {
        super(props);
        this.scrollTop = this.scrollTop.bind(this);
    }

    componentDidMount() {
        // Initialize Google Analytics
        initGA();
    }

    scrollTop() {
        window.scrollTo(0, 0);
    }

    render() {
        const categories = [portfolioData.dev, portfolioData.design, portfolioData.photo];

        return (
            <Router onUpdate={this.scrollTop}>
                <div>
                    <RouteChangeTracker />
                    <Header />

                    <Switch>
                        <Route exact path="/" component={ChatbotPage} />
                        <Route exact path="/dev" render={(props) => <CategoryList {...props} />} />
                        <Route exact path="/design" render={(props) => <CategoryList {...props} />} />
                        <Route exact path="/photo" render={(props) => <CategoryList {...props} />} />
                        <Route exact path="/about" component={AboutPage}/>

                        {
                            /*
                                Routes for all detail pages

                                This loops through each of the portfolio categories
                                and then loops through all the projects in a given category
                            */
                            categories.map((category, categoryIndex) => (
                                category.items.map((item, itemIndex) => (
                                    <Route key={`${categoryIndex}-${itemIndex}`} exact path={item.url} component={DetailItem}/>
                                ))
                            ))
                        }

                        { /*This is to handle any indexed /web search results*/ }
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
}

export default App;
