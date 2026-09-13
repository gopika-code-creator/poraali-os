import React, { useState } from 'react';
import { MessageSquare, Send, CheckCheck, AlertCircle, X, Sparkles, User, RefreshCw, ThumbsUp } from 'lucide-react';
import { KudumbamMessage } from '../types';
import { sounds } from '../utils/sound';

interface KudumbamMessengerProps {
  onStressChange: (delta: number, reason: string, ammaDialogue: string, englishTranslation: string) => void;
  onClose: () => void;
}

const FAMILY_CHATS: KudumbamMessage[] = [
  {
    id: 'ammavan_nasa',
    sender: 'Sukumaran Ammavan',
    senderRole: 'Family Elder & Unofficial WhatsApp Fact Checker',
    avatarText: 'SA',
    avatarBg: 'bg-amber-600',
    time: '14:22',
    forwardTag: true,
    content: '🚨 അടിയന്തര മുന്നറിയിപ്പ്! NASA ഉപഗ്രഹങ്ങൾ സ്ഥിരീകരിച്ചു: മൊബൈൽ ഫോണിൽ നിന്ന് വരുന്ന 5G റേഡിയേഷൻ ഇല്ലാതാക്കാൻ രാവിലെ തിളപ്പിച്ച ജീരകവെള്ളത്തിൽ 2 തുള്ളി നാരങ്ങനീര് ഒഴിച്ച് കുടിക്കുക. എല്ലാ ഗ്രൂപ്പുകളിലേക്കും ഷെയർ ചെയ്യുക! 🍋🙏',
    contentEnglish: 'EMERGENCY WARNING! NASA satellites confirm: Drink boiled jeera water with 2 drops of lemon juice every morning to neutralize harmful 5G smartphone radiation. Forward to all family groups! 🍋🙏',
    options: [
      {
        label: '🙏 "ശരി അമ്മാവാ, ഞാൻ ഇപ്പോൾ തന്നെ കുടിക്കാം" (Agree politely)',
        labelEnglish: 'Agree with respect: "Understood Ammava, drinking it right away"',
        stressDelta: -10,
        ammaComment: 'Ammavan paranjathu kettu! Kandille, kanda computer nokki irikkunna ninakku ithremengilum bodham venam!',
        ammaCommentEnglish: 'Good, you listened to Ammavan! At least you have that much sense instead of staring at screens all day!'
      },
      {
        label: '❌ "അമ്മാവാ ഇത് പച്ച കള്ളം! Fake news ആണ്!" (Debunk the forward)',
        labelEnglish: 'Fact-check: "Ammava this is 100% fake news fabricated online!"',
        stressDelta: +25,
        ammaComment: 'Ammavanod anganeyano tharkkikyunne? Valiya scientist aayennano vicharam? Thala-thericha piller!',
        ammaCommentEnglish: 'Is that how you argue with Ammavan? Do you think you have become a Nobel Prize scientist? Disrespectful child!'
      },
      {
        label: '👀 [Leave on Read / Seen at 14:23]',
        labelEnglish: 'Ignore and leave on Blue Ticks',
        stressDelta: +18,
        ammaComment: 'Ammavan message ayachittu oru reply polum koduthilla! Ninakku ethandu ahankaram aanu! Phone njan eduthu kinattil eriyum!',
        ammaCommentEnglish: 'Ammavan sent a message and you left him on Read without replying! Such arrogance! I will throw your phone down the well!'
      }
    ]
  },
  {
    id: 'chithi_psc',
    sender: 'Mini Chithi',
    senderRole: 'PSC Guidance & Marriage Matchmaker',
    avatarText: 'MC',
    avatarBg: 'bg-purple-600',
    time: '15:10',
    forwardTag: false,
    content: 'മോളേ/മോനേ, കേരള PSC സെക്രട്ടേറിയറ്റ് അസിസ്റ്റന്റ് പരീക്ഷയുടെ പുതിയ സിലബസ് വന്നിട്ടുണ്ട്. ദിവസവും രാവിലെ 4 മണിക്ക് എഴുന്നേറ്റ് പഠിച്ചാൽ ഈ പ്രാവശ്യം റാങ്ക് കിട്ടും. സമയം കളയരുത്! 📚',
    contentEnglish: 'Dear child, the new Kerala PSC Secretariat Assistant exam syllabus is out. If you wake up at 4 AM daily and study, you will crack the rank list. Stop wasting time on computers! 📚',
    options: [
      {
        label: '📖 "ശരി ചിത്തീ, സിലബസ് ഡൗൺലോഡ് ചെയ്ത് തുടങ്ങി" (Confirm studying)',
        labelEnglish: 'Confirm preparation: "Yes Chithi, syllabus downloaded and studying"',
        stressDelta: -15,
        ammaComment: 'Ketto? Chithi paranjathil kaaryamundu. Government joli kitti pension vangi jeevikkunna pole varumo IT company?',
        ammaCommentEnglish: 'Did you hear that? Chithi is speaking golden truth. Can any private IT job match a steady government pension?'
      },
      {
        label: '💻 "എനിക്ക് PSC വേണ്ട, ഞാൻ കോഡിങ് ചെയ്യുന്നു" (Reject PSC)',
        labelEnglish: 'Refuse: "I do not want PSC, I am a software engineer!"',
        stressDelta: +30,
        ammaComment: 'Njan koodathe vere aarum illallo ithu kelkkan! PSC vendannu parayan ivanu naanam ille? Ente nenjathu kuthikko!',
        ammaCommentEnglish: 'Nobody suffers like me! Aren\'t you ashamed to reject PSC? Just stab my heart directly!'
      }
    ]
  },
  {
    id: 'appuppan_roses',
    sender: 'Thekkekara Appuppan',
    senderRole: 'Grandfather (Broadcasts at 05:30 AM sharp)',
    avatarText: 'TA',
    avatarBg: 'bg-emerald-600',
    time: '05:45',
    forwardTag: true,
    content: '🌹 ശുഭദിനം! സർവ്വേശ്വരൻ നിങ്ങളെ അനുഗ്രഹിക്കട്ടെ. പ്രഭാത പ്രാർത്ഥന കഴിഞ്ഞു. സുഖമായിരിക്കുന്നു എന്ന് കരുതുന്നു. 🌸🕊️',
    contentEnglish: '🌹 Subhadinam! May the Almighty bless you all today. Morning temple prayers concluded. Hoping all of you are in good health. 🌸🕊️',
    options: [
      {
        label: '🙏 "നമസ്കാരം അപ്പൂപ്പാ, സുഖമായിരിക്കുന്നു" (Send blessings reply)',
        labelEnglish: 'Reply with reverence: "Namaskaram Appuppa, all well here"',
        stressDelta: -12,
        ammaComment: 'Appuppanu oru marupadi koduthallo, nannayi. Muthooranmarude aasheervaadam venam.',
        ammaCommentEnglish: 'Good that you replied to Appuppan. Elders\' blessings are essential for a good life.'
      },
      {
        label: '😴 "രാവിലെ 5 മണിക്ക് എന്തിനാ റോസാപ്പൂ അയക്കുന്നത്?" (Complain about early hours)',
        labelEnglish: 'Complain: "Why send glittering roses at 5 AM?"',
        stressDelta: +20,
        ammaComment: 'Vrudhanmaarude sneham manassilakkan ulla manassu polum ninakkilla! Paavam Appuppan!',
        ammaCommentEnglish: 'You don\'t even have the heart to appreciate an elder\'s affection! Poor Appuppan!'
      }
    ]
  }
];

