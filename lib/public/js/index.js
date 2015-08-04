/** @jsx React.DOM */

var SearchTreeCache = {};
var lastQuery = null;

var SearchApp = React.createClass({
    getInitialState: function () {
        this.performFetch = _.debounce(this.fetchFromServer, 400, {trailing: true});
        return {
            query: null,
            sortStatus: 'name=1',
            results: {}
        }
    },
    fetchFromServer: function (query) {
        var url = '/plugins?q=' + query;
        $("#loading-indicator").show();
        $('.results-section').hide();
        lastQuery = query;
        $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
                if (query !== lastQuery) {
                    return;
                }
                
                SearchTreeCache[query] = data;
                this.setState({
                    query: query
                });
                $('.results-section').show();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    },
    updateQuery: function (query) {
        if (query && query.length > 0) {
            if (SearchTreeCache[query]) {
                this.setState({query: query});
            } else {
                this.performFetch(query);
            }
        } else {
            this.setState({query: null});
        }
    },
    sortBy: function (query, key) {
        var sortStatus = this.state.sortStatus.split('=');
        var sortDirection = 1;
        if (sortStatus[1] == '1') {
            sortDirection = -1;
        }
        
        var compare = function (a, b) {
            if (a[key] < b[key]) {
                return sortDirection * -1;
            } else if (a[key] > b[key]) {
                return sortDirection * 1;
            } else {
                return 0;
            }
        }
        
        SearchTreeCache[query].sort(compare);
        this.setState({
            query: query,
            sortStatus: key.toLowerCase() + '=' + sortDirection
        });
        
        $('.sortable').removeClass('ascending descending');
        $('#' + key + 'Column').addClass((sortDirection > 0 ? 'ascending' : 'descending'));
    },
    render: function () {
        return (
            <div className="search-app">
                <SearchHeader changeHandler={this.updateQuery}/>
                <SearchLoadingIndicator />
                <SearchResults query={this.state.query}
                    results={this.state.results}
                    searchTrees={this.state.searchTrees}
                    sortBy={this.sortBy} />
            </div>
        )
    }
});

var SearchLoadingIndicator = React.createClass({
    render: function () {
        return (
            <div className="container bordered" id="loading-indicator">
                <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
            </div>
        );
    }
})

var SearchHeader = React.createClass({
    changeHandler: function () {
        var query = this.refs.query.getDOMNode().value; // don't remove this, may need reference later
        this.props.changeHandler(query);
    },
    render: function () {
        return (
            <header id="search-header">
                <div className="container col-md-12">
                    <a href="/"><img src="/img/logo.svg" alt="Hapi.js Logo" className="logo"/></a>
                </div>
                <div className="container col-md-12">
                    <input type="search"
                        className="searchBox"
                        placeholder="Search Hapi.js plugins"
                        onChange={this.changeHandler}
                        ref="query"
                        autoFocus />
                </div>
            </header>
        );
    }
});

var SearchResults = React.createClass({
    render: function () {
        if (this.props.query && this.props.query.length > 0) {
            return (
                <ResultsTable query={this.props.query}
                    results={this.props.results}
                    searchTrees={this.props.searchTrees}
                    sortBy={this.props.sortBy} />
            );
        } else {
            return (
                <SearchInfo />
            );
        }
    }
});

