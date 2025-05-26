// 隨機選擇圖片
const images = ['assets/IMG_3004.JPG', 'assets/blonde.png'];
const randomIndex = Math.floor(Math.random() * images.length);
document.getElementById('randomImage').src = images[randomIndex];
// 滾動指示器
const scrollIndicator = document.querySelector('.scroll-indicator');
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollIndicator.style.width = `${scrollPercentage}%`;
});
// 側邊欄切換功能 - 點擊左上角三條橫線
const sidebar = document.querySelector('.sidebar');
const sidebarHeader = document.querySelector('.sidebar-header');
const content = document.querySelector('.content');
sidebarHeader.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    content.classList.toggle('sidebar-collapsed');
});
// 側邊欄導航
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        // 移除所有活動狀態
        navLinks.forEach(nav => nav.classList.remove('active'));
        pages.forEach(page => page.classList.remove('active'));
        // 添加活動狀態
        link.classList.add('active');
        const targetId = link.getAttribute('href').substring(1);
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    });
});
// 粒子背景
const animatedBg = document.querySelector('.animated-bg');
function createParticles() {
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 4 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const duration = Math.random() * 8 + 4;
        const delay = Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        animatedBg.appendChild(particle);
    }
}
createParticles();
// 視窗調整時重新創建粒子
window.addEventListener('resize', () => {
    animatedBg.innerHTML = '';
    createParticles();
});
// 移動端菜單切換
function toggleSidebar() {
    sidebar.classList.toggle('active');
}
// 主題切換
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
});
// 修正移動端菜單按鈕 - 移除重複創建的問題
if (window.innerWidth <= 768) {
    // 檢查是否已經有移動端按鈕存在
    const existingButton = document.querySelector('.mobile-menu-btn');
    if (!existingButton) {
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-btn';
        menuButton.innerHTML = '<i class="fas fa-bars"></i>';
        menuButton.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid rgba(56, 189, 248, 0.3);
            color: #38bdf8;
            padding: 10px;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
            backdrop-filter: blur(10px);
        `;
        menuButton.onclick = toggleSidebar;
        document.body.appendChild(menuButton);
    }
}
// 點擊內容區域時關閉側邊欄（手機版）
if (window.innerWidth <= 768) {
    content.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}