import {formatDate} from "./formatter";

export function getDaysOfMonth () {
    // set output data for function
    let dateArray = [];
    let timestamp;

    // set date params for loop
    let actualDate = new Date();
    let month = actualDate.getMonth();
    let year = actualDate.getFullYear();

    // gets first day of current month
    let d = new Date(year, month, 1);

    // iterates over dates
    // if weekday push to vector
    while (d.getMonth() === month){
        // if weekday
        if (d.getDay() != 6 && d.getDay() != 0){

            // pushes to array
            dateArray.push( formatDate(d) );
        }
        // gets next date
        d.setDate(d.getDate() + 1);
    }
    return (dateArray);
}

export function getYearMonth(){
    let month = getMonth();
    let year = getYear();

    return year + "-" + month;
}
function getYear(){
    let date = new Date;
    return date.getFullYear();
}

function getMonth(){
    let date = new Date;
    return date.getMonth() + 1;
}