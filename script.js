// Aplikasi Catatan Keuangan
class FinanceApp {
    constructor() {
        this.transactions = this.loadTransactions();
        this.init();
    }

    // Load data dari localStorage
    loadTransactions() {
        const saved = localStorage.getItem('financeData');
        return saved ? JSON.parse(saved) : [];
    }

    // Save data ke localStorage
    saveTransactions() {
        localStorage.setItem('financeData', JSON.stringify(this.transactions));
    }

    // Initialize aplikasi
    init() {
        this.setupEventListeners();
        this.renderTransactions();
        this.updateBalance();
    }

    // Setup event listeners
    setupEventListeners() {
        const form = document.getElementById('transactionForm');
        form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();
        
        const desc = document.getElementById('desc').value.trim();
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.querySelector('input[name="type"]:checked').value;

        if (!desc || !amount) {
            alert('Harap isi semua field!');
            return;
        }

        if (amount <= 0) {
            alert('Jumlah harus lebih dari 0!');
            return;
        }

        this.addTransaction(desc, amount, type);
        this.resetForm();
    }

    // Tambah transaksi baru
    addTransaction(description, amount, type) {
        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            date: new Date().toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        };

        this.transactions.push(transaction);
        this.saveTransactions();
        this.renderTransactions();
        this.updateBalance();

        // Show success feedback
        this.showSuccessMessage();
    }

    // Hapus transaksi
    deleteTransaction(id) {
        if (confirm('Yakin hapus transaksi ini?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveTransactions();
            this.renderTransactions();
            this.updateBalance();
        }
    }

    // Reset form
    resetForm() {
        document.getElementById('transactionForm').reset();
        document.querySelector('input[value="income"]').checked = true;
    }

    // Show success message
    showSuccessMessage() {
        const button = document.querySelector('#transactionForm button');
        const originalText = button.textContent;
        
        button.textContent = '✅ Berhasil Ditambah!';
        button.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    }

    // Update balance display
    updateBalance() {
        const balance = this.transactions.reduce((total, transaction) => {
            return transaction.type === 'income' 
                ? total + transaction.amount 
                : total - transaction.amount;
        }, 0);

        const balanceElement = document.getElementById('balanceTotal');
        balanceElement.textContent = this.formatCurrency(balance);
        
        // Change color based on balance
        balanceElement.style.color = balance >= 0 ? '#27ae60' : '#e74c3c';
    }

    // Render transactions list
    renderTransactions() {
        const container = document.getElementById('transactionHistory');
        
        if (this.transactions.length === 0) {
            container.innerHTML = '<p class="empty-message">Belum ada transaksi</p>';
            return;
        }

        // Sort by latest first
        const sortedTransactions = [...this.transactions].sort((a, b) => b.id - a.id);
        
        container.innerHTML = sortedTransactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-info">
                    <div class="transaction-desc">${transaction.description}</div>
                    <div class="transaction-date">${transaction.date}</div>
                </div>
                <div class="transaction-amount ${transaction.type}-amount">
                    ${transaction.type === 'income' ? '+' : '-'} ${this.formatCurrency(transaction.amount)}
                </div>
                <button class="delete-btn" onclick="app.deleteTransaction(${transaction.id})">
                    Hapus
                </button>
            </div>
        `).join('');
    }

    // Format currency (Rupiah)
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
}

// Initialize app when page loads
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FinanceApp();
});