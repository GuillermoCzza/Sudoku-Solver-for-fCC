const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

let val;
let sol;
let check;


suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', function () {
    val = solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
    assert.isBoolean(val);
    assert.equal(val, true);
  });
  
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
    val = solver.validate('h.5..2.84..63.12.7.2..5.fe..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
    assert.isObject(val);
    assert.property(val, 'error');
    assert.equal(val.error, 'Invalid characters in puzzle');
  });
  
  test('Logic handles a puzzle string that is not 81 characters in length', function () {
    val = solver.validate('..16....926914.37.');
    assert.isObject(val);
    assert.property(val, 'error');
    assert.equal(val.error, 'Expected puzzle to be 81 characters long');
  });
  
  test('Logic handles a valid row placement', function () {
    check = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',"A", 2, 3);
    assert.isBoolean(check);
    assert.equal(check, true);
  });
  
  test('Logic handles an invalid row placement', function () {
    check = solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',"A", 2, 8);
    assert.isBoolean(check);
    assert.equal(check, false);
  });
  
  test('Logic handles a valid column placement', function () {
    check = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',"A", 2, 3);
    assert.isBoolean(check);
    assert.equal(check, true);
  });
  
  test('Logic handles an invalid column placement', function () {
    check = solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',"A", 2, 9);
    assert.isBoolean(check);
    assert.equal(check, false);
  });
  
  test('Logic handles a valid region (3x3 grid) placement', function () {
    check = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',"A", 2, 3);
    assert.isBoolean(check);
    assert.equal(check, true);
  });
  
  test('Logic handles an invalid region (3x3 grid) placement', function () {
    check = solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',"B", 2, 5);
    assert.isBoolean(check);
    assert.equal(check, false);
  });
  
  test('Valid puzzle strings pass the solver', function () {
    sol = solver.solve('135762984946381257728459613694517832812936745357824196473298561581673429269145378');
    assert.isString(sol);

    sol = solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3');
    assert.isString(sol);

    sol = solver.solve('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1');
    assert.isString(sol);
  });
  
  test('Invalid puzzle strings fail the solver', function () {
    sol = solver.solve('1.1..1.11..11.11.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
    assert.isNull(sol);

    sol = solver.solve('151791311175171187524351234595515555822236742327128597477748321151668549269143373');
    assert.isNull(sol);
  });

  test('Solver returns the expected solution for an incomplete puzzle', function () {
    sol = solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.');
    assert.isString(sol);
    assert.equal(sol, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
  });

  //Reloads the page after it crashes when finishing the tests
  //This is necessary because Replit is bugged
  const server = require('../server');
  after(function() {
  chai.request(server)
    .get('/')
  });

  
});
