document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    if (!firstName || !lastName || !email || !password) {
        document.getElementById('errorMessage').style.display = 'block'; 
        return;
    }

    const user = {
        name: `${firstName} ${lastName}`, 
        email: email,
        password: password
    };

    const apiUrl = 'https://v2.api.noroff.dev/auth/register'; 
    const bearerToken = '3fa85f64-5717-4562-b3fc-2c963f66afa6'; 
    const apiKey = 'YOUR_API_KEY';  

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearerToken}`,
        'X-Noroff-Api-Key': apiKey
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            console.log('User registered successfully:', data);
        } else {
            console.log('Registration failed:', data);
            document.getElementById('errorMessage').textContent = 'Registration failed: ' + data.message;
            document.getElementById('errorMessage').style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again later.';
        document.getElementById('errorMessage').style.display = 'block';
    });
});
