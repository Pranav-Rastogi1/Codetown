const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    tags: {
        type: String,
        enum: ['Array', 'String', 'LinkedList', 'Tree', 'Graph', 'Dynamic Programming', 'Sorting', 'Searching'],
        required: true
    },
    visibleTestCases: [ {
        input: { type: String, required: true },
        output: { type: String, required: true },
        explanation: { type: String, required: true}
    }],
    hiddenTestCases: [ {
        input: { type: String, required: true },
        output: { type: String, required: true },
    }],
    startCode:[ {
        language: { type: String, required: true },
        initialCode: { type: String, required: true }
    }],

    problemCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referenceSolutions: [{
        language:{
            type: String,
            required: true
        },
        completeCode:{
            type: String,
            required: true
        }
    }]
});

const Problem = mongoose.model('Problem', problemSchema);
module.exports = Problem;