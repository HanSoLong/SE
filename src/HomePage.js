import React from 'react';
import { BrowserRouter, Route, Link, Redirect } from "react-router-dom";
import './HomePage.css'
import FreeRoom from './FreeRoom'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Button from 'react-bootstrap/Button';
import Classes from './Classes'
import ClassComments from './ClassComments';
import Card from 'react-bootstrap/Card'
import RegisterPage from './RegisterPage'
import PersonalCenter from './PersonalCenter'

class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state={
        loginToken: null,
        userName: null,
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
            <Route path='/register' component={RegisterPage}/>
            <Route path='/usercenter' component={PersonalCenter}/>
            <Route exact path='/' render={(props)=><UserInfo {...props} loginToken={this.state.loginToken}
             userName={this.state.userName} logOut={this.logoutHandle} logIn={this.loginHandle}/>}/>  
            {this.state.loginToken &&
            <div id='options'>
              <Route exact path='/' component={Entry}/>
            </div>}
            <Route exact path='/freeroom' render={(props)=><FreeRoom/>}/>
            <Route exact path='/classes' render={(props)=><Classes/>}/>
            <Route path='/classcomments/:id' render={(props)=><ClassComments {...props} userName={this.state.userName} />} />
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

  handleRegister = () => {
    //history.push('/')
  }

  render(){
    return(
      <header id='head'>
          { !this.props.loginToken &&
          <div id='login-container'>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="用户名"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="密码"
                type="password"
                aria-label="Password"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <div>
              <Button className='button' variant="primary" onClick={this.props.logIn}>登陆</Button>
              <Route path='/*' render={({history}) => (
                <Button className='button' variant="primary" onClick={() => { history.push('/register') }}>
                  注册
                </Button>)} />
            </div>
          </div>
          }
        { this.props.loginToken &&
        <div id='top_bar'>
          <p id='username'>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Link to='/usercenter'>{this.props.userName}</Link>
                </Card.Text>
              </Card.Body>
            </Card>
            
          </p>
          <Route path='/*' render={({history}) => (
            <Button variant="primary" onClick={() => {this.props.logOut();  history.push('/'); }}>注销</Button>
          )}/>
          <Link to="/">Home</Link>
        </div>}
      </header>
      
    );
  }
}

export default HomePage;