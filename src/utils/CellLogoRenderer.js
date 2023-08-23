import { Component } from "react";

export class LogoCellRenderer extends Component {
    constructor(props) {
      super(props);
      this.logo = this.props.data.logo;
    }
    render() {
      return (
        <img style={{ height: "14px", width: "14px" }} alt="placeholder" src={this.logo} />
      )
    }
  }