import { Component } from "react";
import { Link } from "react-router-dom";

export class LinkCellRenderer extends Component {
    constructor(props) {
      super(props);
      this.linkClickedHandler = this.linkClickedHandler.bind(this);
    }
    linkClickedHandler() {
     this.props.clicked(this.props.data);
    }
    render() {
      return (
        <Link to={'/employees'} onClick={this.linkClickedHandler}>{this.props.value}</Link>
      )
    }
  }