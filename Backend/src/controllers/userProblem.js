const createProblem = async (req, res) => {
    const { title, description, difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolutions } = req.body;
    try{
 
    }catch(error){
        res.status(500).json({ message: 'Error creating problem', error: error.message });
    }
}