var ResultsTable = React.createClass({
    sortBy: function(query, key) {
        this.props.sortBy(query, key);
    },
    sortByName: function () {
        this.sortBy(this.props.query, 'name');
    },
    sortByAuthor: function () {
        this.sortBy(this.props.query, 'author');
    },
    sortByDownloads: function () {
        this.sortBy(this.props.query, 'downloads');
    },
    sortByDescription: function () {
        this.sortBy(this.props.query, 'description');
    },
    render: function () {
        $("#loading-indicator").hide();
        var tableRows = SearchTreeCache[this.props.query].map(function(plugin, i){
            var author = plugin.author;
            if (plugin.authors) {
                author = plugin.authors.join(", ");
            }
            if (!author) {
                author = "Unattributed";
            }
            if (author.length > 18) {
                author = author.slice(0, 15) + '...';
            }
            plugin.author = author;
            
            return (
                <tr>
                    <td><a href={"http://npmjs.com/package/" + plugin.name}>{plugin.name}</a></td>
                    <td>{author}</td>
                    <td>{plugin.description}</td>
                    <td>{plugin.downloads || 0}</td>
                </tr>
            );
        });
        return (
            <div className="results-section container bordered">
                <table id="searchResults" className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <td id="nameColumn" className="sortable" onClick={this.sortByName} >Name</td>
                            <td id="authorColumn" className="sortable" onClick={this.sortByAuthor} >Author(s)</td>
                            <td id="descriptionColumn" className="sortable" onClick={this.sortByDescription} >Description</td>
                            <td id="downloadsColumn" className="sortable" onClick={this.sortByDownloads} >Downloads (this week)</td>
                        </tr>
                    </thead>
                    <tbody>
                        {tableRows}
                    </tbody>
                </table>
            </div>
        );
    }
});

var HotList = React.createClass({
    getInitialState: function() {
        return {
            list: window.MostDownloadedList
        }
    },
    render: function() {
        var items = this.state.list.map(function(item, i){
            return (
                <li>
                    <a href={"http://npmjs.com/package/" + item.name}>{item.name}</a>
                    <span className='downloadCount'>({item.downloads})</span>
                </li>
            );
        });
        return (
            <ul>
                {items}
            </ul>
        );
    }
})

var SearchInfo = React.createClass({
    render: function () {
        return (
            <div className="search-info container bordered">
                <div className="search-info-title col-md-12 col-lg-12">
                    <h1>A searchable database of <a href="http://hapijs.com" className="emphasis">Hapi.js</a> plugins</h1>
                    <hr/>
                </div>
                <div className="plugins-topcharts col-md-3 col-lg-3">
                    <section id="most-downloaded">
                        <h2>Most Downloaded</h2>
                        <HotList />
                    </section>
                </div>
                <div className="faq col-md-9 col-lg-9">
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
                        <p>In your module&quot;s package.json... </p>
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
                        <div className="col-md-4">
                            <a href="http://bleedingedgepress.com/developing-a-hapi-edge/">
                                <img className="book-cover" src="/img/hapi-edge-cover.jpg"/>
                            </a>
                        </div>
                        <div className="col-md-8">
                            <p><a className="emphasis" href="http://hapi-plugins.com">hapi-plugins.com</a> was made for the book <a href="http://bleedingedgepress.com/developing-a-hapi-edge/">Developing a hapi Edge</a> by:</p>
                            <ul>
                                <li><a href="https://github.com/thegoleffect">Van Nguyen</a></li>
                                <li>Lloyd Benson</li>
                                <li>Daniel Bretoi</li>
                                <li>Wyatt Preul</li>
                            </ul>
                            <p>The code for <a className="emphasis" href="https://github.com/hapijs-edge/hapi-plugins.com">hapi-plugins.com</a> was developed from the beginning as open source. Click <a className="emphasis" href="https://github.com/hapijs-edge/hapi-plugins.com">here</a> to view the code.</p>
                            <p>The website is hosted by <a className="emphasis" href="https://twitter.com/thegoleffect">@thegoleffect</a> using <a className="emphasis" href="https://www.digitalocean.com/">DigitalOcean</a> and <a className="emphasis" href="https://compose.io">compose.io</a>.</p>
                        </div>
                    </section>
                </div>
                <div className="clearfix visible-sx-block"></div>
            </div>
        );
    }
});

React.render(<SearchApp url="comments.json" />, document.getElementById('content'));

$(document).ready(function(){
    var shootingStarObj = new ShootingStar("#search-header");
    shootingStarObj.launch();
});
