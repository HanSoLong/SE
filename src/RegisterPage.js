import FreeRoom from './FreeRoom';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { withRouter } from 'react-router-dom';
import sha256 from "sha256"

class RegisterPage extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            errTip: null,
            verifyPageFlag: false,
            username: '',
            email: '',
            verifyCode: '',
        };

        this.username = React.createRef();
        this.email = React.createRef();
        this.password = React.createRef();
        this.confirmPassword = React.createRef();
        this.verifyCode = React.createRef()
    }

    localInfoVerify = () => {
        const emailRegular = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        const passwordRegular = /[a-zA-Z0-9]{6,15}/;
        const usernameRegular = /[a-zA-Z0-9]+/;
        let status = ''
        
        if(!emailRegular.test(this.email.value)){
            status='邮箱格式错误'
            return status;
        }

        if(!usernameRegular.test(this.username.value)){
            status='用户名不能为空'
            return status;
        }

        if(!passwordRegular.test(this.password.value)){
            status='密码格式错误, 需为6-15位字母数字'
            return status;
        }

        if(this.password.value !== this.confirmPassword.value){
            status='两次输入密码不相同'
            return status;
        }

        status = 'clear';
        return status;

    }

    submitRegister = async() => {
        let status = this.localInfoVerify()

        if(status == 'clear'){
            const message = {
                "email": this.email.value,
                "password": sha256(this.password.value)
            }
            this.setState({
                email: this.email.value,
                username: this.username.value,
            })
            const fetchOptions = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };

            await fetch("/api/register", fetchOptions)

            this.setState({
                verifyPageFlag: true
            })

        } else{
            this.setState({
                errTip: status
            })
        }
    }

    submitVerifyCode = async() => {
        const message = {
                "verifyCode": this.verifyCode.value,
                "userName": this.state.username,
                "email": this.state.email
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        const result = await fetch('/api/validatecode', fetchOptions)
        const json = await result.json()
        if(json.status === 200){
            this.props.history.push('/')
        }
        
    }

    render(){
        return(
            <div>
                {!this.state.verifyPageFlag && 
                <div>
                    <InputGroup className="mb-3">
                        <FormControl
                            ref={(ref) => {this.email = ref}}
                            placeholder="邮箱"
                            aria-label="Email"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <FormControl
                            ref={(ref) => {this.username = ref}}
                            placeholder="用户名"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3" >
                        <FormControl
                            ref={(ref) => {this.password = ref}}
                            placeholder="密码"
                            type="password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>

                    <InputGroup className="mb-3" >
                        <FormControl
                            ref={(ref) => {this.confirmPassword = ref}}
                            placeholder="确认密码"
                            type="password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>

                    {this.state.errTip!==null && <Alert variant='danger'>{this.state.errTip}</Alert>}

                    <Button variant="primary" onClick={this.submitRegister}>提交</Button>
                </div>}
                
                {this.state.verifyPageFlag && 
                <div>
                    <InputGroup className="mb-3">
                        <FormControl
                            ref={(ref) => {this.verifyCode = ref}}
                            placeholder="邮件验证码"
                            aria-label="verifyCode"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                    {this.state.errTip!==null && <Alert variant='danger'>{this.state.errTip}</Alert>}
                    <Button variant="primary" onClick={this.submitVerifyCode}>提交</Button>
                </div>}

            </div>
            
        );
    }

}

export default withRouter(RegisterPage);