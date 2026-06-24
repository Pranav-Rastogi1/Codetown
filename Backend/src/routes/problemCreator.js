const express = require('express');
const problemRouter = express.Router();
const adminMiddleware = require('../middlewares/adminMiddleware');

// create a new problem
problemRouter.post('/create',adminMiddleware, createProblem);
// fetch problem details 
problemRouter.get('/:id', getProblemById);
problemRouter.get('/', getAllProblems);
// update an existing problem
problemRouter.patch('/update/:id', updateProblem);
// delete a problem
problemRouter.delete('/delete/:id', deleteProblem);
// all problem solved by a user
problemRouter.get('/solved/user/:userId', solvedAllProblembyUser);
