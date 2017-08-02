import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Link } from 'react-router';
import { ajax } from 'jquery';
import Nav from './components/nav.component.jsx'
import About from './components/about.component.jsx'
import Contact from './components/contact.component.jsx'
import NotFound from './components/404.component.jsx'

class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            status: 'Determining Location...',
            sunrise: '',
            sunset: '',
            error: '',
            timezone: ''
        }
    }

    
componentDidMount() {
    var timeZone;
    var options = {
        enableHighAccuracy: true,
        timeout: 9000,
        maximumAge: 0
    };

    const getSunriseInfo = (lat, long)  => {
        ajax({
            url: `http://api.sunrise-sunset.org/json`,
            data: {
                lat: lat,
                lng: long,
                date: `today`
            }
        }).then((data) => {
            timeZone = getTimeZone(lat, long);     
            var sunriseTime = convertTime(data.results.sunrise);
            var sunsetTime = convertTime(data.results.sunset);
            this.setState({sunrise: sunriseTime, sunset: sunsetTime, error: false});   
        });
    };

    const getTimeZone = (lat, long) => {
        ajax({
            url: 'https://maps.googleapis.com/maps/api/timezone/json?location=38.908133,-77.047119&timestamp=1458000000&key=AIzaSyCW0-VKmDJRsVRcKJdcLzFSFVuvsDlbNoE'
        }).then((data) => {
            var timeZoneId = data.timeZoneId;
            return timeZoneId;
        })

    };
    
    const convertTime = (time) => {
        if (moment().isDST()) {
            var ddt = moment(time);                        
            var currentTime = ddt.tz(timeZoneId).format('ha z');  // 4am PST
        } else {
            var dst = moment(time);
            var currentTime = dst.tz(timeZoneId).format('ha z');  // 5am PDT
        }
        return currentTime;
    }


    const success = pos => {
        var crd = pos.coords;
        var lat = crd.latitude;
        var long = crd.longitude;
        this.setState({status: ''})
        getSunriseInfo(lat, long);
    };

    const error = err => {
        var errorCode = err.code;
        var errorMsg = err.message;
        this.setState({error: `Error(${errorCode}) ${errorMsg}`, status: 'An error occurred.'});
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
}

    render() {
        return (
            <div>
                <h1>Hello, I am Home.</h1>
                <div className="container">
                    {this.props.children}
                    <div className="sunrise-sunset"> 
                        {this.state.status}
                        {this.state.sunrise}
                        {this.state.sunset}
                    </div>
                    {this.state.error && <div className="geolocation-error">
                        <p>Could not find your location</p>
                        {this.state.error}
                        </div>
                    }
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route component={Nav}>
            <Route path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />  
            <Route path='*' component={NotFound} />
        </Route>
    </Router>, 
    document.getElementById('app')
);