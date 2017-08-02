import React, { Component } from 'react';
import { Link } from 'react-router';

class Nav extends React.Component {
    render() {
        return( 
            <div>
                <header>
                    <h1>Sunrise Sunset</h1>
                    <nav>
                        <Link to="/" activeClassName="menu-active">Home</Link>
                        <Link to="/about" activeClassName="menu-active">About</Link>
                        <Link to="/contact" activeClassName="menu-active">Contact</Link>
                    </nav>
                </header>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default Nav