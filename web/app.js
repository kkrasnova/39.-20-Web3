window.addEventListener('load', async () => {
    // Перевіряємо чи є MetaMask
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
        
        try {
            // Запитуємо доступ до акаунтів
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Account:', accounts[0]);
            
            // Ініціалізуємо Web3
            window.web3 = new Web3(window.ethereum);
            
            // Налаштовуємо контракт
            const contractAddress = '0x96Af2f07870B58E157975156aaE940E405b1Aa9a';
            const contractABI = [
                {
                    "inputs": [],
                    "name": "get",
                    "outputs": [{"type": "uint256"}],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [{"type": "uint256"}],
                    "name": "set",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];
            
            window.contract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Оновлюємо інтерфейс
            updateUI();
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        console.log('Please install MetaMask!');
    }
});

async function updateUI() {
    const value = await contract.methods.get().call();
    document.getElementById('value').innerHTML = value;
}

async function setValue() {
    const newValue = document.getElementById('newValue').value;
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    try {
        await contract.methods.set(newValue).send({ from: accounts[0] });
        updateUI();
    } catch (error) {
        console.error('Error:', error);
    }
}