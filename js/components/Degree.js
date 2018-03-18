import Component from './../framework/Component';
import { elements } from './../utils/elements';

export default class Degree extends Component {

  constructor(props) {
    super(props);

    this.state = {
      degree: 'M'
    }

    elements.celsiusButton.classList.add('active');

    elements.celsiusButton.addEventListener('click', e => {
      if (this.state.degree !== 'M') {
        this.updateState({degree: 'M'});
        this.props.onDegreeChange(this.state.degree);
      }
    });

    elements.fahrenheitButton.addEventListener('click', e => {
      if (this.state.degree !== 'I') {
        this.updateState({degree: 'I'});
        this.props.onDegreeChange(this.state.degree);
      }
    });
  }

  render() {
    if (this.state.degree === 'M') {
      elements.celsiusButton.classList.add('active');
      elements.fahrenheitButton.classList.remove('active');
    }

    if (this.state.degree === 'I') {
      elements.celsiusButton.classList.remove('active');
      elements.fahrenheitButton.classList.add('active');
    }
  }
}
