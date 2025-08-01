
const handleSubmitEvent = async (event) => {
    try {
        event.preventDefault();
        // const token = JSON.parse(localStorage.getItem('token'));
        const password1 = event.target.password1.value;
        const password2 = event.target.password2.value;
        if (password1 != password2) {
            alert('Passwords do not match!');
            return;
        }
        const email = localStorage.getItem('email');
        console.log(email);
        const updatePassword = await axios.post('/password/updatePassword', {password: password1, email});
        alert(updatePassword.data.message);
        window.location.href = "/users/login";
    }
    catch (err) {
        console.log(err);
        // alert(err.response.data.message);
    }
};