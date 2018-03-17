import { elements } from './../utils/elements';

export default class Degree {

  constructor(props) {
    this.props = props;
    this.state = {
      degree: 'M'
    }

    elements.celsiusButton.classList.add('active');

    elements.celsiusButton.addEventListener('click', e => {
      if (!e.target.classList.contains('active')) {
        this.updateState({degree: 'M'});
        this.props.onDegreeChange('M', this.convertToC);
      }
    });

    elements.fahrenheitButton.addEventListener('click', e => {
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
    const targetButton = degree === 'M' ? elements.celsiusButton : elements.fahrenheitButton;

    if (!targetButton.classList.contains('active')) {
      const sibling = targetButton.nextElementSibling || targetButton.previousElementSibling;
      targetButton.classList.add('active');
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
