// kabukicho-engine/models/Mail.js

/**
 * API 연동 지능형 통신 시스템을 위한 메일 모델
 */
export class Mail {
    constructor(senderId, receiverId, content, type = 'normal') {
        this.id = crypto.randomUUID();
        this.senderId = senderId;   // 보내는 놈 ID
        this.receiverId = receiverId; // 받는 놈 ID
        this.content = content;     // AI가 생성한 텍스트 내용
        
        // --- 6. 편지 및 소통 엔진 타입 ---
        // type: 'love'(고백), 'threat'(협박), 'gossip'(뒷담화), 
        //       'gaslighting'(가스라이팅), 'begging'(구걸), 'will'(유언) 등
        this.type = type;
        
        this.timestamp = Date.now();
        this.isRead = false;        // 수신 여부
    }
}