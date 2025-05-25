(function() {
    'use strict';
    // 配置選項
    const CONFIG = {
        endpoint: '/api/collect',
        timeout: 5000,
        retryCount: 1,
        debug: false,
        delayTime: 5000 // 延遲5秒
    };
    // 調試日誌函數
    // function log(message, data = null) {
        // if (CONFIG.debug) {
            // console.log('[Analytics]', message, data);
        // }
    // }
    // 收集瀏覽器資訊
    function collectBrowserInfo() {
        try {
            const testFonts = [
                'Arial', 'Times New Roman', 'Helvetica', 'Georgia', 'Verdana',
                'Tahoma', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Lucida Console',
                'Microsoft JhengHei', 'SimSun', 'Microsoft YaHei', 'PingFang SC',
                'Hiragino Sans GB', 'Noto Sans CJK SC', 'Source Han Sans SC'
            ];
            const availableFonts = testFonts.filter(font => {
                return document.fonts ? document.fonts.check(`12px "${font}"`) : true;
            });
            const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
            return {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                local_time: new Date().toISOString(),
                utc_offset: new Date().getTimezoneOffset(),
                navigator_language: navigator.language,
                fonts_available: availableFonts.join(','),
                screen_width: screen.width,
                screen_height: screen.height,
                screen_color_depth: screen.colorDepth,
                device_pixel_ratio: window.devicePixelRatio || 1,
                hardware_concurrency: navigator.hardwareConcurrency || 0,
                cookie_enabled: navigator.cookieEnabled,
                max_touch_points: navigator.maxTouchPoints || 0,
                connection_type: connection?.type || 'Unknown',
                connection_effective_type: connection?.effectiveType || 'Unknown',
                connection_rtt: connection?.rtt || 0,
                page_url: window.location.href,
                page_title: document.title,
                referrer: document.referrer || 'Direct'
            };
        } catch (error) {
            // log('收集瀏覽器資訊時發生錯誤:', error);
            return {};
        }
    }
    // 發送分析數據
    async function sendAnalytics(retryCount = 0) {
        try {
            // log('開始收集並發送分析數據...');
            const browserInfo = collectBrowserInfo();
            // log('收集到的瀏覽器資訊:', browserInfo);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
            const response = await fetch(CONFIG.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify(browserInfo),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            // log('分析數據發送成功:', result);
            return result;
        } catch (error) {
            // log('發送分析數據失敗:', error);
            if (retryCount < CONFIG.retryCount) {
                const delay = Math.pow(2, retryCount) * 1000;
                // log(`${delay}ms 後進行第 ${retryCount + 1} 次重試...`);
                setTimeout(() => {
                    sendAnalytics(retryCount + 1);
                }, delay);
            } else {
                // log('重試次數已達上限，停止發送');
            }
            throw error;
        }
    }
    // 等待 DOM 完全載入
    function waitForDOMReady() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    // 延遲執行函數
    function delayedExecution(callback, delay) {
        return new Promise((resolve) => {
            setTimeout(() => {
                callback();
                resolve();
            }, delay);
        });
    }
    // 初始化分析 - 帶延遲
    async function initAnalytics() {
        try {
            // 1. 等待 DOM 準備完成
            await waitForDOMReady();
            // log('DOM 已準備完成');
            // 2. 延遲指定時間
            // log(`延遲 ${CONFIG.delayTime}ms 後開始收集數據...`);
            await delayedExecution(() => {
                // log('延遲時間已到，開始執行分析');
            }, CONFIG.delayTime);
            // 3. 發送數據
            sendAnalytics();
        } catch (error) {
            // log('初始化分析時發生錯誤:', error);
        }
    }
    // 頁面卸載時的備用發送
    function setupBeaconFallback() {
        window.addEventListener('beforeunload', () => {
            if (navigator.sendBeacon) {
                try {
                    const browserInfo = collectBrowserInfo();
                    const data = JSON.stringify({
                        ...browserInfo,
                        beacon_fallback: true
                    });
                    navigator.sendBeacon(CONFIG.endpoint, data);
                    // log('使用 Beacon API 發送備用數據');
                } catch (error) {
                    // log('Beacon 發送失敗:', error);
                }
            }
        });
    }
    // 暴露全域配置函數
    window.Analytics = {
        config: function(options) {
            Object.assign(CONFIG, options);
            // log('配置已更新:', CONFIG);
        },
        send: sendAnalytics,
        collect: collectBrowserInfo,
        // 手動觸發（忽略延遲）
        sendNow: function() {
            // log('手動觸發分析發送');
            sendAnalytics();
        }
    };
    // 自動初始化
    initAnalytics();
    setupBeaconFallback();
    // log('分析腳本已載入並初始化（延遲模式）');
})();