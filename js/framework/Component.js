import { bindAll } from './../utils/helpers';

export default class Component {

  constructor(props) {
    this.state = {};
    this.props = props || {};

    bindAll(
      this,
      'update',
      'updateState'
    );
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
  }

  updateState(nextState) {
    this.state = Object.assign({}, this.state, nextState);
    this.render();
  }

  render() {}
}
