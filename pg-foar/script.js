document.addEventListener("DOMContentLoaded", function () {
  /* ===== TIMESTAMP ===== */
  var span = document.getElementById('live-timestamp');
  if (span) {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    var month = (now.getMonth() + 1).toString().padStart(2, '0');
    var day = now.getDate().toString().padStart(2, '0');
    var year = now.getFullYear();
    span.textContent = 'Live at ' + hours + ':' + minutes + ' ' + ampm + ', ' + month + '/' + day + '/' + year + '.';
  }

  /* ===== PAGE TIMER (controla o chat) ===== */
  var pageStartTime = Date.now();
  var currentPageTime = 0;
  setInterval(function() {
    currentPageTime = (Date.now() - pageStartTime) / 1000;
  }, 500);

  /* ===== CHAT ===== */
  var chatMessages = document.getElementById('chatMessages');
  var chatInput = document.getElementById('chatInput');
  var emojiButton = document.getElementById('emojiButton');
  var emojiMenu = document.getElementById('emojiMenu');
  var defaultAvatar = 'https://ui-avatars.com/api/?name=User&background=random&color=fff&size=64&bold=true';

  function uiAvatar(name, bg) {
    var initials = name.split(' ').map(function(n){ return n[0]; }).slice(0,2).join('');
    return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(initials) + '&background=' + (bg||'random') + '&color=fff&size=64&bold=true';
  }

  var scheduledMessages = [
    { time: 1,  user: 'Robert Peterson', text: 'May God bless you all! In the name of Jesus', avatar: uiAvatar('Robert Peterson','4A90D9') },
    { time: 5,  user: 'Luciana Parker',  text: 'This broadcast changed my day... gratitude to everyone!', avatar: uiAvatar('Luciana Parker','D97B4A') },
    { time: 8,  user: 'Susan Anderson',  text: 'Wow, I entered just at prayer time... Thank God', avatar: uiAvatar('Susan Anderson','E91E8C') },
    { time: 10, user: 'Andrew Lewis',    text: 'God is wonderful! Amen', avatar: uiAvatar('Andrew Lewis','27AE60') },
    { time: 11, user: 'Paul Caesar',     text: 'Saint Benedict, guide our steps!', avatar: uiAvatar('Paul Caesar','8E44AD') },
    { time: 12, user: 'Vera Lucy',       text: 'Bless, Lord, every family connected to this live broadcast', avatar: uiAvatar('Vera Lucy', 'E67E22') },
    { time: 12, user: 'Irene Newman',    text: 'Amen!', avatar: uiAvatar('Irene Newman', '9B59B6') },
    { time: 15, user: 'Claudia Foster',  text: 'Amen!!', avatar: uiAvatar('Claudia Foster','C0392B') },
    { time: 17, user: 'Gilbert Lima',    text: 'Wow, interesting an 800-year-old Prayer? It can only be from God himself', avatar: uiAvatar('Gilbert Lima','E67E22') },
    { time: 19, user: 'Regina Celia',    text: 'Glory to You, Lord! We are ready', avatar: uiAvatar('Regina Celia','2C3E50') },
    { time: 23, user: 'Martha Johnson',  text: 'I just started watching... has anyone used this prayer already?', avatar: uiAvatar('Martha Johnson','2C3E50') },
    { time: 24, user: 'Eliana Roberts',  text: 'Praying!', avatar: uiAvatar('Eliana Roberts','9B59B6') },
    { time: 26, user: 'Support Team',    text: 'Yes, Marta! Thousands of people are already reporting healings, financial blessings, and family restoration through this 7-minute prayer of Saint Benedict.', avatar: uiAvatar('Support Team','1A6B3A') },
    { time: 33, user: 'Joan Lima',       text: 'Amen, glory to God!', avatar: uiAvatar('Joan Lima', '34495E') }
  ];

  function addMessage(user, text, avatar) {
    avatar = avatar || defaultAvatar;
    var messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    var avatarImg = document.createElement('img');
    avatarImg.classList.add('avatar');
    avatarImg.src = avatar;
    avatarImg.loading = 'lazy';
    var contentDiv = document.createElement('div');
    var usernameSpan = document.createElement('span');
    usernameSpan.classList.add('username');
    usernameSpan.textContent = user;
    var textSpan = document.createElement('span');
    textSpan.classList.add('text');
    textSpan.textContent = text;
    contentDiv.appendChild(usernameSpan);
    contentDiv.appendChild(textSpan);
    messageDiv.appendChild(avatarImg);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function checkScheduledMessages() {
    var elapsed = Math.floor(currentPageTime);
    scheduledMessages.forEach(function(msg) {
      if (elapsed >= msg.time && !msg.sent) {
        addMessage(msg.user, msg.text, msg.avatar);
        msg.sent = true;
      }
    });
    requestAnimationFrame(checkScheduledMessages);
  }
  requestAnimationFrame(checkScheduledMessages);

  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && chatInput.value.trim() !== '') {
      addMessage('You', chatInput.value.trim());
      chatInput.value = '';
    }
  });

  emojiButton.addEventListener('click', function() {
    emojiMenu.style.display = (emojiMenu.style.display === 'block') ? 'none' : 'block';
  });

  emojiMenu.addEventListener('click', function(e) {
    if (e.target.tagName === 'SPAN') {
      chatInput.value += e.target.textContent;
      chatInput.focus();
      emojiMenu.style.display = 'none';
    }
  });

  /* ===== SUBSCRIBE / LIKES / VIEWS ===== */
  var subscribeBtn = document.getElementById('subscribe-btn');
  var viewCounterDesktop = document.getElementById('view-counter');
  var viewCounterMobile = document.getElementById('view-counter-mobile');
  var likeBtn = document.getElementById('like-btn');
  var dislikeBtn = document.getElementById('dislike-btn');
  var subscribed = false;

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function() {
      subscribed = !subscribed;
      subscribeBtn.innerText = subscribed ? 'Subscribed' : 'Subscribe';
      subscribeBtn.style.background = subscribed ? '#e5e5e5' : '#0f0f0f';
      subscribeBtn.style.color = subscribed ? '#0f0f0f' : '#ffffff';
    });
  }

  var currentViewers = 55000;
  function updateViewers() {
    var change = Math.floor(Math.random() * 30) + 1;
    var dir = Math.random() < 0.6 ? 1 : -1;
    currentViewers = Math.min(60000, Math.max(50000, currentViewers + change * dir));
    var formatted = currentViewers.toLocaleString('en-US') + ' ';
    if (viewCounterDesktop) viewCounterDesktop.querySelector('.view-number').innerText = formatted;
    if (viewCounterMobile) viewCounterMobile.querySelector('.view-number').innerText = formatted;
  }
  updateViewers();
  setInterval(updateViewers, 3000);

  if (likeBtn && dislikeBtn) {
    likeBtn.addEventListener('click', function() {
      likeBtn.querySelector('img').style.filter = 'invert(0%)';
      dislikeBtn.querySelector('img').style.filter = 'invert(60%)';
    });
    dislikeBtn.addEventListener('click', function() {
      dislikeBtn.querySelector('img').style.filter = 'invert(0%)';
      likeBtn.querySelector('img').style.filter = 'invert(60%)';
    });
  }
});

