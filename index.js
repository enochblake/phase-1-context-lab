// Functions
function createEmployeeRecord(data) {
    return {
      firstName: data[0],
      familyName: data[1],
      title: data[2],
      payPerHour: data[3],
      timeInEvents: [],
      timeOutEvents: []
    };
  }
  
  function createEmployeeRecords(arrayOfArrays) {
    return arrayOfArrays.map(createEmployeeRecord);
  }
  
  function createTimeInEvent(dateString) {
    const [date, hour] = dateString.split(" ");
    this.timeInEvents.push({ type: "TimeIn", date, hour: parseInt(hour, 10) });
    return this;
  }
  
  function createTimeOutEvent(dateString) {
    const [date, hour] = dateString.split(" ");
    this.timeOutEvents.push({ type: "TimeOut", date, hour: parseInt(hour, 10) });
    return this;
  }
  
  function hoursWorkedOnDate(date) {
    const timeIn = this.timeInEvents.find(event => event.date === date);
    const timeOut = this.timeOutEvents.find(event => event.date === date);
  
    if (timeIn && timeOut) {
      return (timeOut.hour - timeIn.hour) / 100;
    }
  
    return 0;
  }
  
  function wagesEarnedOnDate(date) {
    return hoursWorkedOnDate.call(this, date) * this.payPerHour;
  }
  
  const allWagesFor = function () {
    const eligibleDates = this.timeInEvents.map(function (e) {
      return e.date;
    });
  
    const payable = eligibleDates.reduce(function (memo, d) {
      return memo + wagesEarnedOnDate.call(this, d);
    }.bind(this), 0);
  
    return payable;
  };
  
  function calculatePayroll(employeeRecords) {
    return employeeRecords.reduce((totalPayroll, employee) => totalPayroll + allWagesFor.call(employee), 0);
  }
  
  function findEmployeeByFirstName(collection, firstName) {
    return collection.find(employee => employee.firstName === firstName);
  }
  
  const chai = require('chai');
  const spies = require('chai-spies');
  chai.use(spies);
  
  const expect = chai.expect;

  const csvDataEmployees = [
    ["Thor", "Odinsson", "Electrical Engineer", 45],
    ["Loki", "Laufeysson-Odinsson", "HR Representative", 35],
  ];
  
  const csvTimesIn = [
    ["Thor", ["2018-01-01 0800", "2018-01-02 0800", "2018-01-03 0800"]],
  ];
  
  const csvTimesOut = [
    ["Thor", ["2018-01-01 1600", "2018-01-02 1800", "2018-01-03 1800"]],
  ];
  
  const employeeRecords = createEmployeeRecords(csvDataEmployees);
  
  employeeRecords.forEach((employee, index) => {
    const timesIn = csvTimesIn[index][1];
    const timesOut = csvTimesOut[index][1];
  
    timesIn.forEach(timeIn => createTimeInEvent.call(employee, timeIn));
    timesOut.forEach(timeOut => createTimeOutEvent.call(employee, timeOut));
  });
  
  const totalPayroll = calculatePayroll(employeeRecords);
  
  console.log("Total Payroll:", totalPayroll);
  