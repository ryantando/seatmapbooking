import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from "react-native";
import { connect } from 'react-redux'
import lodash from 'lodash'
class SeatMapApp extends Component {

    constructor(props){
        super(props)
        this.state ={
          seat:[],
          seat2:[],
          totalSeat:0,
          totalPassenger:0
        }
      }
    
    renderSeatCol(index1){
        let card = []
        let count = 0
        lodash.times(this.props.layout[index1][1], (i1) => {
            card.push(<View style={[styles.col, {marginHorizontal:10}]} key={i1}>
                        {
                        lodash.times(this.props.layout[index1][0], (i) => {
                            count+=1
                            let found = this.state.seat2.find(function(element) {
                            return element.seatNum ===  [`${i1}`] + [`${index1}`] + [`${i}`] ;
                            });
                            //console.log(found)
                            return (<TouchableOpacity 
                                    key={ [`${i1}`] + [`${index1}`] + [`${i}`]}
                                    onPress={() => alert('This is seat: ' + [`${i1}`] + [`${index1}`] + [`${i}`])}
                                    style={{width:20, height:20, 
                                        backgroundColor: found.type === 'window'  ?  '#AAC46C' 
                                                :  found.type === 'aisle'  ?  '#6095C9' 
                                                :'#CC665F', borderColor:'#fff', borderWidth:1}} >
                                                <Text style={{textAlign:'center', textAlignVertical:'center', fontSize:12}}>{ found.passengerNum }</Text>
                                    </TouchableOpacity>
                                    );
                                    
                        })
                        }
                    </View>);
        });
        return card
    }

    renderSeatColArray(){
        let seat2 = this.state.seat2
        let totalSeat = 0
        let card = []
        for(let i =0; i< this.props.layout.length ; i++){
            lodash.times(this.props.layout[i][1], (index1) => {
            lodash.times(this.props.layout[i][0], (index2) => {
                let seatKey = [`${index1}`] + [`${i}`] +  + [`${index2}`] 
                seat2[totalSeat]  = {
                    seatNum: seatKey,
                    type:  ((i === 0 && index2=== 0) || (i === (this.props.layout.length-1) && index2 === this.props.layout[this.props.layout.length-1][0]-1))  ?  'window' 
                            :  ((index2===0) || (index2 === this.props.layout[i][0]-1))  ?  'aisle' 
                            :'middle',
                    seated : false,
                    passengerNum : ''
                }
                totalSeat+=1
                this.setState({ 
                    seat2: seat2,
                    totalSeat: totalSeat
                });
            });
            });
        }
    }

    getPassengerSeat(){
        console.log(this.state.totalPassenger,this.state.seat2.length)
        if(this.state.totalPassenger <= this.state.seat2.length){
            let seat2 = this.state.seat2
            let window = this.state.seat2.filter(data => data.type === 'window').sort(function(a, b) {
                return a.seatNum - b.seatNum;
            });
            let aisle = this.state.seat2.filter(data => data.type === 'aisle').sort(function(a, b) {
                return a.seatNum - b.seatNum;
            });
            let middle = this.state.seat2.filter(data => data.type === 'middle').sort(function(a, b) {
                return a.seatNum - b.seatNum;
            });
            let temp = []
            let combine = aisle.concat(window,middle)
            /* for(let i = 0; i<this.state.totalSeat;i++){
                let fixed = combine[i]
                fixed.passengerNum = (i+1).toString()
                fixed.seated = true
                temp.push(fixed)
            } */ //Function of no changes
            for(let i = 0; i<this.state.seat2.length;i++){
                if(i < this.state.totalPassenger){
                    let fixed = combine[i]
                    fixed.passengerNum = (i+1).toString()
                    fixed.seated = true
                    temp.push(fixed)
                }else{
                    let fixed = combine[i]
                    fixed.passengerNum = ''
                    fixed.seated = false
                    temp.push(fixed)
                }
            }
            let returnData = Object.assign(temp, seat2)
            console.log(returnData)
            this.setState({ 
                seat2: returnData 
            });
        }else{
            alert('Seat is not enough')
        }
    }
    

    async componentWillMount(){
        await this.renderSeatColArray()
    }

    render() {
        return (
            <View style={styles.con}>
                <View style={styles.cockpit}/>
                <View style={styles.container}>
                    {
                        this.props.layout.map((data, index1) => {
                            return(
                                <View key={index1} key={index1}> 
                                    {this.renderSeatCol(index1)}
                                </View>
                            )
                        })
                    }
                </View>
                <Text style={styles.instructions}>Input the number of passenger in the blue box</Text>
                <View style={styles.containerButton}>
                    <TextInput
                        maxLength = {3}
                        keyboardType="numeric"
                        value={`${this.state.totalPassenger}`}
                        onChangeText={(val) => this.setState({ totalPassenger : val })}
                        style={styles.textInputStyle}
                    />
                    <TouchableOpacity onPress={() => this.getPassengerSeat()} style={styles.btnStyle}>
                        <Text style={styles.btnText}>Get Passenger Seat</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

function mapStateToProps(state) {
    return {
        passengerTotal: state.passengerTotal,
        layout: state.layout
    }
}


export default connect(mapStateToProps)(SeatMapApp)


const styles = StyleSheet.create({
    con: {flex:1, borderWidth:3, borderColor:'#000', borderTopRightRadius:500, overflow:'hidden', borderTopLeftRadius:500},
    cockpit: {top:-70, position:'absolute',borderColor:'#000', borderWidth:1, width:200, height:100, overflow:'hidden', alignSelf:'center'},
    container: {
      flex: 1,
      /* justifyContent: 'center',
      alignItems: 'center', */
      backgroundColor: '#F5FCFF',
      flexDirection: 'row',
      marginTop:200,
      alignSelf: 'center',
    },
    containerButton: {flexDirection:'row',alignSelf:'center'},
    textInputStyle: {backgroundColor:'#6095C9', color:'#fff', width:60, height:50, bottom:10, borderRadius:5, fontSize:20, textAlign:'center', marginRight:10, borderBottomWidth:2},
    btnStyle : {height:50, width:200, alignSelf:'center', bottom:10, backgroundColor:'#000', borderRadius:5},
    btnText: {flex:1, fontSize:20, textAlign:"center", textAlignVertical:'center', color:'#fff'},
    col: {flexDirection:'row'},
    instructions: {marginBottom:20, textAlign:'center'}
  });