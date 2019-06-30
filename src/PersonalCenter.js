import React from 'react';
import { withRouter, Link, Route } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'

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

                {this.state.flag === 'view_fav' && <ViewFav email={this.props.email} username={this.props.username} />}

                <Card>
                    <Card.Body>
                        <Card.Text>
                            管理评论
                            <Button variant='primary' onClick={() => {this.handleClick('manage_comments')}}> 开始 </Button>
                        </Card.Text>
                    </Card.Body>
                </Card>

                {this.state.flag === 'manage_comments' && <ManageComments email={this.props.email} username={this.props.username} />}
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
        this.newPasswrod = React.createRef()
        this.confimPassword = React.createRef()
    }

    handleSubmit = async() => {
        let status = this.localPasswordCheck()
        if(status === 'clear'){
            let message = {
                "email": this.props.email,
                "password": this.newPasswrod.value
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };

            await fetch('/api/updatepassword', fetchOptions)

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
            commentList: []
        }
    }

    componentWillMount(){
        this.getCommentList()
    }

    deleteComment = async(code, teacherName, text) => {
        const message = {
            "email": this.props.email,
            "courseNo": code,
            "teacherName": teacherName,
            
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        await fetch('/api/deletecomment', fetchOptions)
        await this.getCommentList()
    }

    getCommentList = async() => {
        const message = {
            "email": this.props.email
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        const result = await fetch('/api/getusercomment', fetchOptions)
        const json = await result.json()
        this.setState({
            commentList: json
        })
    }

    render(){
            let commentList = this.state.commentList.map((data) =>
                    <Comment code={data.courseNo} text={data.commentText} coursename={data.courseName} teacherName={data.teacherName} handleClick={this.deleteComment}/>)
        
        return(
            <div>
                {commentList}
            </div>
            
        );
    }
}

class Comment extends React.Component{

    handleClick= () => {
        this.props.handleClick(this.props.code, this.props.teacherName, this.props.text)
    }

    render(){
        return(
            <Card style={{ width: '18rem' }}>
                <Card.Header><strong>{this.props.email}</strong></Card.Header>
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
            favList: []
        }
    }

    componentWillMount(){
        this.getFav()
        // this.setState({
        //     favList: [{'text': 'class1', 'code': '456'}, {'text': 'class2', 'code': '123'}]
        // })
    }

    getFav = async() => {
        const message={
            "email": this.props.email
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        const result = await fetch('/api/querycollect', fetchOptions)
        const json = await result.json()

        this.setState({
            favList: json
        })
    }

    deleteFav = async(courseNo, teacherName) => {
        const message={
            "email": this.props.email,
            "courseNo": courseNo,
            "teacherName": teacherName
        }

        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        await fetch('/api/deletecollect', fetchOptions)
        this.getFav()
    }


    render(){
        let favList = this.state.favList.map((data) => 
        <Fav courseNo={data.courseNo} classroom={data.classroom} courseName={data.courseName} teacherName={data.teacherName} lessonDetail={data.lessonDetail} handleClick={this.deleteFav}/>)
        return(
            <div>
                <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>位置</th>
                                <th>课程名称</th>
                                <th>授课教师</th>
                                <th>上课时间</th>
                                <th>删除收藏</th>
                                </tr>
                            </thead>
                            <tbody>
                                {favList}
                            </tbody>
                        </Table>
            </div>
        );
    }
}

class Fav extends React.Component{

    handleClick = () => {
        this.props.handleClick(this.props.courseNo, this.props.teacherName)
    }

    render(){
        return(
            <tr>
                <td>{this.props.classroom}</td>
                <td>{this.props.courseName}</td>
                <td>{this.props.teacherName}</td>
                <td>{this.props.lessonDetail}</td>
                <td><Button onClick={this.handleClick}>删除</Button></td>
            </tr>
        );
    }
}

export default withRouter(PersonalCenter);