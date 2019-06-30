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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from 'react-bootstrap/Navbar'

class HomePage extends React.Component {

  constructor(props){
    super(props);
    this.state={
        loginToken: null,
        userName: null,
        email: null
    }
  }

  componentDidMount(){
    toast.configure({
      autoClose: 1000,
      draggable: false,
      //etc you get the idea
    });
  }

  logoutHandle = () =>{
    this.setState({
      loginToken: null,
      userName: null
    })
  }

  loginHandle = async(email, password) =>{
    const message={
      "email": email,
      "password": password
    }
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    };

    console.log(fetchOptions)

    const result = await fetch('/api/login', fetchOptions);
    const json = await result.json()
    console.log(json)
    if(json.status === 200 ){
      this.setState({
        email: json.email,
        userName: json.studentName,
        loginToken: true
      })
    } else if (json.status === 400) {
      toast("密码错误")
    } else if (json.status === 500) {
      toast("用户不存在")
    }
  }

  render(){
      return (
      <BrowserRouter>
        <Navbar bg="dark">
        <Navbar.Brand href="/">查询系统</Navbar.Brand>
        </Navbar>
        <ToastContainer 
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnVisibilityChange={false}
        draggable={false}
        pauseOnHover={false}/>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <div className='main_content'>
            <Route path='/register' component={RegisterPage}/>
            <Route path='/usercenter' render={(props)=><PersonalCenter {...props} email={this.state.email} username={this.state.userName}/>}/>
            <Route exact path='/' render={(props)=><UserInfo {...props} loginToken={this.state.loginToken}
             userName={this.state.userName} logOut={this.logoutHandle} logIn={this.loginHandle}/>}/>  
            {this.state.loginToken &&
            <div id='options'>
              <Route exact path='/' component={Entry}/>
            </div>}
            <Route exact path='/freeroom' render={(props)=><FreeRoom/>}/>
            <Route exact path='/classes' render={(props)=><Classes email={this.state.email}/>}/>
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
    this.email = React.createRef();
    this.password = React.createRef();
  }

  loginHandle = () => {
    this.props.logIn(this.email.value, this.password.value);
  }

  render(){
    return(
      <header id='head'>
          { !this.props.loginToken &&
          <div id='login-container'>
            <InputGroup className="mb-3">
              <FormControl
                ref={(ref) => {this.email = ref}}
                placeholder="电子邮箱"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <FormControl
                ref={(ref)=>{this.password = ref}}
                placeholder="密码"
                type="password"
                aria-label="Password"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
            <div>
              <Button className='button' variant="primary" onClick={this.loginHandle}>登陆</Button>
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