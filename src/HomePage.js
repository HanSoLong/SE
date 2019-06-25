import React from 'react';
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import './HomePage.css'
import FreeRoom from './FreeRoom'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button';
import Classes from './Classes'

class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state={
        loginToken: '123456',
        userName: "user1",
    }
  }

  logoutHandle = () =>{
    this.setState({
      loginToken: null,
      userName: null
    })
  }

  loginHandle = () =>{
    this.setState({
      loginToken: '123456',
      userName: "user1",
    })
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
          <UserInfo loginToken={this.state.loginToken} userName={this.state.userName} logOut={this.logoutHandle}/>
            <div id='options'>
              <Route exact path='/' component={Entry}/>
              
            </div>
            <Route exact path='/freeroom' render={(props)=><FreeRoom/>}/>
            <Route exact path='/classes' render={(props)=><Classes/>}/>
        </div>
      </BrowserRouter>
    );
  }
  
}

class Entry extends React.Component {
  render(){
    return(
      <div>
        <Link to="/freeroom" className='entry_content'>FreeRoom</Link>
        <Link to="/classes" className='entry_content'>Classes</Link>
      </div>
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
          { !this.props.loginToken &&
          <div>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Password"
                type="password"
                aria-label="Password"
                aria-describedby="basic-addon1"
              />
              <InputGroup.Append>
                <Button variant="primary">登陆</Button>
              </InputGroup.Append>
            </InputGroup>
            
          </div>
          }
        { this.props.loginToken &&
        <div id='top_bar'>
          <p id='username'>
            Welcome! <Link to='/usercenter'>{this.props.userName}</Link>
          </p>
          <button onClick={this.props.logOut}>logout</button>            
        </div>}
      </header>
      
    );
  }
}

export default HomePage;