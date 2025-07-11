const { lighten, darken } = require('polished');

const primaryColor = '#F37021';
const primaryLightColor = '#48A1B0';
const secondaryColor = '#FFCB05';
const whiteColor = '#FFFFFF';

module.exports = {
  brand: {
    primary: primaryColor,
    primaryLight: primaryLightColor,
    secondary: secondaryColor,
    white: whiteColor,
  },
  aux: {
    S7: '#FCAF17',
  },
  alerts: {
    orange: '#F26E23',
    yellow: '#F1AD47',
    green: '#378605',
    blue: '#288BE2',
    purple: '#8A33CF',
    red: '#FF0000',
  },
  title: {
    gold: '#E39703',
  },
  background: {
    blueLight: '#36A1AC1A',
    brandLight: '#F370211A',
    yellowLight: '#FEE27833',
  },
  divider: { green: '#3AC658' },
  borderColor: {
    primary: '#1e1e1e66',
    secondary: '#36A1AC',
    light: '#E3E3E8',
    secondaryLight: '#36A1AC0D',
  },
  text: {
    brand: '#C24003',
    darker: darken(0.2, '#202020'),
    primary: '#202020',
    semiLight: lighten(0.2, '#202020'),
    light: lighten(0.4, '#202020'),
    placeholder: '#B0B3C0',
  },
  table: {
    text: {
      normal: '#646981',
    },
  },
};
