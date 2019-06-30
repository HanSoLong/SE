import React from 'react';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl'
import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import './FreeRoom.css'

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

const timeOption = [
    {value: '1/2', label: '一/二节'},
    {value: '3/4', label: '三/四节'},
    {value: '5/6', label: '五/六节'},
    {value: '7/8', label: '七/八节'},
    {value: '9/10', label: '九/十节'},
    {value: '11/12', label:'十一/十二节'}
]

class FreeRoom extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            buildingValue: null,
            weekValue: null,
            semesterOption: null,
            time: null,
            freeRooms: [],
            searchErrorTip: false,
        };
        this.semesterInput = React.createRef()
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

    timeHandler = selectedOptions => {
        this.setState({
            time: selectedOptions
        })
    }

    sumbitSearch = async ()=>{
        if((this.state.weekValue || this.state.buildingValue)
         && (this.state.weekValue.value!=='None' || this.state.buildingValue.value!=='None')
         && this.semesterInput.value && this.state.time){

            let message = {
                'buildingNo': this.state.buildingValue,
                'day': this.state.weekValue,
                'lessonPeriod': this.state.time,
                'weekNo': this.semesterInput.value,
            }

            const fetchOptions = {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(message)
            };

            const result = await fetch('/api/getfreeroom', fetchOptions)
            let responseJson  = await result.json()

            this.setState({
                searchErrorTip: false,
                freeRooms: responseJson
            })
            //submit
        }else{
            this.setState({
                searchErrorTip: true
            })
        }
    }

    render(){
        const freeRoomListItem = this.state.freeRooms.map((room)=><ListGroup.Item>{room}</ListGroup.Item>)
        return(
            <div>
                <div className='selectContainer'>
                    <Select className='roomselect'
                    value={this.state.buildingValue}
                    onChange={this.buildingHandler}
                    options={buildingOption}/>

                    <Select className='roomselect'
                    value={this.state.weekValue}
                    onChange={this.weekHandler}
                    options = {weekOption}/>

                    <Select className='roomselect'
                    value={this.state.time}
                    onChange={this.timeHandler}
                    options = {timeOption}/>

                    <InputGroup className='roomselect'>
                            <FormControl
                            type= 'number'
                            min="1" 
                            max="16"
                            ref={(ref) => {this.semesterInput = ref}}
                            placeholder="周数"
                            aria-label="周数"
                            aria-describedby="basic-addon1"
                            />
                    </InputGroup>

                    <Button variant="primary" onClick={this.sumbitSearch}>查找</Button>
                    {this.state.searchErrorTip && <p>搜索条件不能为空</p>}
                </div>
                <ListGroup>
                    {freeRoomListItem}
                </ListGroup>
                
            </div>
            
            
        );
    }
}

export default FreeRoom