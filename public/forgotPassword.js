
const handleSubmitEvent = async (event) => {
    try {
        event.preventDefault();
        const token = JSON.parse(localStorage.getItem('token'));
        const email = event.target.email.value;
        const sendEmail = await axios.post('/password/sendEmail', {email});
        localStorage.setItem('email', email);
        alert(sendEmail.data.message);
        
    }
    catch (err) {
        alert(err.response.data.message);
    }
    
};