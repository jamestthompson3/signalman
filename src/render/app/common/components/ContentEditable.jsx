import React from "react";
import ReactDOM from "react-dom";
import ContentEditable from "react-contenteditable";

export class Editable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: props.value };
    this.contentEditable = React.createRef();
  }

  disableNewlines = (e) => {
    const keyCode = e.keyCode || e.which;

    if (keyCode === 13) {
      e.returnValue = false;
      if (e.preventDefault) e.preventDefault();
    }
  };

  // pastePlainText = evt => {
  //       evt.preventDefault()

  //       const text = evt.clipboardData.getData('text/plain')
  //       document.execCommand('insertHTML', false, text)
  //     }

  highlightAll = () => {
    setTimeout(() => {
      document.execCommand("selectAll", false, null);
    }, 0);
  };

  handleCEUpdate = (e) => {
    this.setState({ value: e.target.value }, () =>
      this.props.send(e.target.value)
    );
  };

  render() {
    // onPaste={this.pastePlainText}
    return (
      <ContentEditable
        html={this.state.value}
        className="content-editable"
        onKeyPress={this.disableNewlines}
        onFocus={this.highlightAll}
        onChange={this.handleCEUpdate}
      />
    );
  }
}
