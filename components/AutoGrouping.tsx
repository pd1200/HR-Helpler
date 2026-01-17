
import React, { useState } from 'react';
import { Participant, Group } from '../types';
import { generateTeamNames, generateIceBreaker } from '../services/geminiService';

interface AutoGroupingProps {
  participants: Participant[];
}

const AutoGrouping: React.FC<AutoGroupingProps> = ({ participants }) => {
  const [groupSize, setGroupSize] = useState(4);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeGroupIceBreaker, setActiveGroupIceBreaker] = useState<{id: number, text: string} | null>(null);

  const performGrouping = async () => {
    if (participants.length === 0) return;
    setIsGenerating(true);
    setActiveGroupIceBreaker(null);

    // Shuffle
    const shuffled = [...participants].sort(() => Math.random() - 0.5);
    
    // Chunk
    const groupCount = Math.ceil(shuffled.length / groupSize);
    const newGroups: Group[] = [];
    
    // Fetch AI team names
    const teamNames = await generateTeamNames(groupCount);

    for (let i = 0; i < groupCount; i++) {
      newGroups.push({
        id: i + 1,
        name: teamNames[i] || `第 ${i + 1} 組`,
        members: shuffled.slice(i * groupSize, (i + 1) * groupSize)
      });
    }

    setGroups(newGroups);
    setIsGenerating(false);
  };

  const getIceBreaker = async (group: Group) => {
    const text = await generateIceBreaker(group.members.map(m => m.name));
    setActiveGroupIceBreaker({ id: group.id, text });
  };

  const downloadCSV = () => {
    if (groups.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "組別名稱,成員姓名\n";

    groups.forEach(group => {
      group.members.forEach(member => {
        csvContent += `"${group.name}","${member.name}"\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HR_Grouping_Results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">自動分組</h2>
            <p className="text-slate-500">設定每組人數，由 AI 為您的團隊命名</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-600 whitespace-nowrap">每組人數:</span>
              <input 
                type="number" 
                min="2" 
                max={participants.length}
                value={groupSize} 
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
                className="w-16 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={performGrouping}
              disabled={isGenerating || participants.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center shadow-md shadow-indigo-100"
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i> 分組中...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shuffle mr-2"></i> 開始分組
                </>
              )}
            </button>
            {groups.length > 0 && (
              <button
                onClick={downloadCSV}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all flex items-center shadow-md shadow-emerald-100"
                title="下載分組結果 CSV"
              >
                <i className="fa-solid fa-file-export mr-2"></i> 下載CSV
              </button>
            )}
          </div>
        </div>
      </div>

      {groups.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-600 p-4 flex justify-between items-center">
                <h3 className="text-white font-bold">{group.name}</h3>
                <span className="bg-indigo-500 text-indigo-100 text-xs px-2 py-1 rounded-full">
                  {group.members.length} 人
                </span>
              </div>
              <div className="p-4 space-y-2 min-h-[120px]">
                {group.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-3 text-slate-700 p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {member.name.charAt(0)}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                {activeGroupIceBreaker?.id === group.id ? (
                  <div className="text-sm text-indigo-700 italic bg-indigo-50 p-3 rounded border border-indigo-100 animate-pulse-once">
                    "{activeGroupIceBreaker.text}"
                  </div>
                ) : (
                  <button 
                    onClick={() => getIceBreaker(group)}
                    className="w-full py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center"
                  >
                    <i className="fa-solid fa-lightbulb mr-1"></i> 生成破冰話題 (AI)
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {groups.length === 0 && participants.length > 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <i className="fa-solid fa-users text-4xl text-slate-300 mb-4 block"></i>
          <p className="text-slate-500">準備就緒，點擊按鈕開始分組</p>
        </div>
      )}

      {participants.length === 0 && (
        <div className="text-center py-20 bg-red-50 rounded-xl border border-dashed border-red-200">
          <i className="fa-solid fa-triangle-exclamation text-4xl text-red-300 mb-4 block"></i>
          <p className="text-red-500">請先在「名單管理」中輸入成員名單</p>
        </div>
      )}
    </div>
  );
};

export default AutoGrouping;
