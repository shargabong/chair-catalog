// стульчики
const chairs = [
    {
        id: 1,
        name: "Пенёк Петрович",
        type: "child",
        location: "Детсад «Колосок», 1998–2001",
        description: "Я на нём первый раз в садике кашу ел, вроде не плакал. Там царапина от машинки осталась, я её туда специально катал.",
        image: "images/child-chair.jpg",
        fullDesc: "Этот стул помнит, как я боялся тихого часа. На сиденье наклейка с зайчиком, которую я сам приклеил."
    },
    {
        id: 2,
        name: "Скрипун Семён",
        type: "school",
        location: "Школа №5, кабинет алгебры, 2005–2013",
        description: "Этот стул реально бесил — скрипел на каждой контрольной. А на спинке кто-то написал «Диман». Диман, ты где теперь?",
        image: "images/school-chair.jpg",
        fullDesc: "Скрип был такой, что учительница всегда говорила: «Опять Скрипун?». На ножке сохранилась жевательная резинка 2008 года."
    },
    {
        id: 3,
        name: "Трупус Офисус",
        type: "office",
        location: "Офис «Рога и Копыта», 2018–2025",
        description: "Колесо отвалилось через месяц, мы его скотчем примотали — и норм, ещё 2 года проработало. Скотч рулит.",
        image: "images/office-chair.jpg",
        fullDesc: "Кресло пережило три реорганизации, четырёх начальников и бессчётное количество дедлайнов. Пятно от кофе на спинке — память о ночной смене."
    },
    {
        id: 4,
        name: "Табурет Тихон",
        type: "taburet",
        location: "Дача, 1990 — наше время",
        description: "На нём бабушка чистила картошку, дед читал газету, а мы с друзьями на кухне сидели до утра. Шатается, но не сдаётся.",
        image: "images/taburet.jpg",
        fullDesc: "Табуретка пережила трёх котов, два ремонта и одну свадьбу. Если на неё встать, можно достать антресоль."
    },
    {
        id: 5,
        name: "Борис Барный",
        type: "bar",
        location: "Бар «У Гоши», 2020–2024",
        description: "Помнит, как мы после сессии отмечали, и как я там чуть не уснул. Следы от текилы наверное уже не оттереть.",
        image: "images/bar-chair.jpg",
        fullDesc: "Высокий стул с металлическими ножками. На сиденье автографы посетителей, включая одного очень известного кота."
    }
];

// глобал
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentFilter = 'all';

// dom
const container = document.getElementById('card-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const favCountSpan = document.getElementById('favorites-count');
const favModal = document.getElementById('favorites-modal');
const chairModal = document.getElementById('chair-modal');
const modalDetails = document.getElementById('modal-details');
const closeBtn = document.querySelector('.close');
const closeFav = document.querySelector('.close-fav');
const favList = document.getElementById('favorites-list');
const clearFavBtn = document.getElementById('clear-favorites');
const scrollBtn = document.getElementById('scroll-top');

// избранное
function updateFavCount() {
    favCountSpan.textContent = favorites.length;
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function toggleFavorite(id) {
    id = Number(id);
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    saveFavorites();
    updateFavCount();
    renderCards();
}

// рендер карточек
function renderCards() {
    let filtered = chairs;
    if (currentFilter !== 'all') {
        filtered = chairs.filter(chair => chair.type === currentFilter);
    }

    let html = '';
    filtered.forEach(chair => {
        const isFavorite = favorites.includes(chair.id) ? 'favorite' : '';
        html += `
            <article class="card" data-id="${chair.id}">
                <img src="${chair.image}" alt="${chair.name}">
                <h3>${chair.name}</h3>
                <p class="location">📍 ${chair.location}</p>
                <p class="desc">${chair.description}</p>
                <div class="card-actions">
                    <button class="fav-btn ${isFavorite}" data-id="${chair.id}">
                        ${favorites.includes(chair.id) ? '❤️' : '🖤'}
                    </button>
                    <button class="details-btn" data-id="${chair.id}">Подробнее</button>
                </div>
            </article>
        `;
    });
    container.innerHTML = html;
    updateFavCount();
}

// модальное (деталей)
function showChairDetails(id) {
    id = Number(id);
    const chair = chairs.find(c => c.id === id);
    if (!chair) return;
    modalDetails.innerHTML = `
        <img src="${chair.image}" alt="${chair.name}" style="width:100%; max-height:300px; object-fit:contain;">
        <h3>${chair.name}</h3>
        <p><strong>📍 ${chair.location}</strong></p>
        <p>${chair.description}</p>
        <p><em>${chair.fullDesc}</em></p>
    `;
    chairModal.style.display = 'block';
}

// модальное (избранное)
function showFavoritesModal() {
    if (favorites.length === 0) {
        favList.innerHTML = '<p>Пока ничего нет. Добавьте стулья в избранное 🖤</p>';
    } else {
        let html = '';
        favorites.forEach(id => {
            const chair = chairs.find(c => c.id === id);
            if (chair) {
                html += `
                    <div class="fav-item">
                        <img src="${chair.image}" alt="${chair.name}">
                        <span>${chair.name}</span>
                        <button class="remove-fav" data-id="${chair.id}">❌</button>
                    </div>
                `;
            }
        });
        favList.innerHTML = html;
    }
    favModal.style.display = 'block';
}

function clearFavorites() {
    favorites = [];
    saveFavorites();
    renderCards();
    showFavoritesModal();
}

// обработчики
container.addEventListener('click', (e) => {
    if (e.target.classList.contains('fav-btn')) {
        e.preventDefault();
        const id = e.target.dataset.id;
        toggleFavorite(id);
    }
    if (e.target.classList.contains('details-btn')) {
        e.preventDefault();
        const id = e.target.dataset.id;
        showChairDetails(id);
    }
});

// фильтры
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderCards();
    });
});

// открыть модалку избранного по клику на счетчик
document.querySelector('.favorites').addEventListener('click', showFavoritesModal);

closeBtn.addEventListener('click', () => {
    chairModal.style.display = 'none';
});
closeFav.addEventListener('click', () => {
    favModal.style.display = 'none';
});
window.addEventListener('click', (e) => {
    if (e.target === chairModal) chairModal.style.display = 'none';
    if (e.target === favModal) favModal.style.display = 'none';
});

// чистка избранного
clearFavBtn.addEventListener('click', clearFavorites);

// удаление конкретного стула из избранного
favList.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-fav')) {
        const id = e.target.dataset.id;
        favorites = favorites.filter(favId => favId !== Number(id));
        saveFavorites();
        renderCards();
        showFavoritesModal();
    }
});

// "наверх" кнопка
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollBtn.style.display = 'block';
    } else {
        scrollBtn.style.display = 'none';
    }
});
scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

renderCards();