/* ===== NOTIFICAÇÕES DE COMPRA ===== */
var notifications = [
  { name: "Juan",             message: "bought 5 minutes ago!", img: "https://ui-avatars.com/api/?name=JU&background=4A90D9&color=fff&size=64&bold=true" },
  { name: "Regina Celia",     message: "bought 1 minute ago!",  img: "https://ui-avatars.com/api/?name=RC&background=2C3E50&color=fff&size=64&bold=true" },
  { name: "Carlos",           message: "bought 4 minutes ago!", img: "https://ui-avatars.com/api/?name=CA&background=27AE60&color=fff&size=64&bold=true" },
  { name: "Gilberto Lima",    message: "bought 2 minutes ago!", img: "https://ui-avatars.com/api/?name=GL&background=E67E22&color=fff&size=64&bold=true" },
  { name: "Marco",            message: "bought 3 minutes ago!", img: "https://ui-avatars.com/api/?name=MA&background=8E44AD&color=fff&size=64&bold=true" },
  { name: "Teresa Souza",     message: "bought 3 minutes ago!", img: "https://ui-avatars.com/api/?name=TS&background=D35400&color=fff&size=64&bold=true" },
  { name: "Iracema Nogueira", message: "just bought!",          img: "https://ui-avatars.com/api/?name=IN&background=16A085&color=fff&size=64&bold=true" },
  { name: "Fernando",         message: "bought 2 minutes ago!", img: "https://ui-avatars.com/api/?name=FE&background=D97B4A&color=fff&size=64&bold=true" },
  { name: "Sofia Andrade",    message: "bought 5 minutes ago!", img: "https://ui-avatars.com/api/?name=SA&background=8E44AD&color=fff&size=64&bold=true" },
  { name: "Jose Silva",       message: "bought 7 minutes ago!", img: "https://ui-avatars.com/api/?name=JS&background=2980B9&color=fff&size=64&bold=true" },
  { name: "Camila",           message: "bought 5 minutes ago!", img: "https://ui-avatars.com/api/?name=CM&background=C0392B&color=fff&size=64&bold=true" },
  { name: "Thiago",           message: "just bought!",          img: "https://ui-avatars.com/api/?name=TH&background=2C3E50&color=fff&size=64&bold=true" },
  { name: "Carla Fernandez",  message: "just bought!",          img: "https://ui-avatars.com/api/?name=CF&background=F39C12&color=fff&size=64&bold=true" },
  { name: "Gustavo",          message: "bought 1 minute ago!",  img: "https://ui-avatars.com/api/?name=GU&background=1A6B3A&color=fff&size=64&bold=true" },
  { name: "Veronica",         message: "bought 10 minutes ago!",img: "https://ui-avatars.com/api/?name=VE&background=C0392B&color=fff&size=64&bold=true" },
  { name: "Rafael",           message: "bought 7 minutes ago!", img: "https://ui-avatars.com/api/?name=RA&background=E67E22&color=fff&size=64&bold=true" },
  { name: "Pedro",            message: "bought 9 minutes ago!", img: "https://ui-avatars.com/api/?name=PE&background=2980B9&color=fff&size=64&bold=true" },
  { name: "Lucas",            message: "bought 8 minutes ago!", img: "https://ui-avatars.com/api/?name=LU&background=16A085&color=fff&size=64&bold=true" },
  { name: "Victor",           message: "bought 10 minutes ago!",img: "https://ui-avatars.com/api/?name=VI&background=7F8C8D&color=fff&size=64&bold=true" },
  { name: "Juana Lima",       message: "bought 3 minutes ago!", img: "https://ui-avatars.com/api/?name=JL&background=34495E&color=fff&size=64&bold=true" },
  { name: "Eduardo",          message: "just bought!",          img: "https://ui-avatars.com/api/?name=ED&background=6C3483&color=fff&size=64&bold=true" },
  { name: "Bruno",            message: "bought 1 minute ago!",  img: "https://ui-avatars.com/api/?name=BR&background=1F618D&color=fff&size=64&bold=true" },
  { name: "Ana",              message: "bought 3 minutes ago!", img: "https://ui-avatars.com/api/?name=AN&background=E91E8C&color=fff&size=64&bold=true" },
  { name: "Maria Rita",       message: "bought 5 minutes ago!", img: "https://ui-avatars.com/api/?name=MR&background=D35400&color=fff&size=64&bold=true" }
];

function showNotification(index) {
  if (index >= notifications.length) return;
  var data = notifications[index];
  var el = document.createElement("div");
  el.classList.add("notification");
  el.innerHTML = '<img decoding="async" loading="lazy" src="' + data.img + '" alt=""><div><strong>' + data.name + '</strong><br>' + data.message + '</div>';
  document.body.appendChild(el);
  setTimeout(function() { el.style.opacity = "1"; el.style.transform = "translateX(0)"; }, 100);
  setTimeout(function() {
    el.style.opacity = "0";
    el.style.transform = "translateX(-100%)";
    setTimeout(function() { el.remove(); }, 500);
  }, 8000);
}

setTimeout(function() {
  for (var i = 0; i < notifications.length; i++) {
    (function(idx) {
      setTimeout(function() { showNotification(idx); }, idx * 10000);
    })(i);
  }
}, 2220000);
