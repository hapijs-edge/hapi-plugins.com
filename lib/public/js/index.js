/** @jsx React.DOM */

var SearchApp = React.createClass({
    getInitialState: function () {
        return {
            query: null,
            results: {},
            searchTrees: {}
        }
    },
    updateQuery: function (query) {
        this.setState({query: query});
    },
    render: function () {
        return (
            <div className="search-app">
                <SearchHeader changeHandler={this.updateQuery}/>
                <SearchResults query={this.state.query}
                    results={this.state.results}
                    searchTrees={this.state.searchTrees} />
            </div>
        )
    }
});

var SearchHeader = React.createClass({
    changeHandler: function () {
        var query = this.refs.query.getDOMNode().value; // don't remove this, may need reference later
        this.props.changeHandler(query);
    },
    render: function () {
        return (
            <header>
                <div className="container">
                    <img src="/img/logo.svg" alt="Hapi.js Logo" className="logo"/>
                </div>
                <div className="container">
                    <input type="search"
                        className="searchBox"
                        placeholder="Search Hapi.js plugins"
                        onChange={this.changeHandler}
                        ref="query" />
                </div>
            </header>
        );
    }
});

var SearchResults = React.createClass({
    render: function () {
        if (this.props.query && this.props.query.length > 0) {
            return (
                <ResultsTable results={this.props.results} searchTrees={this.props.searchTrees} />
            );
        } else {
            return (
                <SearchInfo />
            );
        }
    }
});

var ResultsTable = React.createClass({
    render: function () {
        return (
            <div className="results-section">
                <table className="table">
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Author(s)</td>
                            <td>Downloads (this week)</td>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
})

var SearchInfo = React.createClass({
    render: function () {
        return (
            <div className="search-info container">
                <div className="search-info-title col-md-12">
                    <h1>A searchable database of <a href="http://hapijs.com" className="emphasis">Hapi.js</a> plugins</h1>
                    <hr/>
                </div>
                <div className="faq col-md-8">
                    <section id="how-do-I-use-this">
                        <h2>How do I use this website?</h2>
                        <p>Start typing in the above textbox to search the database for <a href="http://hapijs.com" className="emphasis">Hapi.js</a> plugins.</p>
                    </section>
                    
                    <section id="what-is-hapi">
                        <h2>What is Hapi.js?</h2>
                        <p><a className="emphasis" href="http://hapijs.com">Hapi</a> is a simple to use configuration-centric framework with built-in support for input validation, caching, authentication, and other essential facilities for building web and services applications. hapi enables developers to focus on writing reusable application in a highly modular and prescriptive approach.
                        </p>
                    </section>
                    
                    <section id="how-does-this-work">
                        <h2>How does this work?</h2>
                        <p>Every published <a className="emphasis" href="https://www.npmjs.org/">NPM</a> module matching the following criteria will appear in this database:</p>
                        <ul>
                            <li><i>package.json</i> 'name' starts with 'hapi-'</li>
                            <li><i>package.json</i> 'name' ends with '-hapi'</li>
                            <li><i>package.json</i> 'keywords' contain one of the following: 'hapi', 'hapi.js', 'hapijs'</li>
                        </ul>
                    </section>
                    
                    <section id="how-do-I-add-my-plugin">
                        <h2>How do I add my hapi plugin?</h2>
                        <p>In your module's package.json... </p>
                    </section>
                    
                    <section id="what-inspired-this">
                        <h2>What inspired this?</h2>
                        <p>This website was inspired by many websites before it including (but not limited to) the following:</p>
                        <ul>
                            <li><a href="https://www.npmjs.org/">NPM</a></li>
                            <li><a href="http://react-components.com/">React Components</a></li>
                        </ul>
                    </section>
                    
                    <section id="who-made-this">
                        <h2>Who made this?</h2>
                        <p><a className="emphasis" href="http://hapi-plugins.com">hapi-plugins.com</a> was made for the book "Developing a hapi Edge" by:</p>
                        <ul>
                            <li>Van Nguyen</li>
                            <li>Ben Acker</li>
                            <li>Daniel Bretoi</li>
                            <li>Wyatt Preul</li>
                        </ul>
                        <p>The code for <a className="emphasis" href="https://github.com/hapijs-edge/hapi-plugins.com">hapi-plugins.com</a> was developed from the beginning as open source. Click <a className="emphasis" href="https://github.com/hapijs-edge/hapi-plugins.com">here</a> to view the code.</p>
                        <p>The website is hosted by <a className="emphasis" href="https://twitter.com/thegoleffect">@thegoleffect</a> using <a className="emphasis" href="https://www.digitalocean.com/">DigitalOcean</a> and <a className="emphasis" href="https://cql.io">cql.io</a>.</p>
                    </section>
                </div>
                <div className="plugins-topcharts col-md-4">
                    <section id="most-downloaded">
                        <h2>Most Downloaded</h2>
                        <ul>
                            <li>Hapi</li>
                            <li>Joi</li>
                            <li>...</li>
                        </ul>
                    </section>
                    <section id="recently-updated">
                        <h2>Recently Updated</h2>
                        <ul>
                            <li>Hapi</li>
                            <li>Joi</li>
                            <li>...</li>
                        </ul>
                    </section>
                </div>
            </div>
        );
    }
});

React.render(<SearchApp url="comments.json" />, document.getElementById('content'));