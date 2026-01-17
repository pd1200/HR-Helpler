
import React, { useState, useMemo } from 'react';
import { Participant } from '../types';

interface ListInputProps {
  participants: Participant[];
  onUpdate: (list: Participant[]) => void;
  onNext: () => void;
}

const MOCK_NAMES = [
  "王小明", "李美玲", "張大為", "陳婉婷", "林志豪", 
  "黃雅琴", "郭家誠", "徐若瑄", "周杰倫", "蔡依林",
  "葉問", "梁朝偉", "劉德華", "張曼玉", "林青霞",
  "金城武", "舒淇", "彭于晏", "桂綸鎂", "鳳小岳"
];

const ListInput: React.FC<ListInputProps> = ({ participants, onUpdate, onNext }) => {
  const [inputText, setInputText] = useState(participants.map(p => p.name).join('\n'));

  // Calculate duplicates
  const duplicates = useMemo(() => {
    const seen = new Set();
    const dups = new Set<string>();
    const names = inputText.split('\n').map(n => n.trim()).filter(n => n !== '');
    names.forEach(name => {
      if (seen.has(name)) {
        dups.add(name);
      }
      seen.add(name);
    });
    return Array.from(dups);
  }, [inputText]);

  const updateListFromText = (text: string) => {
    const names = text
      .split('\n')
      .map(name => name.trim())
      .filter(name => name !== '');
    
    const newList = names.map((name, index) => ({
      id: `${Date.now()}-${index}`,
      name
    }));
    onUpdate(newList);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    updateListFromText(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const names = text
        .split(/[\n,]/)
        .map(name => name.trim().replace(/^["']|["']$/g, ''))
        .filter(name => name !== '');
      
      const newText = names.join('\n');
      setInputText(newText);
      updateListFromText(newText);
    };
    reader.readAsText(file);
  };

  const loadMockData = () => {
    const mockText = MOCK_NAMES.join('\n');
    setInputText(mockText);
    updateListFromText(mockText);
  };

  const removeDuplicates = () => {
    const names = inputText.split('\n').map(n => n.trim()).filter(n => n !== '');
    const uniqueNames = Array.from(new Set(names));
    const newText = uniqueNames.join('\n');
    setInputText(newText);
    updateListFromText(newText);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">名單管理</h2>
          <p className="text-slate-500">上傳 CSV 檔案或直接貼上姓名</p>
        </div>
        <button 
          onClick={loadMockData}
          className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-md font-medium transition-colors border border-slate-200"
        >
          <i className="fa-solid fa-vial mr-1"></i> 使用範例名單
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            上傳 CSV
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-2 pb-2">
                <i className="fa-solid fa-cloud-arrow-up text-xl text-slate-400 mb-1"></i>
                <p className="text-sm text-slate-500">
                  <span className="font-semibold">點擊上傳</span> 或拖放檔案
                </p>
              </div>
              <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
            </label>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-700">
              手動輸入 / 預覽 ({participants.length} 人)
            </label>
            {duplicates.length > 0 && (
              <div className="flex items-center space-x-2 animate-in fade-in duration-300">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                  <i className="fa-solid fa-triangle-exclamation mr-1"></i>
                  發現 {duplicates.length} 個重複姓名
                </span>
                <button 
                  onClick={removeDuplicates}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-2"
                >
                  一鍵移除
                </button>
              </div>
            )}
          </div>
          <textarea
            value={inputText}
            onChange={handleTextChange}
            placeholder="王小明&#10;李大華&#10;張美麗"
            className={`w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm resize-none transition-colors ${duplicates.length > 0 ? 'border-amber-300 bg-amber-50/30' : 'border-slate-300'}`}
          />
          {duplicates.length > 0 && (
            <p className="mt-2 text-[10px] text-amber-500 leading-tight">
              重複項：{duplicates.join(', ')}
            </p>
          )}
        </div>

        <div className="pt-4 flex justify-between items-center">
          <div className="text-sm text-slate-500">
            {participants.length > 0 ? `${participants.length} 名成員已就緒` : '請輸入名單'}
          </div>
          <button
            disabled={participants.length === 0}
            onClick={onNext}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            下一步：抽籤 <i className="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListInput;
