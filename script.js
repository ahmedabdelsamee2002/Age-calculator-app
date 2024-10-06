let inputs = $("input");
let submit = $(".btn-submit");
let day = $("#day");
let month = $("#month");
let year = $("#year");

// Label elements for each input 
let inputsLabels = {
    "day": $(".label-day"),
    "month": $(".label-month"),
    "year": $(".label-year")
}

// Error elements for each input 
let errorElements = {
    "day": $(".error-day"),
    "month": $(".error-month"),
    "year": $(".error-year")
}

// Validation functions for each input
let validators = {
    "day": validDay,
    "month": validMonth,
    "year": validYear
}

submit.on("click", function(event) {
    event.preventDefault();

    // Clears any existing error messages
    clearErrorMsg();

    let isValid = true;

    // If the input field is empty, shows an error message
    inputs.each(function() {
        if ($(this).val() === "") {
            showErrorMsg($(this), "This field is required");
            isValid = false;
        }
    });

    // Selects the validation function based on the input id and runs it
    if (isValid) {
        inputs.each(function() {
            let inputId = $(this).attr("id");
            let validationFunction = validators[inputId];
            if (validationFunction && !validationFunction($(this))) {
                isValid = false;
            }
        });
    }

    // If the validation in previous steps was successful, calculates the user's age
    if (isValid) {
        let bDay = parseInput(day);
        let bMonth = parseInput(month);
        let bYear = parseInput(year);
    
        checkAge(bDay, bMonth, bYear);
    }
});

// Prevents non-digit characters from being entered
inputs.on("keydown", function(event) {
    let key = event.key;
    if (key.length === 1 && !key.match(/[0-9]/)) {
        event.preventDefault();
    }
});

// Clears the error messages and style when user starts typing in the input field
inputs.on("input", function() {
    if ($(this).val() !== "") {
        clearSingleErrorMsg($(this));
    }
});

// Converts the input value into an integer
function parseInput(input) {
    return parseInt(input.val(), 10);
}

// Determines the number of days in February by checking if the given year is a leap year
function daysInFebruary(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
}

// Calculates the number of days in the given month
function getMonthDays(month, year) {
    let numberOfDays = 0;

    if (month === 2) {
        numberOfDays = daysInFebruary(year);
    } else if (month === 4 || month == 6 || month === 9 || month === 11) {
        numberOfDays = 30;
    } else {
        numberOfDays = 31;
    }
     
    return numberOfDays;
}

// Validates if the day number is between 1 and the number of days in the given month
function validDay(input) {
    let day = parseInput(input);
    let monthValue = parseInput(month);
    let yearValue = parseInput(year);

    if (day < 1 || day > getMonthDays(monthValue, yearValue)) {
        showErrorMsg(input, "Must be a valid day");
        return false;
    } 
    return true;
}

// Validates if the month number is between 1 and 12
function validMonth(input) {
    let monthValue = parseInput(input);

    if (monthValue < 1 || monthValue > 12) {
        showErrorMsg(input, "Must be a valid month");
        return false;
    } 
    return true;
}

// Validates if the year is in the past, has exactly 4 digits, and is later than 1900
function validYear(input) {
    let yearValue = parseInput(input);
    let currentYear = new Date().getFullYear();

    if (yearValue > currentYear) {
        showErrorMsg(input, "Must be in the past");
        return false;
    } else if (input.val().length !== 4) {
        showErrorMsg(input, "Must be 4 digits");
        return false;
    } else if (yearValue < 1900) {
        showErrorMsg(input, "Must be after 1900");
        return false;
    }
    return true;
}

// Displays an error message and applies error styles
function showErrorMsg(input, message) {
    let inputId = input.attr("id");
    let errorElement = errorElements[inputId];

	// Applies error styles to all inputs and their associated labels
    inputs.each(function() {
        $(this).addClass("error-input");
        inputsLabels[$(this).attr("id")].addClass("error-label");
    });
    
    // Displays the error message only for the specific input
    errorElement.text(message);
    errorElement.css("display", "inline-block");
}

// Clears the error message and removes error styles from the given input
function clearSingleErrorMsg(input) {
    input.removeClass("error-input");
    let label = inputsLabels[input.attr("id")];
    label.removeClass("error-label");
    let error = errorElements[input.attr("id")];
    error.css("display", "none");
}

// Clears all error messages and removes error styles from each input
function clearErrorMsg() {
    inputs.removeClass("error-input");

    $.each(inputsLabels, function(key, labelElement) {
        labelElement.removeClass("error-label");
    });

    $.each(errorElements, function(key, errorElement) {
        errorElement.text("");
        errorElement.css("display", "none");
    });
}

// Animates age numbers to their final number when the form is submitted
function animateNumber(span, endValue) {
    let currentValue = 0; 
    let increment = 1;
    let interval = setInterval(function() {
        currentValue += increment;
        
        if (currentValue >= endValue) {
            currentValue = endValue;
            clearInterval(interval);
        }
        
        span.text(currentValue);
    }, 40); 
}

// Updates the span's value and updates the word to its singular or plural form accordingly
function updateSpan(selector, value, singular, plural) {
    let span = $(selector);
    let spanText = $(`${selector}-text`);

    animateNumber(span, value);
    spanText.text(value === 1 ? singular : plural);
}

// Calculates the difference in years, months, and days from the given birthdate to the current date and displays them in appropriate spans
function checkAge(bDay, bMonth, bYear) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();

    // Years
    let years = currentYear - bYear;

    if (currentMonth < bMonth || (currentMonth === bMonth && currentDay < bDay)) {
        years--;
    }

    // Months 
    let months = currentMonth - bMonth;
    if (currentDay < bDay) {
        months--;
    }
    if (months < 0) {
        months += 12;
    }

    // Days 
    let days = currentDay - bDay;
    if (days < 0) {
        let daysInPreviousMonth = getMonthDays(currentMonth - 1 === 0 ? 12 : currentMonth - 1, currentYear);
        days += daysInPreviousMonth;
    }

    // Updates the span's value
    updateSpan(".years", years, " year", " years");
    updateSpan(".months", months, " month", " months");
    updateSpan(".days", days, " day", " days");
}
