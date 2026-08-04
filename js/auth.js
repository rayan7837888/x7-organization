// Authentication Functions

// Toggle between login and register forms
function toggleForms() {
    document.getElementById('login-form').classList.toggle('active');
    document.getElementById('register-form').classList.toggle('active');
    clearMessages();
}

// Clear error and success messages
function clearMessages() {
    document.getElementById('login-error').textContent = '';
    document.getElementById('login-success').textContent = '';
    document.getElementById('register-error').textContent = '';
    document.getElementById('register-success').textContent = '';
}

// Register User
function registerUser() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;

    // Validation
    if (!username) {
        showError('register', '⚠️ أدخل اسم المستخدم');
        return;
    }

    if (username.length < 3) {
        showError('register', '⚠️ اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
        return;
    }

    if (!email) {
        showError('register', '⚠️ أدخل البريد الإلكتروني');
        return;
    }

    if (password.length < 6) {
        showError('register', '⚠️ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }

    if (password !== passwordConfirm) {
        showError('register', '⚠️ كلمات المرور غير متطابقة');
        return;
    }

    // Create user with Firebase
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Save user data in database
            database.ref('users/' + user.uid).set({
                username: username,
                email: email,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });

            showSuccess('register', '✅ تم إنشاء الحساب بنجاح! سيتم التوجيه...');
            
            setTimeout(() => {
                localStorage.setItem('x7_user', JSON.stringify({
                    uid: user.uid,
                    username: username,
                    email: email
                }));
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            let errorMessage = '❌ حدث خطأ: ';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage += 'البريد الإلكتروني مستخدم بالفعل';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage += 'البريد الإلكتروني غير صحيح';
            } else if (error.code === 'auth/weak-password') {
                errorMessage += 'كلمة المرور ضعيفة جداً';
            } else {
                errorMessage += error.message;
            }

            showError('register', errorMessage);
        });
}

// Login User
function loginUser() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validation
    if (!email) {
        showError('login', '⚠️ أدخل البريد الإلكتروني');
        return;
    }

    if (!password) {
        showError('login', '⚠️ أدخل كلمة المرور');
        return;
    }

    // Sign in with Firebase
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            // Get user data
            database.ref('users/' + user.uid).once('value', (snapshot) => {
                const userData = snapshot.val();
                
                // Update last login
                database.ref('users/' + user.uid + '/lastLogin').set(
                    new Date().toISOString()
                );

                // Save user data locally
                localStorage.setItem('x7_user', JSON.stringify({
                    uid: user.uid,
                    username: userData.username,
                    email: user.email
                }));

                showSuccess('login', '✅ تم تسجيل الدخول بنجاح!');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            });
        })
        .catch((error) => {
            let errorMessage = '❌ خطأ: ';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage += 'المستخدم غير موجود';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage += 'كلمة المرور غير صحيحة';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage += 'البريد الإلكتروني غير صحيح';
            } else {
                errorMessage += error.message;
            }

            showError('login', errorMessage);
        });
}

// Show error message
function showError(formType, message) {
    const errorElement = document.getElementById(formType + '-error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Show success message
function showSuccess(formType, message) {
    const successElement = document.getElementById(formType + '-success');
    successElement.textContent = message;
    successElement.style.display = 'block';
}

// Check if user is already logged in
function checkAuthStatus() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in, redirect to home
            const userData = localStorage.getItem('x7_user');
            if (userData) {
                window.location.href = 'index.html';
            }
        }
    });
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});
