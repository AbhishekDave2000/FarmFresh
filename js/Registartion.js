function toggleSignup(){
    document.getElementById("login-toggle").style.backgroundColor="#fff";
    document.getElementById("login-toggle").style.color="#222";
    document.getElementById("signup-toggle").style.backgroundColor="#57b846";
    document.getElementById("signup-toggle").style.color="#fff";
    document.getElementById("edit-toggle").style.backgroundColor = "#fff";
    document.getElementById("edit-toggle").style.color = "#222";
    // Hide the login form
    document.getElementById("login-form").style.display="none";
     // Show the signup form
    document.getElementById("signup-form").style.display="block";
     // Hide the edit form
    document.getElementById("edit-form").style.display = "none";
}

function toggleLogin(){
    document.getElementById("login-toggle").style.backgroundColor="#57B846";
    document.getElementById("login-toggle").style.color="#fff";
    document.getElementById("signup-toggle").style.backgroundColor="#fff";
    document.getElementById("signup-toggle").style.color="#222";
    document.getElementById("edit-toggle").style.backgroundColor = "#fff";
    document.getElementById("edit-toggle").style.color = "#222";
    // Hide the signup form
    document.getElementById("signup-form").style.display="none";
     // Show the signup form
    document.getElementById("login-form").style.display="block";
     // Hide the edit form
    document.getElementById("edit-form").style.display = "none";
}

function toggleEdit(){
    document.getElementById("login-toggle").style.backgroundColor="#fff";
    document.getElementById("login-toggle").style.color="#222";
    document.getElementById("signup-toggle").style.backgroundColor="#fff";
    document.getElementById("signup-toggle").style.color="#222";
    document.getElementById("edit-toggle").style.backgroundColor="#57b846";
    document.getElementById("edit-toggle").style.color="#fff";
    // Hide the login and signup forms
    document.getElementById("login-form").style.display="none";
    document.getElementById("signup-form").style.display="none";
    // Show the edit form
    document.getElementById("edit-form").style.display="block";
}


