import React from 'react';
import FormControl from 'react-bootstrap/FormControl'
import InputGroup from 'react-bootstrap/InputGroup'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button';
//import Slate from 'slate-react'

class ClassComments extends React.Component{

    constructor(props){
        super(props)
        this.state={
            commentList: [],      
        }
        this.newComment = React.createRef()
    }

    componentWillMount(){
        this.getClassCommentList()
    }

    getClassCommentList = async() => {

        const params = new URLSearchParams(this.props.location.search);
        const message = {
            "courseNo": params.get('code'),
            "teacherName" : params.get('teacher'),
        }
        //console.log(message)
        const fetchOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        };

        const result = await fetch('/api/getcomment', fetchOptions)
        const json = await result.json()

        this.setState({
            commentList: json
        })
    }

    submitNewComment = async() => {
        if(this.newComment.value !=='')
        {
            const params = new URLSearchParams(this.props.location.search)
            const message={
                "courseNo": params.get('code'),
                "teacherName" : params.get('teacher'),
                "email": params.get('email'),
                "commentText": this.newComment.value
                }

            const fetchOptions = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };

            await fetch('/api/writecomment', fetchOptions)
            this.getClassCommentList()
        }
        
    }

    mapCommentTags(){
        return this.state.commentList.map((data) => 
            <Card style={{ width: '18rem' }}>
                <Card.Header><strong>{data.email}</strong></Card.Header>
                <Card.Body>
                    <Card.Text>
                        {data.commentText}
                    </Card.Text>
                </Card.Body>
            </Card>)
    }

    render(){
        const comments=this.mapCommentTags()
        return(
            <div>
                <div>
                    {comments}
                </div>
                <InputGroup>
                    <FormControl
                    ref={(ref) => {this.newComment = ref}}
                    placeholder="新评论"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    />
                    <InputGroup.Append>
                        <Button variant="primary" onClick={this.submitNewComment}>提交</Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        );
    }
}

export default ClassComments