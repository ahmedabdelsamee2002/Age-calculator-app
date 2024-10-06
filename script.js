let inputs = $("input");
let submit = $(".btn-submit");
let day = $("#day");
let month = $("#month");
let year = $("#year");

let inputsLabels = {
    "day": $(".label-day"),
    "month": $(".label-month"),
    "year": $(".label-year")
}

let errorElements = {
    "day": $(".error-day"),
    "month": $(".error-month"),
    "year": $(".error-year")
}

let validators = {
    "day": validDay,
    "month": validMonth,
    "year": validYear
}

submit.on("click", function(event) {
    event.preventDefault();

    clearErrorMsg();

    let isValid = true;

    inputs.each(function() {
        if ($(this).val() === "") {
            showErrorMsg($(this), "This field is required");
            isValid = false;
        }
    });

    if (isValid) {
        inputs.each(function() {
            let inputId = $(this).attr("id");
            let validationFunction = validators[inputId];
            if (validationFunction && !validationFunction($(this))) {
                isValid = false;
            }
        });
    }

    if (isValid) {
        let bDay = parseInput(day);
        let bMonth = parseInput(month);
        let bYear = parseInput(year);
    
        checkAge(bDay, bMonth, bYear);
    }
});

inputs.on("keydown", function(event) {
    let key = event.key;
    if (key.length === 1 && !key.match(/[0-9]/)) {
        event.preventDefault();
    }
});

inputs.on("input", function() {
    if ($(this).val() !== "") {
        clearSingleErrorMsg($(this));
    }
});

function parseInput(input) {
    return parseInt(input.val(), 10);
}

function daysInFebruary(year) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
}

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

function validDay(input) {
    let day = parseInput(input);

    if (isNaN(day)) {
	showErrorMsg(input, "Must be a valid number");
	return false;
    }
	
    let monthValue = parseInput(month);
    let yearValue = parseInput(year);

    if (day < 1 || day > getMonthDays(monthValue, yearValue)) {
        showErrorMsg(input, "Must be a valid day");
        return false;
    } 
    return true;
}

function validMonth(input) {
    let monthValue = parseInput(input);

    if (isNaN(monthValue)) {
	showErrorMsg(input, "Must be a valid number");
	return false;
    }

    if (monthValue < 1 || monthValue > 12) {
        showErrorMsg(input, "Must be a valid month");
        return false;
    } 
    return true;
}

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

function showErrorMsg(input, message) {
    let inputId = input.attr("id");
    let errorElement = errorElements[inputId];

    inputs.each(function() {
        $(this).addClass("error-input");
        inputsLabels[$(this).attr("id")].addClass("error-label");
    });
    
    errorElement.text(message);
    errorElement.css("display", "inline-block");
}

function clearSingleErrorMsg(input) {
    input.removeClass("error-input");
    let label = inputsLabels[input.attr("id")];
    label.removeClass("error-label");
    let error = errorElements[input.attr("id")];
    error.css("display", "none");
}

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

function updateSpan(selector, value, singular, plural) {
    let span = $(selector);
    let spanText = $(`${selector}-text`);

    animateNumber(span, value);
    spanText.text(value === 1 ? singular : plural);
}

function checkAge(bDay, bMonth, bYear) {
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth() + 1;
    let currentDay = currentDate.getDate();

    let years = currentYear - bYear;

    if (currentMonth < bMonth || (currentMonth === bMonth && currentDay < bDay)) {
        years--;
    }

    let months = currentMonth - bMonth;
    if (currentDay < bDay) {
        months--;
    }
    if (months < 0) {
        months += 12;
    }

    let days = currentDay - bDay;
    if (days < 0) {
        let daysInPreviousMonth = getMonthDays(currentMonth - 1 === 0 ? 12 : currentMonth - 1, currentYear);
        days += daysInPreviousMonth;
    }
	
    updateSpan(".years", years, " year", " years");
    updateSpan(".months", months, " month", " months");
    updateSpan(".days", days, " day", " days");
}
