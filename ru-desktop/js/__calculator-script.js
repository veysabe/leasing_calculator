let carPriceMin = 499;
let carPriceMax = 12000;
let contractTermMin = 2;
let contractTermMax = 60;
let firstPaymentMin = 0;
let firstPaymentMax = 5000;

$("#carPriceSlider").slider({
    range: "min",
    min: carPriceMin,
    max: carPriceMax,
    value: 499,
    slide: function( event, ui ) {
        $("#carPriceAmount").val(ui.value);
    }
});
    
$("#carPriceAmount").val($("#carPriceSlider").slider("value"));

$("#carPriceAmount").on('change', function(){
    $("#carPriceSlider").slider("value", this.value)
});

$("#contractTermSlider").slider({
    range: "min",
    min: contractTermMin,
    max: contractTermMax,
    value: 20,
    slide: function( event, ui ) {
        $("#contractTerm").val(ui.value);
    }
    });
    
$("#contractTerm").val($("#contractTermSlider").slider("value"));

$("#contractTerm").on('change', function(){
    $("#contractTermSlider").slider("value", this.value)
});

$("#firstPaymentSlider").slider({
    range: "min",
    min: firstPaymentMin,
    max: firstPaymentMax,
    value: 20,
    slide: function( event, ui ) {
        $("#firstPaymentAmount").val(ui.value);
    }
    });
    
$("#firstPaymentAmount").val($("#firstPaymentSlider").slider("value"));

$("#firstPaymentAmount").on('change', function(){
    $("#firstPaymentSlider").slider("value", this.value)
});

function stm_get_price_view(price, currency, currencyPos, priceDel) {
    let stmText = '';
    if (currencyPos == 'left') {
        stmText += currency;
        stmText += price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, priceDel);
    } else {
        stmText += price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, priceDel);
        stmText += currency;
    }
    return stmText;
}

function PMT(i, n, p) {
	return i * p * Math.pow((1 + i), n) / (1 - Math.pow((1 + i), n));
}

function calcMonthly(Amount, procent, months)
{
	var i = procent / 1200;
	var p = Amount;
	return PMT(i, months, -p);
}

$("#calculatorCalculateButton").on('click', function(){
    let current_calculator = $('.calculator-block');
    // identify calc

    let vehicle_price = parseFloat(current_calculator.find("#carPriceAmount").val());

    let down_payment = parseFloat(current_calculator.find("#firstPaymentAmount").val());

    let period_month = parseFloat(current_calculator.find('#contractTerm').val());

    let amount = (vehicle_price / 100 * (100-(down_payment / vehicle_price * 100))).toFixed(0);

    let first_rate = down_payment;
    // comission
    let comission = (parseInt(amount) / 1000 * 3).toFixed(0);

    let interest_rate;
    if(period_month <= 12)
	{
		interest_rate = 15.50;
	}
	else if(period_month > 12 && period_month <= 24)
	{
		interest_rate = 14.95;
	}
	else if(period_month > 24 && period_month <= 36)
	{
		interest_rate = 14.25;
	}
	else if(period_month > 36 && period_month <= 48)
	{
		interest_rate = 14.25;
	}
	else if(period_month > 48 && period_month <= 60)
	{
		interest_rate = 13.45;
	}
	else if(period_month >= 60 && period_month <= 72)
	{
		interest_rate = 12.95;
    }
    
    if (isNaN(vehicle_price)) {
		current_calculator.find('#carPriceAmount').closest('div').addClass('wrong-input');
		validation_errors = true;
	} else if (isNaN(period_month)) {
		current_calculator.find('#contractTerm').closest('div').addClass('wrong-input');
		validation_errors = true;
	} else if (isNaN(down_payment)) {
		current_calculator.find('#firstPaymentAmount').closest('div').addClass('wrong-input');
		validation_errors = true;
	} else if (down_payment > vehicle_price) {
		current_calculator.find('#firstPaymentAmount').closest('div').addClass('wrong-input');
		validation_errors = true;
	} else {
		validation_errors = false;
	}

    if (!validation_errors) {
        current_calculator.find('.wrong-input').removeClass('wrong-input');
        
        let pmp = calcMonthly(amount, interest_rate, period_month);
        let monthly_payment = Math.round(parseInt(comission) + parseInt(pmp));
    
        let total_amount_to_pay = down_payment + (monthly_payment*period_month);
        total_amount_to_pay = total_amount_to_pay.toFixed(0);
    
        let total_interest_payment = total_amount_to_pay - vehicle_price;
        total_interest_payment = total_interest_payment.toFixed(0);
    
        $("#monthlyPaymentResult").text(monthly_payment);
        $("#percentPayment").text(total_interest_payment);
        $("#allSum").text(total_amount_to_pay);
    }
});