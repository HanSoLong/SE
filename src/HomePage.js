import React from 'react';
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import './HomePage.css'
import FreeRoom from './FreeRoom'

class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state={
        loginToken: '123456',
        userName: "test_user_1",
    }
  }

  render(){
      return (
      <BrowserRouter>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <div className='main_content'>
          <UserInfo loginToken={this.state.loginToken} userName={this.state.userName}/>
            <div id='options'>
              <Link to="/freeroom" className='entry_content'>FreeRoom</Link>
              <Link to="/classes" className='entry_content'>Classes</Link>
            </div>
            <Route path='/freeroom' render={(props)=><FreeRoom/>}/>
        </div>
      </BrowserRouter>
    );
  }
  
}

class UserInfo extends React.Component {
  constructor(props){
    super(props);
  }

  render(){
    return(
      <header id='head'>
          { this.props.loginToken === "" &&
          <button>
            login
          </button>}
        { this.props.loginToken !== "" &&
        <div id='top_bar'>
          <p>
            Welcome! {this.props.userName}
          </p>
          <button>logout</button>            
        </div>}
        <Redirect
            to='/login'/>
      </header>
      
    );
  }
}

export default HomePage;