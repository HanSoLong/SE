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
  ];

const weekOption = [
    {value: 'Monday', label: '周一'},
    {value: 'Tuesday', label: '周二'},
    {value: 'Wednesday', label: '周三'},
    {value: 'Thursday', label: '周四'},
    {value: 'Friday', label: '周五'},
];

class FreeRoom extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            buildingValue: null,
            weekValue: null,
            semesterOption: null,
        };
    }

    buildingHandler = selectedOptions =>{
        this.setState({
            buildingValue: selectedOptions
        });
        console.log(this.state.buildingValue)
    }

    weekHandler = selectedOptions =>{
        this.setState({
            weekValue: selectedOptions
        });
    }

    render(){
        return(
            <div>
                <div id='selectContainer'>
                    <Select className='roomselect'
                    value={this.state.buildingValue}
                    onChange={this.buildingHandler}
                    options={buildingOption}/>

                    <Select className='roomselect'
                    value={this.state.weekValue}
                    onChange={this.weekHandler}
                    options = {weekOption}/>

                    <Button variant="primary">查找</Button>
                </div>
                <ListGroup>
                    <ListGroup.Item>Cras justo odio</ListGroup.Item>
                    <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                    <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                    <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                    <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                </ListGroup>
                
            </div>
            
            
        );
    }
}

export default FreeRoom