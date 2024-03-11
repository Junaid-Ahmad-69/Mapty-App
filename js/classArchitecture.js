'use strict';


const form = document.querySelector('.form'),
    containerWorkouts = document.querySelector('.workouts'),
    inputType = document.querySelector('.form__input--type'),
    inputDistance = document.querySelector('.form__input--distance'),
    inputDuration = document.querySelector('.form__input--duration'),
    inputCadence = document.querySelector('.form__input--cadence'),
    inputElevation = document.querySelector('.form__input--elevation'),
    footerDate = document.querySelector('.footer-date')


/********************
 1) Class for WorkOut
 ********************/


// Parent Class
class Workout {
    date = new Date();
    id = (Date.now() + ''.slice(-10))

    constructor(coords, distance, duration) {
        this.coords = coords
        this.distance = distance
        this.duration = duration

    }

    _setDescription() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
    }

}

// Child Class
class Running extends Workout {
    type = 'running'

    constructor(coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence
        this.calcPace()
        this._setDescription()

    }

    calcPace() {
        this.pace = this.duration / this.distance
        return this.pace
    }

}

// Child Class
class Cycling extends Workout {
    type = 'cycling'

    constructor(coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain
        this.calcSpeed()
        this._setDescription()

    }

    calcSpeed() {
        this.speed = this.distance / (this.duration / 60)
        return this.speed
    }
}


const workout = new Workout()


/**********************************
 2) Geo Location API Using Classes
 **********************************/
class App {
    #map;
    #mapEvent
    #workouts = [];

    constructor() {
        this._getPosition()
        form.addEventListener("submit", this._newWorkout.bind(this))
        inputType.addEventListener("change", this._toggleElevationField.bind(this));
    }

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your location!')
            })
    }

    _loadMap(position) {
        const {latitude} = position.coords
        const {longitude} = position.coords
        const coords = [latitude, longitude]
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);
        this.#map.on('click', this._showForm.bind(this))
    }

    _showForm(mapE) {
        this.#mapEvent = mapE
        form.classList.remove("hidden");
        inputDistance.focus();
    }
    _hideForm(){
        // Clear the input field after submit
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = "";
        form.style.display = "none";
        form.classList.add("hidden");
        setTimeout(()=>{
            form.style.display = "grid";

        }, 1000)

    }

    _toggleElevationField() {
        inputCadence.closest(".form__row").classList.toggle("form__row--hidden")
        inputElevation.closest(".form__row").classList.toggle("form__row--hidden")

    }

    _newWorkout(e) {
        const validInputs = (...inputs) => inputs.every(inp => Number.isInteger(inp))
        const allPositive = (...inputs) => inputs.every(inp => inp > 0)

        e.preventDefault();

        // Get data from Form

        const type = inputType.value
        const distance = +inputDistance.value
        const duration = +inputDuration.value
        const {lat, lng} = this.#mapEvent.latlng;
        let workout;
        if (type === "running") {
            const cadence = +inputCadence.value
            // Check data is valid

            // If workout is running create running object
            if (!validInputs(distance, duration, cadence) || !allPositive(duration, cadence, duration)) return alert("Inputs have to be a position numbers! ")
            workout = new Running([lat, lng], duration, distance, cadence)
        }

        // If workout is cycling create cycling object
        if (type === "cycling") {
            const elevation = +inputElevation.value
            if (!validInputs(distance, duration, elevation) || !allPositive(duration, elevation, duration)) return alert("Inputs have to be a position numbers! ")
            workout = new Cycling([lat, lng], duration, distance, elevation)

        }

        // Add new object to workout filed
        this.#workouts.push(workout)

        //Render workout on map as marker
        this._renderWorkoutMarker(workout)

        //Render workout on map
        this._renderWorkout(workout)

        // Hide Form
        this._hideForm()


    }

    _renderWorkoutMarker(workout) {
        L.marker(workout.coords).addTo(this.#map).bindPopup(L.popup({
            maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false, className: `${workout.type}-popup`
        })).setPopupContent(`${workout.type === 'running' ? '🏃' : '🚴'} ${workout.description}`).openPopup();
    }

    _renderWorkout(workout) {
        let html = `
        <li class="workout workout--${workout.type}" data-id="${workout.id}">
            <h2 class="workout__title">${workout.description}</h2>
            <div class="workout__details">
                <span class="workout__icon">${workout.type === 'running' ? '🏃' : '🚴'}</span>
                <span class="workout__value">${workout.distance}</span>
                <span class="workout__unit">km</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⏱</span>
                <span class="workout__value">${workout.duration}</span>
                <span class="workout__unit">min</span>
            </div>
        `;
        if (workout.type === "running")
            html += `
            <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
        </div>
        `;
        if (workout.type === 'cycling')
            html += `
             <div class="workout__details">
                <span class="workout__icon">⚡️</span>
                <span class="workout__value">${workout.speed.toFixed(1)}</span>
                <span class="workout__unit">km/h</span>
            </div>
            <div class="workout__details">
                <span class="workout__icon">⛰</span>
                <span class="workout__value">${workout.elevationGain}</span>
                <span class="workout__unit">m</span>
            </div>
        </li>
            
            `;

        form.insertAdjacentHTML('afterend', html)
    }

}

const app = new App()


