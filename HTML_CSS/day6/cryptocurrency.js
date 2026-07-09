const cryptoList = document.getElementById('cryptoList');
const searchInput = document.getElementById('searchInput');
const loading = document.getElementById('loading');
const cryptoTable = document.getElementById('cryptoTable');
const allTab = document.getElementById('allTab');
const favoritesTab = document.getElementById('favoritesTab');


let allCryptoData = [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTab = 'all';

async function fetchCryptoData() {
    try {
        const response = await fetch('https://api4.binance.com/api/v3/ticker/24hr');
        if (!response.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }


        const data = await response.json();

        
        allCryptoData = data.filter(item =>
            item.symbol.endsWith('USDT') &&
            parseFloat(item.lastPrice) > 0
        );


        filterAndRender();
        loading.classList.add('hidden');
        cryptoTable.classList.remove('hidden');


    } catch (error) {
        console.error(error);
        loading.textContent = '데이터를 불러오는 중 오류가 발생했습니다.';
    }
}



function filterAndRender() {
    const searchTerm = searchInput.value.trim().toUpperCase();
    let filteredData = allCryptoData;
    if (searchTerm) {
        filteredData = filteredData.filter(item =>
            item.symbol.includes(searchTerm)
        );
    }
    if (currentTab === 'favorites') {
        filteredData = filteredData.filter(item =>
            favorites.includes(item.symbol)
        );
    }
    renderData(filteredData);
}



function renderData(data) {
    cryptoList.innerHTML = '';
    data.forEach(item => {
        const row = document.createElement('tr');
        const priceChange = parseFloat(item.priceChangePercent);
        const changeClass = priceChange >= 0 ? 'up' : 'down';
        const sign = priceChange >= 0 ? '+' : '';
        const isFavorite = favorites.includes(item.symbol);
        row.innerHTML = `
            <td>
                <button class="fav-btn ${isFavorite ? 'active' : ''}" data-symbol="${item.symbol}">
                    ${isFavorite ? '★' : '☆'}
                </button>
            </td>
            <td class="symbol">${item.symbol}</td>
            <td>${Number(item.lastPrice).toLocaleString()}</td>
            <td class="${changeClass}">${sign}${priceChange.toFixed(2)}%</td>
            <td>${Number(item.highPrice).toLocaleString()}</td>
            <td>${Number(item.lowPrice).toLocaleString()}</td>
        `;
        cryptoList.appendChild(row);
    });
}



function toggleFavorite(symbol) {
    if (favorites.includes(symbol)) {
        favorites = favorites.filter(item => item !== symbol);
    } else {
        favorites.push(symbol);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    filterAndRender();
}



cryptoList.addEventListener('click', event => {
    if (event.target.classList.contains('fav-btn')) {
        const symbol = event.target.dataset.symbol;
        toggleFavorite(symbol);
    }
});



searchInput.addEventListener('input', filterAndRender);
allTab.addEventListener('click', () => {
    currentTab = 'all';
    allTab.classList.add('active');
    favoritesTab.classList.remove('active');
    filterAndRender();
});



favoritesTab.addEventListener('click', () => {
    currentTab = 'favorites';
    favoritesTab.classList.add('active');
    allTab.classList.remove('active');
    filterAndRender();
});




fetchCryptoData();
setInterval(fetchCryptoData, 1000);