import React from 'react';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import './Classes.css'
import Table from 'react-bootstrap/Table'
import {Link} from 'react-router-dom'

const buildingOption = [
    { value: 'building_1', label: '第一教学楼' },
    { value: 'building_2', label: '第二教学楼' },
    { value: 'building_3', label: '第三教学楼' },
    { value: 'building_4', label: '第四教学楼' },
    {value: 'None', label: '不限'}
  ];

const weekOption = [
    {value: 'Monday', label: '周一'},
    {value: 'Tuesday', label: '周二'},
    {value: 'Wednesday', label: '周三'},
    {value: 'Thursday', label: '周四'},
    {value: 'Friday', label: '周五'},
    {value: 'None', label: '不限'}
];


class Classes extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            buildingValue: null,
            weekValue: null,
            searchErrorTip: false,
            timeOfSemester: null,
        };
        this.classNameInput = React.createRef();
        this.teacherInput = React.createRef();
    }

    buildingHandler = selectedOptions =>{
        this.setState({
            buildingValue: selectedOptions
        });
    }

    weekHandler = selectedOptions =>{
        this.setState({
            weekValue: selectedOptions
        });
    }

    sumbitSearch = ()=>{
        const className = this.classNameInput.value
        const teacherName = this.teacherInput.value
        console.log(className, teacherName)
        if((this.state.weekValue || this.state.buildingValue) && (this.state.weekValue.value!=='None' || this.state.buildingValue.value!=='None')){
            this.setState({
                searchErrorTip: false
            })
            //submit
        }else{
            this.setState({
                searchErrorTip: true
            })
        }
    }

    render(){
        return(
            <div>
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

                        <Select className='select'
                        value={this.state.buildingValue}
                        onChange={this.buildingHandler}
                        options={buildingOption}/>

                        <Select className='select'
                        value={this.state.weekValue}
                        onChange={this.weekHandler}
                        options = {weekOption}/>
                        
                        <Button variant="primary" onClick={this.sumbitSearch}>查找</Button>
                    </div>
                    <div className='componentContainer'>
                        {this.state.searchErrorTip && <p>搜索条件不能为空</p>}
                    </div>
                    <div className='componentContainer searchResult'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                </tr>
                                <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                </tr>
                                <tr>
                                <td>3</td>
                                <td>Larry the Bird</td>
                                <td><Link to='/classcomments/123'>comment</Link></td>
                                <td>@twitter</td>
                                </tr>
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }
}

export default Classes