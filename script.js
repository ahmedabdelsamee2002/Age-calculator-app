$(() => {
	const $labelDay = $("[for='dia']");
	const $labelMes = $("[for='mes']");
	const $labelYear = $("[for='ano']");
	const $inptDay = $("#dia");
	const $inptMonth = $("#mes");
	const $inptYear = $("#ano");
	const $inptBtn = $(".form-button");
	const exibirYrs = $(".result-text__data").eq(0);
	const exibirMth = $(".result-text__data").eq(1);
	const exibirDay = $(".result-text__data").eq(2);
	const $formMsgErrorDia = $(".form-error-dia");
	const $formMsgErrorMes = $(".form-error-mes");
	const $formMsgErrorAno = $(".form-error-ano");
	
	function validateForm() {
		const $initialDate = new Date($inptYear.val(), $inptMonth.val(), $inptDay.val());
		const $currentDate = new Date();
		const diferenca = $currentDate - $initialDate;
		const milissegundosPorDia = 1000 * 60 * 60 * 24;
		const diasPassados = Math.floor(diferenca / milissegundosPorDia);
		const mesesPassados = Math.floor(diasPassados / 30.436875); 
		const anosPassados = Math.floor(mesesPassados / 12);
		
		if (!$inptDay.val()) {
			$formMsgErrorDia.find("i").text("This field is required");
			$formMsgErrorDia.show();
			$inptDay.addClass("form-item__input--error");
			$labelDay.addClass("form-item__label--error");
		} else {
			if ($inptDay.val() > 31 || $inptDay.val() < 1) {
				$formMsgErrorDia.find("i").text("Must be a valid day");
				$formMsgErrorDia.show();
				$inptDay.addClass("form-item__input--error");	
				$labelDay.addClass("form-item__label--error");
			} else {
				if (!($inptDay.val() > 30 && $inptMonth.val() != 2)) {
					$formMsgErrorDia.hide();
					$inptDay.removeClass("form-item__input--error");	
					$labelDay.removeClass("form-item__label--error");
					exibirDay.text(diasPassados);
					exibirDay.addClass("result-text__data--preenchido");
				}
			}
		}
		
		if (!$inptMonth.val()) {
			$formMsgErrorMes.find("i").text("This field is required");
			$formMsgErrorMes.show();
			$inptMonth.addClass("form-item__input--error");	
			$labelMes.addClass("form-item__label--error");
		} else {
			if ($inptMonth.val() > 12 || $inptMonth.val() < 1) {
				$formMsgErrorMes.find("i").text("Must be a valid day");
				$formMsgErrorMes.show();
				$inptMonth.addClass("form-item__input--error");	
				$labelMes.addClass("form-item__label--error");
			} else {
				if (!($inptDay.val() > 30 && $inptMonth.val() != 2)) {
					$formMsgErrorMes.hide();
					$inptMonth.removeClass("form-item__input--error");	
					$labelMes.removeClass("form-item__label--error");
					exibirMth.text(mesesPassados);
					exibirMth.addClass("result-text__data--preenchido");
				}
			}
		}
		
		if (!$inptYear.val()) {
			$formMsgErrorAno.find("i").text("This field is required");
			$formMsgErrorAno.show();
			$inptYear.addClass("form-item__input--error");	
			$labelYear.addClass("form-item__label--error");
		} else {
			if ($inptYear.val() > $currentDate.getFullYear() || $inptYear.val() < 1) {
				$formMsgErrorAno.find("i").text("Must be in the past");
				$formMsgErrorAno.show();
				$inptYear.addClass("form-item__input--error");	
				$labelYear.addClass("form-item__label--error");
			} else {
				$formMsgErrorAno.hide();
				$inptYear.removeClass("form-item__input--error");	
				$labelYear.removeClass("form-item__label--error");
				exibirYrs.text(anosPassados);
				exibirYrs.addClass("result-text__data--preenchido");
			}
		}
		
		if ($inptDay.val() > 30 && $inptMonth.val() === 2) {
			$formMsgErrorDia.find("i").text("Must be a valid date");
			$formMsgErrorDia.show();
			$inptDay.addClass("form-item__input--error");	
			$labelDay.addClass("form-item__label--error");
			$inptMonth.addClass("form-item__input--error");	
			$labelMes.addClass("form-item__label--error");
			$inptYear.addClass("form-item__input--error");	
			$labelYear.addClass("form-item__label--error");
		}
	}
	
	$inptBtn.on("click", validateForm);
})
