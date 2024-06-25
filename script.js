window.onload = function () {
    var gradElement = document.querySelector('.grad');
    var extraHeight = 100; // 向外延伸的額外像素值
    var contentHeight = 0;

    // 計算 .grad 內部所有子元素的總高度
    for (var i = 0; i < gradElement.children.length; i++) {
        contentHeight += gradElement.children[i].offsetHeight;
    }

    // 將內容高度加上額外的像素值
    var totalHeight = contentHeight + extraHeight;

    // 設定 .grad 的高度
    gradElement.style.height = totalHeight + 'px';
};