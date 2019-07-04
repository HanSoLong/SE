import React from "react";
import { geolocated } from "react-geolocated";
import Button from 'react-bootstrap/Button';
import { ToastContainer, toast } from 'react-toastify';

const EARTH_RADIUS = 6378137.0;    //单位M
const PI = Math.PI;

class GeoModule extends React.Component{
    
    getRad = (d) => {
        return d*PI/180.0;
    }



    getFlatternDistance = (lat1,lng1,lat2,lng2) => {
        var f = this.getRad((lat1 + lat2)/2);
        var g = this.getRad((lat1 - lat2)/2);
        var l = this.getRad((lng1 - lng2)/2);
        
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        
        var s,c,w,r,d,h1,h2;
        var a = EARTH_RADIUS;
        var fl = 1/298.257;
        
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;
        
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;
        
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;
        return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    }

    //116.487865,39.88129

    searchNearest = () => {
        if(!this.props.isGeolocationAvailable){
            toast("您的浏览器不支持获取位置")
        }else if(!this.props.isGeolocationEnabled){
            toast("未获取定位权限")
        }else if(this.props.coords){
            
        }else{
            toast("加载中")
        }
    }

    getNearestFreeRoom = async() => {
        let time = null
        let buildingNo = null
        let now = new Date()
        if(!this.props.isGeolocationAvailable){
            toast("您的浏览器不支持获取位置")
        }else if(!this.props.isGeolocationEnabled){
            toast("未获取定位权限")
        }else if(this.props.coords){
            let dist1 = this.getFlatternDistance(39.883667, 116.485646, this.props.coords.latitude, this.props.coords.longitude) //1
            let dist2 = this.getFlatternDistance(39.88129, 116.487865, this.props.coords.latitude, this.props.coords.longitude) //3

            if(now.getHours()<10){
                time = '1'
            } else if (now.getHours()>=10 && now.getHours()<12){
                time = '2'
            } else if (now.getHours()>=12 && now.getHours()<15){
                time = '3'
            } else if (now.getHours()>=15 && now.getHours()<17){
                time = '4'
            } else if (now.getHours()>=17){
                time = '5'
            }

            if(dist1 > dist2){
                buildingNo = '3教'
            }else{
                buildingNo = '1教'
            }

            let message = {
                'buildingNo': buildingNo,
                'day': now.getDay(),
                'lessonPeriod': time,
                'weekNo': "1",
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
            const json = await result.json()
            toast(json[0].classroom)
        }else{
            toast("加载中")
        }
        


    }

    render(){
        var now = new Date()
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
                    pauseOnHover={false}
                />
                <Button onClick={this.getNearestFreeRoom}>空教室速查</Button>
            </div>
        );
    }

    // render() {
    //     return !this.props.isGeolocationAvailable ? (
    //         <div>Your browser does not support Geolocation</div>
    //     ) : !this.props.isGeolocationEnabled ? (
    //         <div>Geolocation is not enabled</div>
    //     ) : this.props.coords ? (
    //         <table>
    //             <tbody>
    //                 <tr>
    //                     <td>latitude</td>
    //                     <td>{this.props.coords.latitude}</td>
    //                 </tr>
    //                 <tr>
    //                     <td>longitude</td>
    //                     <td>{this.props.coords.longitude}</td>
    //                 </tr>
    //                 <tr>
    //                     <td>altitude</td>
    //                     <td>{this.props.coords.altitude}</td>
    //                 </tr>
    //                 <tr>
    //                     <td>heading</td>
    //                     <td>{this.props.coords.heading}</td>
    //                 </tr>
    //                 <tr>
    //                     <td>speed</td>
    //                     <td>{this.props.coords.speed}</td>
    //                 </tr>
    //             </tbody>
    //         </table>
    //     ) : (
    //         <div>Getting the location data&hellip; </div>
    //     );
    // }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
})(GeoModule);