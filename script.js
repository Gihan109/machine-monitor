    let temperature = 68;
    let motorSpeed = 0;
    let production = 0;
    let machineRunning = false; 
    let machineCounter = 0;
    let targetMotorSpeed = 0;
    let temperatureAlarm = "NORMAL";
    let ambientTemperature = 25;


    console.log(temperature);
    console.log(motorSpeed);
    console.log(production);

    const statusElement = document.getElementById("machine-status");
    const startButton = document.getElementById("start-button");
    const stopButton = document.getElementById("stop-button");
    const temperatureElement = document.getElementById("temperature-value");
    const productionOutput = document.getElementById("production-value");
    const counterElement = document.getElementById("machine-counter");
    const motorSpeedElement = document.getElementById("motor-speed");
    const temperatureAlarmElement = document.getElementById("temperature-alarm");
    const targetSpeedInput = document.getElementById("target-speed"); 
    const settingsErrorElement = document.getElementById("settings-error");
    const warningTemperatureInput = document.getElementById("warning-temperature");
    const highTemperatureInput = document.getElementById("high-temperature"); 
    const criticalTemperatureInput = document.getElementById("critical-temperature");

    function startMachine() {
        let speed = getTargetMotorSpeed();
        if (speed === null) {
            settingsErrorElement.textContent = "Please enter a motor speed between 500 and 1500 RPM.";
            return;
        }
        if(!validateTemperatureLimits()) {
            settingsErrorElement.textContent = "Temperature limits must be Warning < High < Critical.";
            return;
        }
        settingsErrorElement.textContent = "";
        machineRunning = true;
        targetMotorSpeed = speed;
        statusElement.textContent = "RUNNING";
        statusElement.classList.add("status-running");
        statusElement.classList.remove("status-stopped");
        updateButtons();
    };
    function stopMachine() {
        machineRunning = false;
        targetMotorSpeed = 0;
        statusElement.textContent = "STOPPED";
        statusElement.classList.remove("status-running");
        statusElement.classList.add("status-stopped");
        production = 0;
        showProduction(production);
        updateButtons();
    }
    function getTargetMotorSpeed() {
        let value = Number(targetSpeedInput.value);
        if (value < 500 || value > 2000 || isNaN(value)) {
            targetSpeedInput.classList.add("input-invalid");
            return null;
        }
            targetSpeedInput.classList.remove("input-invalid");
            return value;
        }
     function updateButtons() {
            startButton.disabled = machineRunning;
            stopButton.disabled = !machineRunning;
        }
    function showTemperature(value) {
        // console.log("temperature " + value + " °C");
        temperatureElement.textContent = value.toFixed(1) + " °C";
    }
    function showProduction(value) {
        productionOutput.textContent = value + " pcs";
    }
    function showCounter(value) {
        counterElement.textContent = value + " pcs";
    }
    function showMotorSpeed(value) {
        motorSpeedElement.textContent = value + " RPM";
    }
    function showTemperatureAlarm() {
        if (temperatureAlarm === "CRITICAL") {
            temperatureAlarmElement.textContent = "CRITICAL TEMPERATURE";
            temperatureAlarmElement.classList.remove("alarm-normal", "alarm-high", "alarm-warning");
            temperatureAlarmElement.classList.add("alarm-critical");
        }
        else if (temperatureAlarm === "HIGH") {
            temperatureAlarmElement.textContent = "HIGH TEMPERATURE";
            temperatureAlarmElement.classList.remove("alarm-normal", "alarm-critical", "alarm-warning");
            temperatureAlarmElement.classList.add("alarm-high");
        }
        else if (temperatureAlarm === "WARNING") {
            temperatureAlarmElement.textContent = "WARNING TEMPERATURE";
            temperatureAlarmElement.classList.remove("alarm-normal", "alarm-critical", "alarm-high");
            temperatureAlarmElement.classList.add("alarm-warning");
        }
        else {
            temperatureAlarmElement.textContent = "SYSTEM NORMAL";
            temperatureAlarmElement.classList.remove("alarm-critical", "alarm-high", "alarm-warning");
            temperatureAlarmElement.classList.add("alarm-normal");
        }
    }
    function updateMachine() {
        let temperatureIncrease = 0;
        if (machineRunning) {
            if (motorSpeed >= 1000) {
            production++;
            machineCounter++;
              }
            if (motorSpeed < 500) {
            temperatureIncrease = 0.1;
            }
            else if (motorSpeed < 1000) {
            temperatureIncrease = 0.3;
            }
            else if (motorSpeed < 1500) {
            temperatureIncrease = 0.5;
            }
            else {
            temperatureIncrease = 0.7;
            }
            temperature+= temperatureIncrease;
         }
        else {
            temperature -= 0.2; 
        if (temperature < ambientTemperature) {
            temperature = ambientTemperature;
        }
        }
        let warningTemperature = Number(warningTemperatureInput.value);
        let highTemperature = Number(highTemperatureInput.value);
        let criticalTemperature = Number(criticalTemperatureInput.value);
        if (temperature >= criticalTemperature) {
            temperatureAlarm = "CRITICAL";
        }
        else if (temperature >= highTemperature) {
            temperatureAlarm = "HIGH";
        }
        else if (temperature >= warningTemperature) {
            temperatureAlarm = "WARNING";
        }
        else {
            temperatureAlarm = "NORMAL";
        }
    }
    function validateTemperatureLimits() {
        let warning = Number(warningTemperatureInput.value);
        let high = Number(highTemperatureInput.value);
        let critical = Number(criticalTemperatureInput.value);
        if (warning >= high || high >= critical) {
            warningTemperatureInput.classList.add("input-invalid");
            highTemperatureInput.classList.add("input-invalid"); 
            criticalTemperatureInput.classList.add("input-invalid");
            return false;
        }
        warningTemperatureInput.classList.remove("input-invalid");
        highTemperatureInput.classList.remove("input-invalid");
        criticalTemperatureInput.classList.remove("input-invalid");
        return true;
    }
    function updateDisplay() {
        showTemperature(temperature);
        showProduction(production);
        showCounter(machineCounter);
        showMotorSpeed(motorSpeed);
        showTemperatureAlarm();
    }
    startButton.addEventListener("click", function() {
        startMachine();
    });
    stopButton.addEventListener("click", function() {
        stopMachine();
    });

    updateButtons();
    setInterval(function() {
        if (motorSpeed > targetMotorSpeed) {
                motorSpeed -= 100;
            }
            else if (motorSpeed < targetMotorSpeed) {
                motorSpeed += 100;
            }
            else {
                console.log("Motor speed is at target speed");
            }
        updateMachine();
        updateDisplay();
    }, 1000);