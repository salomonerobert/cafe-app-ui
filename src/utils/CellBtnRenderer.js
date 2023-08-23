import { Component } from "react";
import Button from '@mui/material/Button';

export class BtnCellRenderer extends Component {
    constructor(props) {
      super(props);
      this.btnClickedHandler = this.btnClickedHandler.bind(this);
      this.title = this.props.title;
    }
    btnClickedHandler() {
     this.props.clicked(this.props.data);
    }
    render() {
      return (
        <Button variant="contained" size="small" onClick={this.btnClickedHandler}>{this.title}</Button>
      )
    }
  }