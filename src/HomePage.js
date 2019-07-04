import React from 'react';
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
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
import Navbar from 'react-bootstrap/Navbar';
import sha256 from "sha256";
import Alert from 'react-bootstrap/Alert'
import GeoModule from './GeoModule'


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
      console.log('1')
      toast("密码错误")
    } else if (json.status === 500) {
      console.log('2')
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

          <Switch>
            <Route path='/register' component={RegisterPage}/>
            <Route path='/recoverpassword' render={(props) => <RecoverPassword {...props} />}/>
            <Route path='/' render={(props)=><UserInfo {...props} loginToken={this.state.loginToken}
             userName={this.state.userName} logOut={this.logoutHandle} logIn={this.loginHandle}/>}/>
          </Switch>
              
            
            <Route path='/usercenter' render={(props)=><PersonalCenter {...props} email={this.state.email} username={this.state.userName}/>}/>
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
        <Link to="/freeroom" className='entry_content'>空教室</Link>
        <Link to="/classes" className='entry_content'>课程</Link>
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
    this.props.logIn(this.email.value, sha256(this.password.value));
  }

  recoverPassword = () => {
    this.props.history.push('/recoverpassword')
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
              <InputGroup.Append>
                        <Button variant="primary" onClick={this.loginHandle}>登录</Button>
              </InputGroup.Append>
            </InputGroup>
            <div>
              <Button className='button' variant="primary" onClick={this.recoverPassword}>找回密码</Button>
              <Route path='/*' render={({history}) => (
                <Button className='button' variant="primary" onClick={() => { history.push('/register') }}>
                  注册
                </Button>)} />
            </div>
          </div>
          }
        { this.props.loginToken &&
        <div id='top_bar'>

          <div id='username'>
            <Card>
              <Card.Body>
                <Card.Text>
                  <Link to='/usercenter'>{this.props.userName}</Link>
                </Card.Text>
              </Card.Body>
            </Card>
          </div>

            <Route path='/*' render={({history}) => (
              <Button variant="primary" onClick={() => {this.props.logOut();  history.push('/'); }} >注销</Button>
            )}/>

          <Link to="/">Home</Link>
          <GeoModule />
        </div>}
      </header>
      
    );
  }
}


class RecoverPassword extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      second: 0,
      errTip: ''
    }
    this.emailInput = React.createRef()
    this.newPasswrod = React.createRef()
    this.confimPassword = React.createRef()
    this.verifyCode = React.createRef()
  }

  componentDidMount(){
    setInterval(this.timer, 1000)
  }

  timer = () => {
    if(this.state.second > 0){
      this.setState({
        second: this.state.second - 1,
      })
    }
  }

  sendVerifyCode = async() => {
    const emailRegular = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if(!emailRegular.test(this.emailInput.value)){
      this.setState({
        errTip: "邮箱地址格式错误"
      })
    } else {
      this.setState({
        errTip: "",
        second: 60
      })
      const message = {
        "email": this.emailInput.value
      }

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      }
      const result = await fetch("/api/storevalidatecode", fetchOptions)
    }
  }

  submitReset = async() => {
    let status = this.localPasswordCheck()
    if(status === 'clear'){
        this.setState({
          errTip: ''
        })
        const message = {
          "email": this.emailInput.value,
          "validateCode": this.verifyCode.value,
          "password": sha256(this.newPasswrod.value)
        }

        const fetchOptions = {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        }

        const result = await fetch('/api/updatepassword', fetchOptions)
        const json = await result.json()
        if(json.status === 200){
          this.props.history.push('/')
        }

    } else {
      this.setState({
        errTip: status
      })

    }
    
  }

  localPasswordCheck = () => {
    const passwordRegular = /[a-zA-Z0-9]{6,15}/;
    const emailRegular = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

    if(!emailRegular.test(this.emailInput.value)){
      return '邮箱地址格式错误'
    }

    if(!passwordRegular.test(this.newPasswrod.value)){
        return '新密码应为6-16位字母数字'
    }

    if(this.newPasswrod.value !== this.confimPassword.value){
        return '两次输入密码不符'
    }
    
    return 'clear'
  }

  render(){
    return(
      <div>
        <InputGroup className="mb-3">
            <FormControl
              ref={(ref) => {this.emailInput = ref}}
              placeholder="电子邮箱"
              aria-describedby="basic-addon1"
            />
            <InputGroup.Append>
              {(this.state.second === 0 ) && <Button variant="primary" onClick={this.sendVerifyCode}>发送</Button>}
              {(this.state.second !== 0 ) && <Button variant="primary" disabled>发送({this.state.second})</Button>}
            </InputGroup.Append>
        </InputGroup>

        <InputGroup className="mb-3">
            <FormControl
              ref={(ref) => {this.verifyCode = ref}}
              placeholder="验证码"
              aria-describedby="basic-addon1"
            />
        </InputGroup>

        <InputGroup className="mb-3">
            <FormControl
              ref={(ref) => {this.newPasswrod = ref}}
              placeholder="新密码"
              aria-describedby="basic-addon1"
            />
        </InputGroup>

        <InputGroup className="mb-3">
            <FormControl
              ref={(ref) => {this.confimPassword = ref}}
              placeholder="确认密码"
              aria-describedby="basic-addon1"
            />
        </InputGroup>

        {this.state.errTip!=="" && <Alert variant='danger'>{this.state.errTip}</Alert>}

        <Button onClick={this.submitReset}>
          提交
        </Button>
      </div>
    );
  }
}

export default HomePage;