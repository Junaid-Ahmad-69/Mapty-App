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

/***********************
 2) Geo Location API
 ***********************/
let map, mouseEvent;
if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition(function (position) {
        const {latitude} = position.coords
        const {longitude} = position.coords
        const coords = [latitude, longitude]

        map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        map.on('click', function (mapE) {
            mouseEvent = mapE
            form.classList.remove("hidden");
            inputDistance.focus();
        })
    }, function () {
        alert('Could not get your location!')
    });


// Enter Button to submit the form and show marker
form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Clear the input field after submit
    inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
    const {lat, lng} = mouseEvent.latlng;
    L.marker([lat, lng]).addTo(map).bindPopup(L.popup({
        maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false, className: 'running-popup'
    })).openPopup();
})

/*************************************
 2) Change Cadence According to Type
 ************************************/

inputType.addEventListener("change", function () {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden")
});



