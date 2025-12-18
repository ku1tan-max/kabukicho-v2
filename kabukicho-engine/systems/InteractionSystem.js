// 상호작용 성공 시 호출되는 예시
if (Math.random() < 0.1) { // 10% 확률로 스냅샷
    const snapshotMsg = this.aiSys.describeEvent(npc, target, 'snapshot');
    this.logService.addPrivateLog(npc.id, `${snapshotMsg} [Album_Link_01]`);
    this.logService.addPublicNews(`${npc.name}와 ${target.name}의 밀회 현장이 포착되었습니다!`);
}