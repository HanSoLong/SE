import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import './Classes.css'
import Table from 'react-bootstrap/Table'
import {Link} from 'react-router-dom'
import Alert from 'react-bootstrap/Alert'

// const buildingOption = [
//     { value: 'building_1', label: '第一教学楼' },
//     { value: 'building_2', label: '第二教学楼' },
//     { value: 'building_3', label: '第三教学楼' },
//     { value: 'building_4', label: '第四教学楼' },
//     {value: 'None', label: '不限'}
//   ];

// const weekOption = [
//     {value: 'Monday', label: '周一'},
//     {value: 'Tuesday', label: '周二'},
//     {value: 'Wednesday', label: '周三'},
//     {value: 'Thursday', label: '周四'},
//     {value: 'Friday', label: '周五'},
//     {value: 'None', label: '不限'}
// ];


class Classes extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            searchErrorTip: false,
            classList: null,
        };
        this.classNameInput = React.createRef();
        this.teacherInput = React.createRef();
    }

    notify = () => toast("收藏成功");

    sumbitSearch = async() => {

        if(this.classNameInput.value !== '' || this.teacherInput.value !== ''){
            
            const message = {
                "courseName": this.classNameInput.value,
                "teacherName" : this.teacherInput.value,
            }
            
            const fetchOptions = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };
            
            const response = await fetch('/api/getcourse', fetchOptions)
            const json = await response.json()
            console.log(json)
            this.setState({
                classList: json,
                searchErrorTip: false
            })
            
        }else{
            this.setState({
                searchErrorTip: true
            })
        }
    }

    addFavClass = async(courseNo, email, teacherName) => {
        const message = {
            "courseNo": courseNo,
            "email": email,
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

        await fetch('/api/addcollect', fetchOptions)
        this.notify()
    }

    classListMap = (data) => {
        let params = `search?code=${data.courseNo}&teacher=${data.teacherName}&email=${this.props.email}`
        let email = this.props.email
        return <tr>
                    <td>{data.classroom}</td>
                    <td>{data.courseName}</td>
                    <td>{data.teacherName}</td>
                    <td>{data.lessonDetail}</td>
                    <td><Link to={`/classcomments/${params}`} target="_blank">查看</Link></td>
                    <td><Button onClick={()=>this.addFavClass(data.courseNo, email, data.teacherName)}>添加</Button></td>
                </tr>
    }

    render(){
        let classRows = <div></div>
        if(this.state.classList !== null){
            classRows = this.state.classList.map(this.classListMap)
        }
        
        return(
            <div>
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
                <div classNmae='contentContainer'>
                    <div className='componentContainer'>
                        <InputGroup className='selectinput'>
                            <FormControl
                            ref={(ref) => {this.classNameInput = ref}}
                            placeholder="课程名称"
                            aria-label="课程名称"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>

                        <InputGroup>
                            <FormControl
                            ref={(ref) => {this.teacherInput = ref}}
                            placeholder="授课教师"
                            aria-label="授课教师"
                            aria-describedby="basic-addon1"
                            />
                        </InputGroup>
                        
                        <Button variant="primary" onClick={this.sumbitSearch}>查找</Button>
                    </div>
                    <div className='componentContainer'>
                        {this.state.searchErrorTip && <Alert variant='danger'>搜索条件不能为空</Alert>}
                    </div>
                    <div className='componentContainer searchResult'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>位置</th>
                                <th>课程名称</th>
                                <th>授课教师</th>
                                <th>上课时间</th>
                                <th>评论</th>
                                <th>收藏</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classRows}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Classes