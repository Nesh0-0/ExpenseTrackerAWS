

const handleSubmitEvent = async event => {
    event.preventDefault();
    try {
        const email = event.target.email.value;
        const password = event.target.password.value;

        const userDetails = await axios.post(`/users/login`, {email, password});
        const data = userDetails.data;
        console.log(userDetails.data);
        if (data.success) {
            console.log(data);
            alert('Login successful!');
            localStorage.setItem('token', JSON.stringify(data.token));
            window.location.href = '/expenses';
        }
        else {
            alert(data.message);
        }
    }
    catch (err) {
        alert(err.response.data.message);
        
    }
}