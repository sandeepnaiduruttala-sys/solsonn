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
            messageDiv.textContent = data.message + ' - Please login to continue';
            document.getElementById('registerForm').reset();
            
            // Redirect to login tab after 2 seconds
            setTimeout(() => {
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                const loginBtn = document.querySelector('[data-tab="login"]');
                if (loginBtn) {
                    loginBtn.classList.add('active');
                    document.getElementById('login').classList.add('active');
                }
            }, 2000);
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
            messageDiv.innerHTML = `
                <strong>${data.message}</strong><br>
                <strong style="color: #28a745;">Public Key:</strong> ${data.wallet.publicKey}<br>
                <strong style="color: #28a745;">Seed Phrase:</strong> ${data.wallet.seedPhrase}
            `;
            document.getElementById('walletForm').reset();
            
            // Store wallet password for later use
            localStorage.setItem('walletPassword', password);
            
            // Load wallet details after a short delay
            setTimeout(() => {
                loadWalletDetails(walletname);
            }, 1000);
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = data.message || 'Wallet creation failed';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error: ' + error.message;
    }
});

// Load and display wallet details
async function loadWalletDetails(walletName) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/v1/wallets/wallet-details', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            const walletInfo = data.wallet;
            document.getElementById('detailWalletName').textContent = walletInfo.walletName;
            document.getElementById('detailPublicKey').textContent = walletInfo.publicKey;
            
            // Switch to wallet details tab
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            const detailsBtn = document.querySelector('[data-tab="wallet-details"]');
            if (detailsBtn) {
                detailsBtn.classList.add('active');
                document.getElementById('wallet-details').classList.add('active');
            }
            
            // Load balance
            refreshWalletBalance();
        }
    } catch (error) {
        console.error('Error loading wallet details:', error);
    }
}

// Refresh wallet balance
async function refreshWalletBalance() {
    const token = localStorage.getItem('token');
    const network = document.getElementById('networkSelect') ? document.getElementById('networkSelect').value : 'mainnet-beta';
    
    try {
        const response = await fetch(`/api/v1/wallets/wallet-balance?network=${network}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('balanceValue').textContent = data.balance.toFixed(4);
            const networkInfo = document.getElementById('networkInfo');
            if (networkInfo) {
                networkInfo.textContent = `(${data.network === 'devnet' ? 'Devnet' : 'Mainnet'})`;
            }
        } else {
            document.getElementById('balanceValue').textContent = 'Error loading balance';
            console.error('Balance error:', data);
        }
    } catch (error) {
        document.getElementById('balanceValue').textContent = 'Error';
        console.error('Error refreshing balance:', error);
    }
}

// Show private key password modal
let currentViewMode = 'privatekey';

function showPrivateKeyPW() {
    currentViewMode = 'privatekey';
    document.getElementById('modalTitle').textContent = 'Enter Wallet Password to View Private Key';
    document.getElementById('passwordModal').style.display = 'flex';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
}

function showSeedPhrasePW() {
    currentViewMode = 'seedphrase';
    document.getElementById('modalTitle').textContent = 'Enter Wallet Password to View Seed Phrase';
    document.getElementById('passwordModal').style.display = 'flex';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
}

// Decrypt and show private key or seed phrase
async function decryptAndShow() {
    const password = document.getElementById('pwInput').value;
    const token = localStorage.getItem('token');
    
    if (!password) {
        alert('Please enter your wallet password');
        return;
    }
    
    try {
        const response = await fetch('/api/v1/wallets/view-privatekey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            closePasswordModal();
            
            let displayText, titleText;
            if (currentViewMode === 'privatekey') {
                displayText = data.privateKey;
                titleText = 'Your Private Key (Keep it Safe!)';
            } else {
                displayText = data.seedPhrase;
                titleText = 'Your Seed Phrase (Keep it Safe!)';
            }
            
            document.getElementById('keyModalTitle').textContent = titleText;
            document.getElementById('keyTextarea').value = displayText;
            document.getElementById('keyDisplayModal').style.display = 'flex';
        } else {
            alert(data.message || 'Failed to decrypt key');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Close modals
function closePasswordModal() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('pwInput').value = '';
}

function closeKeyModal() {
    document.getElementById('keyDisplayModal').style.display = 'none';
    document.getElementById('keyTextarea').value = '';
}

// Copy to clipboard functions
function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

function copyKeyToClipboard() {
    const text = document.getElementById('keyTextarea').value;
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        alert('Failed to copy: ' + err);
    });
}

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    const passwordModal = document.getElementById('passwordModal');
    const keyModal = document.getElementById('keyDisplayModal');
    
    if (event.target === passwordModal) {
        closePasswordModal();
    }
    if (event.target === keyModal) {
        closeKeyModal();
    }
});
