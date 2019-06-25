import React from 'react';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
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

class FreeRoom extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            buildingValue: null,
            weekValue: null,
            semesterOption: null,
            freeRooms: [],
            searchErrorTip: false,
        };
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
        if((this.state.weekValue || this.state.buildingValue) && (this.state.weekValue.value!=='None' || this.state.buildingValue.value!=='None')){
            this.setState({
                searchErrorTip: false,
                freeRooms: ['121','212']
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