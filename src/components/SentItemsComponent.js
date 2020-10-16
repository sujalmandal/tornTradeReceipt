/* eslint-disable react/no-direct-mutation-state */
import React, { Component } from "react"
import { Input } from "reactstrap"
import { Container, Row, Col } from 'reactstrap';
import { Table } from 'reactstrap';
import { Button, ButtonGroup } from 'reactstrap';
import {IdGenerator} from '../utils/IdGenerator'
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { connect } from 'react-redux';

class SentItemsComponent extends Component{
    constructor(props){
        super(props);
        this.state={
            totalPrice:0,
            rows:[{id:IdGenerator(),name:"",qty:0,mPrice:0,tPrice:0}],
            itemNames:[]
        }
    }

    addRow=()=>{
        this.state.rows.push({
            id:IdGenerator(),
            name:"",
            qty:0,
            mPrice:0,
            tPrice:0
        })
        this.forceUpdate();
        this.props.handleSentItemsUpdated();
    }

    removeRow=(currentRow)=>{
        this.state.rows=this.state.rows.filter((row)=>{
            return row.id!==currentRow.id;
        });
        this.forceUpdate();
        this.props.handleSentItemsUpdated();
    }

    updateValue=(event)=>{
        var fieldName=event.target.name.split("_")[0];
        var rowId=event.target.name.split("_")[1];
        var value=event.target.value;
        this.state.rows.forEach((row)=>{
            if(row.id===rowId){
                row[fieldName]=value;
            }
        });
        this.forceUpdate();
        this.props.handleSentItemsUpdated();
    }

    updateTypeAheadSelectedName=(selectedItemName,rowId)=>{
        this.state.rows.forEach((row)=>{
            if(row.id===rowId){
                row["name"]=selectedItemName;
            }
        });
        this.forceUpdate();
        this.props.handleSentItemsUpdated();
    }

    render(){
        return(
            <Container>
                <Row>
                    <Col><h4>Items sent</h4></Col>
                </Row>
                <Row>
                <Table id="sentListTable">
                    <thead>
                        <tr>
                        <th>Item name</th>
                        <th>Quantity</th>
                        <th>Best Price</th>
                        <th>Total Price</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.rows.map((row,index)=>{
                           return (
                            <tr key={row.id}>
                            <td>    
                            <Typeahead id={"name_"+row.id} onChange={(selected)=>{this.updateTypeAheadSelectedName(selected,row.id)}} options={this.state.itemNames}/>
                            </td>
                            <td><Input type="number" name={"qty_"+row.id} value={row.qty} onChange={this.updateValue}/></td>
                            <td><Input type="number" name={"mPrice_"+row.id} value={row.mPrice} disabled={true}/></td>
                            <td><Input type="number" name={"tPrice_"+row.id} value={row.tPrice} disabled={true}/></td>
                            <td>
                            <div>
                                <ButtonGroup>
                                    <Button color="success" onClick={()=>{this.addRow()}}>+</Button>
                                    <Button color="danger" onClick={()=>{this.removeRow(row)}}>-</Button>
                                </ButtonGroup>
                            </div>
                            </td>
                            </tr>
                           );
                        })}
                    </tbody>
                </Table>
                </Row>
                <Row>
                    <Col>Total market price of items sent: {this.state.totalPrice}</Col>
                </Row>
            </Container>
        )
    }
}

/* mapping for redux */
const mapStateToProps = state => {
    return {
      count: state
    };
};

const mapDispatchToProps = dispatch => {
    return {
        handleSentItemsUpdated: () => dispatch({type: 'UPDATE_SENT_ITEMS',payload: {"sentItems":this.state.rows}})
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(SentItemsComponent);