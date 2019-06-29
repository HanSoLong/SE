import React from 'react';
import { withRouter, Link, Route } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Alert from 'react-bootstrap/Alert'

class PersonalCenter extends React.Component{

    constructor(props){
        super(props)
        this.state={
            flag: null,
        }
    }

    handleClick(from){
        this.setState({
            flag: from
        })
    }

    render(){
        return(
            <div>
                <Card>
                    <Card.Body>
                        <Card.Text>
                            更改密码
                            <Button variant='primary' onClick={() => {this.handleClick('change_password')}}> 开始 </Button>
                        </Card.Text>
                    </Card.Body>
                </Card>
                
                {this.state.flag === 'change_password' && <ChangePassword/>}

                <Card>
                    <Card.Body>
                        <Card.Text>
                            查看已收藏课程
                            <Button variant='primary' onClick={() => {this.handleClick('view_fav')}}> 开始 </Button>
                        </Card.Text>
                    </Card.Body>
                </Card>

                <Card>
                    <Card.Body>
                        <Card.Text>
                            管理评论
                            <Button variant='primary' onClick={() => {this.handleClick('manage_comments')}}> 开始 </Button>
                        </Card.Text>
                    </Card.Body>
                </Card>

                {this.state.flag === 'manage_comments' && <ManageComments/>}
            </div>
        );
    }
}

class ChangePassword extends React.Component{

    constructor(props){
        super(props)
        this.state={
            errTip: null
        }
        this.oldPasswrod = React.createRef()
        this.newPasswrod = React.createRef()
        this.confimPassword = React.createRef()
    }

    handleSubmit = () => {
        let status = this.localPasswordCheck()
        if(status === 'clear'){
            //communicate with backend
            this.setState({
                errTip: null
            })
        } else {
            this.setState({
                errTip: status
            })
        }
    }

    localPasswordCheck = () => {
        const passwordRegular = /[a-zA-Z0-9]{6,15}/;

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
                <InputGroup>
                    <FormControl
                        ref={(ref) => {this.oldPasswrod = ref}}
                        placeholder="旧密码"
                        type="password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>

                <InputGroup>
                    <FormControl
                        ref={(ref) => {this.newPasswrod = ref}}
                        placeholder="新密码"
                        type="password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                    />
                </InputGroup>

                <InputGroup>
                    <FormControl
                        ref={(ref) => {this.confimPassword = ref}}
                        placeholder="再次输入新密码"
                        type="password"
                        aria-label="Password"
                        aria-describedby="basic-addon1"
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={this.handleSubmit}>提交</Button>
                    </InputGroup.Append>
                </InputGroup>

                {this.state.errTip !== null && <Alert variant='danger'>{this.state.errTip}</Alert>}
            </div>
            
        );
    }
}

class ManageComments extends React.Component{

    constructor(props){
        super(props)
        this.state={
            commentList: null
        }
    }

    componentWillMount(){
        //communicate with backend
        this.setState({
            commentList: [{'text': 'class1', 'code': '456'}, {'text': 'class2', 'code': '123'}]
        })
    }

    deleteComment = (code) => {
        //communicate with backend
        console.log(code)
        this.setState({
            commentList: [{'text': 'class1', 'code': '456'}]
        })
    }

    render(){
        let commentList = this.state.commentList.map((data) =>
            <Comment code={data.code} text={data.text} handleClick={this.deleteComment}/>)
        return(
            <div>
                {commentList}
            </div>
            
        );
    }
}

class Comment extends React.Component{

    handleClick= () => {
        this.props.handleClick(this.props.code)
    }

    render(){
        return(
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Text>
                        {this.props.text}
                    </Card.Text>
                    <Button variant='primary' onClick={this.handleClick}>删除</Button>
                </Card.Body>
            </Card>
        );
    }
}

class ViewFav extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            favList: null
        }
    }

    componentWillMount(){
        //communicate with backend
        this.setState({
            favList: [{'text': 'class1', 'code': '456'}, {'text': 'class2', 'code': '123'}]
        })
    }

    deleteComment = (code) => {
        //communicate with backend
        console.log(code)
        this.setState({
            favList: [{'text': 'class1', 'code': '456'}]
        })
    }

    render(){
        return(
            <div>

            </div>
        );
    }
}

class Fav extends React.Component{
    
}

export default withRouter(PersonalCenter);