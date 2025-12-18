// kabukicho-engine/services/LogService.js

export class LogService {
    constructor() {
        this.publicNews = []; // 마을 전체 스캔들
        this.privateLogs = new Map(); // 개인별 사생활 로그
    }

    addPublicNews(message) {
        this.publicNews.unshift({ msg: message, time: new Date().toLocaleTimeString() });
        if (this.publicNews.length > 30) this.publicNews.pop();
    }

    addPrivateLog(charId, message) {
        if (!this.privateLogs.has(charId)) this.privateLogs.set(charId, []);
        const logs = this.privateLogs.get(charId);
        logs.unshift({ msg: message, time: new Date().toLocaleTimeString() });
        if (logs.length > 50) logs.pop();
    }

    getPrivateLogs(charId) {
        return this.privateLogs.get(charId) || [];
    }
}