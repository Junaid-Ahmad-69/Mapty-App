'use strict';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form'),
    containerWorkouts = document.querySelector('.workouts'),
    inputType = document.querySelector('.form__input--type'),
    inputDistance = document.querySelector('.form__input--distance'),
    inputDuration = document.querySelector('.form__input--duration'),
    inputCadence = document.querySelector('.form__input--cadence'),
    inputElevation = document.querySelector('.form__input--elevation'),
    footerDate = document.querySelector('.footer-date')

 /***********************
  1) Footer Current Year
 ***********************/
let year = new Date();
footerDate.textContent = year.getFullYear();





