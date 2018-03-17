import { elements } from './../vendor/elements';

export default class Degree {

  constructor(props) {
    this.props = props;
    this.state = {
      degree: 'M'
    }

    elements.celsius_button.classList.add('active');

    elements.celsius_button.addEventListener('click', e => {
      if (!e.target.classList.contains('active')) {
        this.updateState({degree: 'M'});
        this.props.onDegreeChange('M', this.convertToC);
      }
    });

    elements.fahrenheit_button.addEventListener('click', e => {
      if (!e.target.classList.contains('active')) {
        this.updateState({degree: 'I'});
        this.props.onDegreeChange('I', this.convertToF);
      }
    });
  }

  update(nextProps) {
    this.props = Object.assign({}, this.props, nextProps);
    this.updateState({degree: this.props.degree});
  }

  updateState(nextState) {
    this.state = nextState;
    this.changeActiveButton(this.state.degree);
  }

  changeActiveButton(degree) {
    const target_button = degree === 'M' ? elements.celsius_button : elements.fahrenheit_button;

    if (!target_button.classList.contains('active')) {
      const sibling = target_button.nextElementSibling || target_button.previousElementSibling;
      target_button.classList.add('active');
      sibling.classList.remove('active');
    }
  }

  convertToC(temp) {
    return Math.round((temp - 32) / 1.8);
  }

  convertToF(temp) {
    return Math.round(temp * 1.8 + 32);
  }

}