$(document).ready(function() {
    // Initialize an empty array to store default users
    let defaultUsers = [];
    const baseUrl = window.location.origin + window.location.pathname;
    let newUrl = new URL('../js/user.json', baseUrl).href;
    
    // Fetch default users from user.json
    fetch(newUrl)
    // Parse the JSON from the response
        .then(response => response.json())
        .then(data => {
            // Store the fetched data in the defaultUsers array
            defaultUsers = data;
        })
        .catch(error => console.error('Error fetching default users:', error));

    // Retrieve users from local storage
    var localUsers = JSON.parse(localStorage.getItem('users')) || [];
    
    // Handle the login form submission
    $("#login-form form").on("submit", function(event) {
        // Prevent the form from submitting the default way
        event.preventDefault();
        var isValid = true;
        
         // Get the email or username input value
        var emailOrUsername = $("input[name='emailOrUsername']").val();
        // Get the password input value
        var password = $("input[name='password']").val();

         // Validate email or username length
        if (emailOrUsername.length < 3) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email or username with at least 3 characters.",
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }
        
        // Validate password length
        if (password.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid password with at least 5 characters.",
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }
        if (isValid) {
            // Initialize a variable to store the current user  
            var currentUser = null;
            // Check if user exists in default users
            var userExists = defaultUsers.some(function(user) {
                // Set the current user if found
                if ((user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password) {
                    currentUser = user;
                    // Return true if user exists
                    return true;
                }
                // Return false if user does not exist
                return false;
            });
            if (!userExists) {
                // If not found in default users, check in local storage
                userExists = localUsers.some(function(user) {
                    // Set the current user if found
                    if ((user.email === emailOrUsername || user.username === emailOrUsername) && user.password === password) {
                        currentUser = user;
                        // Return true if user exists
                        return true;
                    }
                    // Return false if user does not exist
                    return false;
                });
            }

            if (userExists) {
                // Save current user to local storage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                // Alert success message
                Swal.fire({
                    title: "Great!",
                    text: "Successfully Logged In!",
                    icon: "success",
                    confirmButtonColor: "#4CAF50"
                }).then((result) => {
                    window.location.href = '../html/index.html';
                });
            } else {
                //Alert error message
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Invalid email/username or password!",
                    confirmButtonColor: "#4CAF50"
                });
            }
        }
    });
    
    // Handle the signup form submission
    $("#signup-form form").on("submit", function(event) {
        // Prevent the form from submitting the default way
        event.preventDefault();
        var isValid = true;
        
        // Get the email input value
        var email = $("input[name='email']").val();
        // Get the username input value
        var username = $("input[name='username']").val();
        // Get the password input value
        var password = $("input[name='password1']").val();
        
        // Regular expression pattern to validate email format
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        
        // Validate email format
        if (!emailPattern.test(email)) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid email address.",
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }
        
        // Validate username length
        if (username.length < 3) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid username with at least 3 characters.",
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }
        
        // Validate password length
        if (password.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please enter a valid password with at least 5 characters.",
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }
        
        if (isValid) {
            // Check if email already exists in default users or local storage
            var emailExists = defaultUsers.some(function(user) {
                return user.email === email;
            }) || localUsers.some(function(user) {
                return user.email === email;
            });

            if (emailExists) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Email already exists. Please use a different email.",
                    confirmButtonColor: "#4CAF50"
                });
                return;
            }

            // Add new user to localUsers array
            var newUser = {

                // Set the values
                email: email, 
                username: username,
                password: password // Note: In a real application, never store passwords in plain text.
            };
            
            // Add the new user to the localUsers array
            localUsers.push(newUser);

            // Save localUsers array to local storage
            localStorage.setItem('users', JSON.stringify(localUsers));
            
            // Alert  message 
            Swal.fire({
                title: "Great!",
                text: "Successfully Registered!",
                icon: "success",
                confirmButtonColor: "#4CAF50"
            });
        }
    });

    // Handle the signup form submission
    $("#edit-form form").on("submit", function(event) {
         // Prevent the form from submitting the default way
        event.preventDefault();
        var isValid = true;

        // Get the email input value
        var email = $("input[name='editEmail']").val();
        // Get the username input value
        var username = $("input[name='editUsername']").val();
        // Get the password input value
        var password = $("input[name='editPassword']").val();

        // Regular expression pattern to validate email format  
        var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        // Validate email format
        if (!emailPattern.test(email)) {
            //sweetalert plug-in
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid email address.',
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }

        // Validate username length
        if (username.length < 3) {
            //sweetalert plug-in
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid username with at least 3 characters.',
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }

        // Validate password length
        if (password.length < 5) {
            //sweetalert plug-in
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please enter a valid password with at least 5 characters.',
                confirmButtonColor: "#4CAF50"
            });
            isValid = false;
        }

        if (isValid) {
            var currentUser = JSON.parse(localStorage.getItem('currentUser'));

            // Check if current user data is found
            if (currentUser) {
                // Find the index of the current user in the local users array
                var userIndex = localUsers.findIndex(function(user) {
                    return user.email === currentUser.email;
                });
                // If the user is found in the local users array
                if (userIndex !== -1) {
                    // Update the user's data in the local users array
                    localUsers[userIndex] = {
                        email: email,
                        username: username,
                        password: password
                    };

                    // Save the updated local users array back to local storage
                    localStorage.setItem('users', JSON.stringify(localUsers));

                    // Save the updated current user's data back to local storage
                    localStorage.setItem('currentUser', JSON.stringify(localUsers[userIndex]));

                    // alert success message 
                    Swal.fire({
                         //sweetalert plug-in
                        icon: 'success',
                        title: 'Success',
                        text: 'Information updated successfully.',
                        confirmButtonColor: "#4CAF50"
                    });
                }
            }
        }
    });
});
