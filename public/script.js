// Authentication State Management
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard();
    } else {
        showAuthTabs();
    }
}

function showDashboard() {
    // Hide auth tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'register' || tab === 'login') {
            btn.style.display = 'none';
        } else {
            btn.style.display = 'block';
        }
    });
    
    // Show logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
    }
    
    // Switch to home/balance tab
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    const homeBtn = document.querySelector('[data-tab="home"]');
    if (homeBtn) {
        homeBtn.classList.add('active');
        document.getElementById('home').classList.add('active');
    }
}

function showAuthTabs() {
    // Show auth tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.style.display = 'block';
    });
    
    // Hide logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    document.getElementById('registerForm').reset();
    document.getElementById('loginForm').reset();
    showAuthTabs();
    
    // Switch to register tab
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    const registerBtn = document.querySelector('[data-tab="register"]');
    if (registerBtn) {
        registerBtn.classList.add('active');
        document.getElementById('register').classList.add('active');
    }
}

// Add logout button click handler
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Check auth status on page load
    checkAuthStatus();
});

// Tab switching
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        const tabName = btn.getAttribute('data-tab');
        document.getElementById(tabName).classList.add('active');
    });
});

// Register form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const messageDiv = document.getElementById('registerMessage');
    
    try {
        const response = await fetch('/api/v1/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message;
            
            // Store token and redirect to dashboard
            if (data.token) {
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    showDashboard();
                }, 1500);
            }
            
            document.getElementById('registerForm').reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Registration failed';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
    }
});

// Login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');
    
    try {
        const response = await fetch('/api/v1/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message;
            
            // Store token and redirect to dashboard
            if (data.token) {
                localStorage.setItem('token', data.token);
                setTimeout(() => {
                    showDashboard();
                }, 1500);
            }
            
            document.getElementById('loginForm').reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Login failed';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
    }
});

// Check balance
async function checkBalance() {
    const address = document.getElementById('balanceAddress').value;
    const resultDiv = document.getElementById('balanceResult');
    
    if (!address) {
        resultDiv.className = 'balance-result error';
        resultDiv.textContent = 'Please enter a wallet address';
        return;
    }
    
    try {
        const response = await fetch(`/api/v1/balance/balance/${address}`);
        const data = await response.json();
        
        if (data.success) {
            resultDiv.className = 'balance-result success';
            resultDiv.innerHTML = `
                <div class="balance-info">
                    <strong>Address:</strong> ${data.address}
                </div>
                <div class="balance-info">
                    <strong>Balance:</strong> ${data.sol} SOL
                </div>
                <div class="balance-info">
                    <strong>Lamports:</strong> ${data.lamports}
                </div>
            `;
        } else {
            resultDiv.className = 'balance-result error';
            resultDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
        }
    } catch (error) {
        resultDiv.className = 'balance-result error';
        resultDiv.textContent = 'Error: ' + error.message;
    }
}

// Create wallet form
document.getElementById('walletForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const walletname = document.getElementById('walletName').value;
    const password = document.getElementById('walletPassword').value;
    const messageDiv = document.getElementById('walletMessage');
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/wallets/createwallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ walletname, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            messageDiv.className = 'message success';
            messageDiv.textContent = data.message;
            document.getElementById('walletForm').reset();
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Wallet creation failed';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
    }
});
