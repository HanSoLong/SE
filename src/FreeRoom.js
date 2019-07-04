import React from 'react';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl'
import ListGroup from 'react-bootstrap/ListGroup'
import InputGroup from 'react-bootstrap/InputGroup'
import './FreeRoom.css'

const buildingOption = [
    { value: '1教', label: '第一教学楼' },
    { value: '3教', label: '第三教学楼' },
  ];

const weekOption = [
    {value: '1', label: '周一'},
    {value: '2', label: '周二'},
    {value: '3', label: '周三'},
    {value: '4', label: '周四'},
    {value: '5', label: '周五'},
];

const timeOption = [
    {value: '1', label: '一/二节'},
    {value: '2', label: '三/四节'},
    {value: '3', label: '五/六节'},
    {value: '4', label: '七/八节'},
    {value: '5', label: '九/十节'},
    {value: '6', label:'十一/十二节'}
]

class FreeRoom extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            buildingValue: {value: '', label: '位置'},
            weekValue: {value: '', label: '星期'},
            time: {value: '', label: '时间'},
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

    sumbitSearch = async () =>{
        
        if( this.semesterInput.value && (this.state.buildingValue && this.state.buildingValue.value) &&
         (this.state.weekValue && this.state.weekValue.value) && (this.state.time && this.state.time.value) ){

            this.setState({
                searchErrorTip: false,
            })

            let message = {
                'buildingNo': this.state.buildingValue.value,
                'day': this.state.weekValue.value,
                'lessonPeriod': this.state.time.value,
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

            const result = await fetch('/api/queryclassroom', fetchOptions)
            let responseJson  = await result.json()

            this.setState({
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
        let freeRoomListItem = <div></div>
        if (this.state.freeRooms.length > 0){
            freeRoomListItem = this.state.freeRooms.map((room)=><ListGroup.Item>{room.classroom}</ListGroup.Item>)
        }
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