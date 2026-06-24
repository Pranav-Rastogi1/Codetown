const validator=require('validator');

const validate = (data) => {
try{
    const mandatoryFields = ['firstName', 'email', 'password'];
    const isallowed = mandatoryFields.every((k)=>Object.keys(data).includes(k));


// const isallowed = mandatoryFields.every((k)=>Object.keys(data).includes(k));
// Checks whether all mandatory fields exist in data.
// Object.keys(data) returns an array of all keys in the data object.
// .every() ensures each required field (k) is included in those keys.
// The result is stored in isallowed (true or false).
// you can also use this code 
// const isallowed = mandatoryFields.every((k) => k in data);


    if(!isallowed){
        throw new Error('Missing mandatory fields');
    }
    if(!validator.isEmail(data.email)){
        throw new Error('Invalid email format');
    }
    if(!validator.isStrongPassword(data.password)){
        throw new Error('Weak password');
    }
}catch(err){
    console.error('Register Error:', err);
    throw err;
}
};

module.exports = validate;
    // const errors = [];
    // if (!data.firstname || !validator.isLength(data.firstname, { min: 2, max: 100 })) {
    //     errors.push({ field: 'firstname', message: 'Firstname must be between 2 and 100 characters long' });
    // }
    // if (!data.email || !validator.isEmail(data.email)) {
    //     errors.push({ field: 'email', message: 'Invalid email address' });
    // }
    // if (!data.password || !validator.isLength(data.password, { min: 6 })) {
    //     errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    // }
    // return {
    //     isValid: errors.length === 0,
    //     errors
    // };

