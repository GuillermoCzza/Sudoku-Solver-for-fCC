'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const puzzle = req.body.puzzle;
      const coord = req.body.coordinate;
      const value = req.body.value;

      //handle different possible bad inputs
      if (!puzzle || !coord || !value){
        res.json({ error: 'Required field(s) missing' });
        return;
      }
      
      const validateResult = solver.validate(puzzle);
      if (validateResult !== true){
        res.json(validateResult);
        return;
      }

      if(!/^([A-I][1-9])$/i.test(coord)){
        res.json({ error: 'Invalid coordinate'});
        return;
      }

      if(!/^[1-9]$/.test(value)){
        res.json({ error: 'Invalid value' });
        return;
      }

      //start the checking
      let response = {valid:true, conflict:[]};
      //check for conflicts
      if(!solver.checkRowPlacement(puzzle, coord.charAt(0), coord.charAt(1), value)){
        response.valid = false;
        response.conflict.push("row");
      }
      
      if(!solver.checkColPlacement(puzzle, coord.charAt(0), coord.charAt(1), value)){
        response.valid = false;
        response.conflict.push("column");
      }
      
      if(!solver.checkRegionPlacement(puzzle, coord.charAt(0), coord.charAt(1), value)){
        response.valid = false;
        response.conflict.push("region");
      }

      //delete conflict field if empty
      if(response.conflict.length == 0){
        delete response.conflict;
      }

      res.json(response);
    });

  
  app.route('/api/solve')
    .post((req, res) => {
      const puzzle = req.body.puzzle;

      //handle different possible bad inputs
      if(!puzzle){
        res.json({error: 'Required field missing'});
        return;
      }
      
      const validateResult = solver.validate(puzzle);
      if (validateResult !== true){
        res.json(validateResult);
        return;
      }

      //solve puzzle
      const solution = solver.solve(puzzle);
      if (solution == null){
        res.json({ error: "Puzzle cannot be solved" });
        return;
      }
      res.json({solution: solution});

      
    });
};
