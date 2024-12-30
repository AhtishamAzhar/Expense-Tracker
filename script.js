document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const menuItems = document.querySelectorAll('.menu-item');
    const transactionForm = document.getElementById('transaction-form');
    const transactionList = document.getElementById('transaction-list');
    const totalBalance = document.getElementById('total-balance');
    const totalIncome = document.getElementById('total-income');
    const totalExpense = document.getElementById('total-expense');
    const expenseChart = document.getElementById('expenseChart').getContext('2d');
    const downloadButton = document.getElementById('download-pdf');

    let transactions = [];

    // Chart Initialization
    let chart = new Chart(expenseChart, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#28a745', '#dc3545'],
            }]
        },
        options: {
            plugins: {
                legend: { position: 'top' }
            }
        }
    });

    // Navigation Logic
    menuItems.forEach((menuItem, index) => {
        menuItem.addEventListener('click', () => {
            menuItems.forEach(item => item.classList.remove('active'));
            menuItem.classList.add('active');
            pages.forEach(page => page.classList.remove('active'));
            pages[index].classList.add('active');
        });
    });

    // Update UI
    function updateUI() {
        let income = 0, expense = 0;

        transactions.forEach(transaction => {
            if (transaction.type === 'income') {
                income += transaction.amount;
            } else {
                expense += transaction.amount;
            }
        });

        const balance = income - expense;
        totalBalance.textContent = `$${balance.toFixed(2)}`;
        totalIncome.textContent = `$${income.toFixed(2)}`;
        totalExpense.textContent = `$${expense.toFixed(2)}`;

        chart.data.datasets[0].data = [income, expense];
        chart.update();

        renderTransactions();
    }

    // Render transactions
    function renderTransactions() {
        transactionList.innerHTML = '';
        transactions.forEach((transaction, index) => {
            const li = document.createElement('li');
            li.classList.add(transaction.type);
            li.innerHTML = `${transaction.date} - ${transaction.description} <span>$${transaction.amount.toFixed(2)}</span>`;
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', () => deleteTransaction(index));
            li.appendChild(deleteBtn);
            transactionList.appendChild(li);
        });
    }

    // Add transaction
    function addTransaction(event) {
        event.preventDefault();
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('type').value;
        const date = new Date().toLocaleString();

        if (!description || isNaN(amount) || amount <= 0) {
            alert('Please enter valid data.');
            return;
        }

        transactions.push({ description, amount, type, date });
        transactionForm.reset();
        updateUI();
    }

    // Delete transaction
    function deleteTransaction(index) {
        transactions.splice(index, 1);
        updateUI();
    }

    // Download transactions as PDF
    function downloadTransactions() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Transaction Records', 10, 10);

        let yPosition = 20;
        transactions.forEach(transaction => {
            doc.setFontSize(12);
            doc.text(
                `${transaction.date} - ${transaction.description} - $${transaction.amount.toFixed(2)} (${transaction.type})`,
                10,
                yPosition
            );
            yPosition += 10;
        });

        doc.save('transactions.pdf');
    }

    // Event Listeners
    transactionForm.addEventListener('submit', addTransaction);
    downloadButton.addEventListener('click', downloadTransactions);

    // Initial call
    updateUI();
});
