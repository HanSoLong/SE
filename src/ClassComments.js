import React from 'react';
import FormControl from 'react-bootstrap/FormControl'
import Card from 'react-bootstrap/Card'
//import Slate from 'slate-react'

class ClassComments extends React.Component{

    constructor(props){
        super(props)
        this.state={
            classCode: null,
            commentList: null,
            newComment: null,         
        }
    }

    componentWillMount(){
        this.getClassCommentList()
    }

    getClassCommentList = () => {
        this.setState({
            classCode: this.props.match.params.id,
        })
        console.log(this.state.classCode)
        this.setState({
            commentList: [{comtent:'样例评论内容1', username:'用户1'}, {comtent:'样例评论内容2', username:'用户2'}, {comtent:'样例评论内容3', username:'用户3'}]
        })
    }

    mapCommentTags(){
        return this.state.commentList.map((data) => 
            <Card style={{ width: '18rem' }}>
                <Card.Header><strong>{data.username}</strong></Card.Header>
                <Card.Body>
                    <Card.Text>
                        {data.comtent}
                    </Card.Text>
                </Card.Body>
            </Card>)
    }

    render(){
        const comments=this.mapCommentTags()
        return(
            <div>
                {this.state.classCode}
                <div>
                    {comments}
                </div>
            </div>
        );
    }
}

export default ClassComments