export const KudumbamMessenger: React.FC<KudumbamMessengerProps> = ({
  onStressChange,
  onClose
}) => {
  const [selectedChatId, setSelectedChatId] = useState<string>(FAMILY_CHATS[0].id);
  const [repliedChats, setRepliedChats] = useState<Record<string, { label: string; ammaReaction: string }>>({});

  const activeChat = FAMILY_CHATS.find(c => c.id === selectedChatId) || FAMILY_CHATS[0];

  const handleSelectOption = (opt: KudumbamMessage['options'][0]) => {
    sounds.playWhatsAppPing();
    setRepliedChats(prev => ({
      ...prev,
      [activeChat.id]: {
        label: opt.label,
        ammaReaction: opt.ammaComment
      }
    }));

    onStressChange(
      opt.stressDelta,
      `KUDUMBAM_MSG: Responded to ${activeChat.sender}`,
      opt.ammaComment,
      opt.ammaCommentEnglish
    );
  };

  return (
    <div className="w-full h-full flex flex-col font-mono text-xs select-none bg-[#c0c0c0]">
      {/* Retro Menu Bar */}
      <div className="flex gap-3 px-2 py-0.5 border-b border-gray-400 bg-[#dfdfdf] text-[11px] text-gray-800">
        <span className="hover:underline cursor-pointer">File</span>
        <span className="hover:underline cursor-pointer">Contacts</span>
        <span className="hover:underline cursor-pointer">Forward Guard</span>
        <span className="hover:underline cursor-pointer">Mute Ammavan</span>
      </div>

      {/* Split View: Left Contact List, Right Message Thread */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Family Contact Roster */}
        <div className="w-44 border-r border-gray-400 bg-gray-100 flex flex-col">
          <div className="p-1.5 bg-[#c0c0c0] border-b border-gray-300 font-bold text-[10px] text-gray-700 flex items-center justify-between">
            <span>FAMILY INBOX</span>
            <span className="text-green-700 text-[9px] font-bold">ONLINE</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
            {FAMILY_CHATS.map((chat) => {
              const isSelected = chat.id === selectedChatId;
              const hasReplied = !!repliedChats[chat.id];

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    sounds.playKeyClick();
                    setSelectedChatId(chat.id);
                  }}
                  className={`p-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#000080] text-white' : 'hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[9px] font-bold ${chat.avatarBg}`}>
                      {chat.avatarText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold truncate">
                        {chat.sender}
                      </div>
                      <div className={`text-[9px] truncate ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                        {hasReplied ? '✓ Replied' : '⚠️ Unanswered!'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Group Status Box */}
          <div className="p-2 border-t border-gray-300 bg-gray-200 text-[9px] text-gray-600">
            <div>Group: <span className="font-bold text-gray-900">Tharavadu Kudumbam</span></div>
            <div>Members: 38 (All Ammavans & Chithis)</div>
          </div>
        </div>

        {/* Right Side: Active Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Active Contact Header */}
          <div className="p-2 bg-[#f0f0f0] border-b border-gray-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${activeChat.avatarBg}`}>
                {activeChat.avatarText}
              </div>
              <div>
                <div className="font-bold text-xs text-gray-900">
                  {activeChat.sender}
                </div>
                <div className="text-[9px] text-gray-500 font-sans">
                  {activeChat.senderRole}
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-gray-500">
              {activeChat.time}
            </div>
          </div>

          {/* Message Bubble Area */}
          <div className="flex-1 p-3 overflow-y-auto bg-[#e5ddd5] space-y-3">
            {/* Incoming Bubble */}
            <div className="max-w-[90%] bg-white p-2.5 rounded-md shadow-xs border border-gray-300 relative text-gray-900 space-y-1">
              {activeChat.forwardTag && (
                <div className="text-[9px] text-gray-500 flex items-center gap-1 italic border-b border-gray-200 pb-0.5">
                  <span>➡️ Forwarded many times</span>
                </div>
              )}
              <div className="text-xs leading-relaxed font-sans font-medium">
                {activeChat.content}
              </div>
              <div className="text-[10px] text-gray-600 font-sans italic pt-0.5 border-t border-gray-100">
                "{activeChat.contentEnglish}"
              </div>
              <div className="text-right text-[8px] text-gray-400">
                {activeChat.time}
              </div>
            </div>

            {/* Outgoing Bubble (if replied) */}
            {repliedChats[activeChat.id] && (
              <div className="flex flex-col items-end space-y-1">
                <div className="max-w-[85%] bg-[#dcf8c6] p-2 rounded-md shadow-xs border border-green-300 text-gray-900 text-xs font-sans">
                  {repliedChats[activeChat.id].label}
                  <div className="text-right text-[8px] text-gray-500 flex items-center justify-end gap-1 mt-0.5">
                    <span>Sent</span>
                    <CheckCheck size={12} className="text-blue-600" />
                  </div>
                </div>

                {/* Amma's Background Audit Reaction */}
                <div className="max-w-[90%] bg-amber-50 border border-amber-300 p-2 rounded-xs text-[10px] text-amber-950 font-mono">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertCircle size={12} />
                    <span>AMMA AUDIT REACTION:</span>
                  </div>
                  <div className="mt-0.5 italic">
                    "{repliedChats[activeChat.id].ammaReaction}"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Response Options (Household Diplomacy) */}
          <div className="p-2 border-t border-gray-300 bg-[#f9f9f9]">
            <div className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Choose Your Response (Family Diplomacy):</span>
              <span className="text-gray-400 text-[9px]">Avoid Amma's Wrath</span>
            </div>

            <div className="space-y-1.5">
              {activeChat.options.map((opt, idx) => {
                const isSelectedThis = repliedChats[activeChat.id]?.label === opt.label;
                const isHarmful = opt.stressDelta > 0;

                return (
                  <button
                    key={idx}
                    disabled={!!repliedChats[activeChat.id]}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-1.5 border rounded-[2px] transition-all cursor-pointer ${
                      isSelectedThis
                        ? 'bg-blue-100 border-blue-600 text-blue-950 font-bold'
                        : !!repliedChats[activeChat.id]
                        ? 'opacity-50 bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white hover:bg-yellow-50 border-gray-300 hover:border-amber-400 text-gray-800'
                    }`}
                  >
                    <div className="text-[11px] font-sans font-medium flex items-center justify-between">
                      <span>{opt.label}</span>
                      <span className={`text-[10px] font-mono font-bold ml-1 ${
                        isHarmful ? 'text-red-600' : 'text-emerald-700'
                      }`}>
                        {opt.stressDelta > 0 ? `+${opt.stressDelta}% Stress` : `${opt.stressDelta}% Stress`}
                      </span>
                    </div>
                    <div className="text-[9px] text-gray-500 font-sans italic">
                      {opt.labelEnglish}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-1.5 border-t border-gray-400 bg-[#c0c0c0] flex items-center justify-between text-[10px] text-gray-700">
        <span>Family group rules: Always reply to Ammavan promptly, never dispute PSC supremacy.</span>
        <button
          onClick={() => {
            sounds.playKeyClick();
            setRepliedChats({});
          }}
          className="win95-btn px-2 py-0.5 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw size={10} /> Reset Chats
        </button>
      </div>
    </div>
  );
};
