

const handleSubmitEvent = async (event) => {
    event.preventDefault();
    try {
        const name = event.target.username.value;
        const email = event.target.email.value;
        const password = event.target.password.value;
    
        const userDetails = { name, email, password};
        // console.log(userDetails);
    
        const addUser = await axios.post('/users/addUser', userDetails);
        alert('Success!');

    }
    catch (err) {
        console.log(err);
        alert('Error');
    }

    // if (addUser.Error != undefined) {
    //     alert(addUser.Error.name);
    //     return;
    // }
    // alert('Success!');
    
};

const login = () => {
    window.location.href = '/users/login';
};