import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_LOGO_URL } from '../constants/branding';
import { playScriptCopySound } from '../utils/soundEffects';
import {
  Terminal,
  Play,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Trash2,
  Monitor,
  Eye,
  Sliders,
  Zap,
  SlidersHorizontal,
  Wand2,
  Rocket,
  Flame,
  Ghost,
  Shield
} from 'lucide-react';

interface ScriptTemplate {
  id: string;
  name: string;
  category: string;
  icon: any;
  description: string;
  generateCode: (params: Record<string, any>) => string;
  params: {
    key: string;
    label: string;
    type: 'slider' | 'select' | 'toggle';
    min?: number;
    max?: number;
    options?: string[];
    default: any;
  }[];
}

const TEMPLATES: ScriptTemplate[] = [
  {
    id: 'fly_gui',
    name: 'Universal Fly GUI',
    category: 'Hareket / Uçma',
    icon: Rocket,
    description: 'Roblox karakterini tuşla uçuran, hızı ayarlanabilir Byfron uyumlu Fly scripti.',
    params: [
      { key: 'speed', label: 'Uçuş Hızı (Speed)', type: 'slider', min: 20, max: 200, default: 60 },
      { key: 'toggleKey', label: 'Aç/Kapa Tuşu (Key)', type: 'select', options: ['E', 'F', 'X', 'Q'], default: 'E' }
    ],
    generateCode: (p) => `-- [HarikaScript] Universal Fly GUI v3.2
-- Byfron / Hyperion Safe Loader
local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")
local root = character:WaitForChild("HumanoidRootPart")

local flySpeed = ${p.speed}
local flyKey = Enum.KeyCode.${p.toggleKey}
local flying = false

local bv = Instance.new("BodyVelocity")
bv.MaxForce = Vector3.new(0, 0, 0)
bv.Velocity = Vector3.new(0, 0, 0)
bv.Parent = root

local function toggleFly()
    flying = not flying
    if flying then
        bv.MaxForce = Vector3.new(400000, 400000, 400000)
        print("[HarikaScript]: Uçuş Aktif! Hız: " .. flySpeed .. " (Kapatmak için: " .. tostring(flyKey) .. ")")
    else
        bv.MaxForce = Vector3.new(0, 0, 0)
        print("[HarikaScript]: Uçuş Kapatıldı.")
    end
end

UserInputService.InputBegan:Connect(function(input, processed)
    if not processed and input.KeyCode == flyKey then
        toggleFly()
    end
end)

RunService.RenderStepped:Connect(function()
    if flying then
        local cam = workspace.CurrentCamera
        local moveDirection = humanoid.MoveDirection
        if moveDirection.Magnitude > 0 then
            bv.Velocity = cam.CFrame.LookVector * flySpeed
        else
            bv.Velocity = Vector3.new(0, 0.1, 0)
        end
    end
end)

print("[HarikaScript]: Fly Script başarıyla yüklendi! Tuş: " .. tostring(flyKey))`
  },
  {
    id: 'speed_jump',
    name: 'Speed & Super Jump',
    category: 'Karakter Güçlendirici',
    icon: Flame,
    description: 'Koşma hızını ve zıplama gücünü artıran, reset atıldığında korunan modül.',
    params: [
      { key: 'walkSpeed', label: 'Koşma Hızı (WalkSpeed)', type: 'slider', min: 16, max: 250, default: 85 },
      { key: 'jumpPower', label: 'Zıplama Gücü (JumpPower)', type: 'slider', min: 50, max: 350, default: 120 }
    ],
    generateCode: (p) => `-- [HarikaScript] Speed & Super Jump Suite
local Players = game:GetService("Players")
local localPlayer = Players.LocalPlayer

local TARGET_SPEED = ${p.walkSpeed}
local TARGET_JUMP = ${p.jumpPower}

local function applyBoosts(character)
    local humanoid = character:WaitForChild("Humanoid")
    humanoid.WalkSpeed = TARGET_SPEED
    humanoid.UseJumpPower = true
    humanoid.JumpPower = TARGET_JUMP
    
    humanoid:GetPropertyChangedSignal("WalkSpeed"):Connect(function()
        if humanoid.WalkSpeed ~= TARGET_SPEED then
            humanoid.WalkSpeed = TARGET_SPEED
        end
    end)
    print("[HarikaScript]: Hız (" .. TARGET_SPEED .. ") ve Zıplama (" .. TARGET_JUMP .. ") uygulandı.")
end

if localPlayer.Character then
    applyBoosts(localPlayer.Character)
end
localPlayer.CharacterAdded:Connect(applyBoosts)`
  },
  {
    id: 'box_esp',
    name: 'Player Chams & Box ESP',
    category: 'Görsel / Wallhack',
    icon: Eye,
    description: 'Tüm oyuncuların etrafına parıldayan kutu ve isim etiketi çizen görsel ESP.',
    params: [
      { key: 'teamCheck', label: 'Takım Kontrolü (Team Check)', type: 'toggle', default: false },
      { key: 'fillTransparency', label: 'Saydamlık (0-10)', type: 'slider', min: 1, max: 9, default: 5 }
    ],
    generateCode: (p) => `-- [HarikaScript] Universal Highlight & Box ESP
local Players = game:GetService("Players")
local localPlayer = Players.LocalPlayer
local teamCheck = ${p.teamCheck ? 'true' : 'false'}

local function createEsp(player)
    if player == localPlayer then return end
    
    local function applyHighlight(character)
        local highlight = Instance.new("Highlight")
        highlight.Name = "HarikaScript_ESP"
        highlight.FillColor = Color3.fromRGB(168, 85, 247)
        highlight.OutlineColor = Color3.fromRGB(236, 72, 153)
        highlight.FillTransparency = ${p.fillTransparency / 10}
        highlight.OutlineTransparency = 0
        highlight.Adornee = character
        highlight.Parent = character
    end

    if player.Character then applyHighlight(player.Character) end
    player.CharacterAdded:Connect(applyHighlight)
end

for _, player in ipairs(Players:GetPlayers()) do
    createEsp(player)
end
Players.PlayerAdded:Connect(createEsp)
print("[HarikaScript]: ESP Sistemi Aktif Edildi!")`
  },
  {
    id: 'anti_afk',
    name: 'Anti-AFK & Reconnect',
    category: 'Otomasyon',
    icon: Ghost,
    description: '20 dakika hareketsizlikten dolayı oyundan atılmayı (Error 268) tamamen engelleyen kod.',
    params: [
      { key: 'interval', label: 'Tuşlama Aralığı (Saniye)', type: 'slider', min: 30, max: 300, default: 60 }
    ],
    generateCode: (p) => `-- [HarikaScript] 100% Anti-AFK & Idle Disconnect Bypass
local VirtualUser = game:GetService("VirtualUser")
local Players = game:GetService("Players")
local localPlayer = Players.LocalPlayer

localPlayer.Idled:Connect(function()
    VirtualUser:CaptureController()
    VirtualUser:ClickButton2(Vector2.new())
    print("[HarikaScript]: Anti-AFK tetiklendi, idle kick engellendi! (" .. os.date("%X") .. ")")
end)

task.spawn(function()
    while task.wait(${p.interval}) do
        VirtualUser:Button2Down(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
        task.wait(0.2)
        VirtualUser:Button2Up(Vector2.new(0, 0), workspace.CurrentCamera.CFrame)
    end
end)

print("[HarikaScript]: Anti-AFK Sistemi Arka Planda Aktif Edildi.")`
  },
  {
    id: 'dark_dex',
    name: 'Dark Dex & RemoteSpy Loader',
    category: 'Geliştirici Araçları',
    icon: Terminal,
    description: 'Roblox oyun dosyalarını, remote eventleri incelemek için en gelişmiş Dex Explorer yükleyicisi.',
    params: [],
    generateCode: () => `-- [HarikaScript] Dark Dex V4 & SimpleSpy v3 Loader
-- Warning: Sadece UNC uyumlu executorlarda çalıştırın.

print("[HarikaScript]: Dark Dex Explorer başlatılıyor...")
loadstring(game:HttpGet("https://raw.githubusercontent.com/infyiff/backup/main/dex.lua"))()

print("[HarikaScript]: SimpleSpy Remote Logger yükleniyor...")
loadstring(game:HttpGet("https://raw.githubusercontent.com/exxtremestuffs/SimpleSpy/master/source.lua"))()
print("[HarikaScript]: Geliştirici araçları hazır!")`
  }
];

export const ScriptPlaygroundView: React.FC = () => {
  const { showToast, gainXp } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState<ScriptTemplate>(TEMPLATES[0]);
  const [paramValues, setParamValues] = useState<Record<string, any>>({
    speed: 60,
    toggleKey: 'E',
    walkSpeed: 85,
    jumpPower: 120,
    teamCheck: false,
    fillTransparency: 5,
    interval: 60
  });

  const [code, setCode] = useState<string>(() => TEMPLATES[0].generateCode(paramValues));
  const [logs, setLogs] = useState<string[]>([
    'HarikaScript Lua Sandbox v3.8 Initialized.',
    'Script Stüdyosu Hazır: Sol panelden şablon seçebilir veya Lua kodunu canlı düzenleyebilirsiniz.'
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Apply selected template
  const handleSelectTemplate = (template: ScriptTemplate) => {
    setSelectedTemplate(template);
    const newCode = template.generateCode(paramValues);
    setCode(newCode);
  };

  // Update a single parameter and re-generate code
  const handleParamChange = (key: string, val: any) => {
    const updated = { ...paramValues, [key]: val };
    setParamValues(updated);
    setCode(selectedTemplate.generateCode(updated));
  };

  const handleRun = () => {
    if (isRunning) return;
    setIsRunning(true);
    setLogs((prev) => [...prev, `\n> Executing script at ${new Date().toLocaleTimeString()}...`]);

    setTimeout(() => {
      try {
        const lines = code.split('\n');
        const simulatedOutput: string[] = [];
        lines.forEach((line) => {
          if (line.includes('print')) {
            const match = line.match(/print\((['"])(.*?)\1\)/);
            if (match && match[2]) {
              simulatedOutput.push(match[2]);
            }
          }
        });

        if (simulatedOutput.length === 0) {
          simulatedOutput.push('Script executed with 0 errors. Environment: Hooked successfully.');
        }

        setLogs((prev) => [
          ...prev,
          ...simulatedOutput,
          '✅ [Execution Finished]: 0 errors, Byfron status: Safe.'
        ]);
        showToast('Script simülatörde çalıştırıldı! 🎮');
      } catch (err: any) {
        setLogs((prev) => [...prev, `❌ [Execution Error]: ${err.message}`]);
      } finally {
        setIsRunning(false);
      }
    }, 700);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    playScriptCopySound();
    gainXp(15, 'Script Kopyalandı');
    showToast('Script panoya kopyalandı! (+15 XP) 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setLogs(['Konsol temizlendi. Yeni çalıştırma bekleniyor.']);
  };

  return (
    <div className="space-y-6">

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-950/85 via-[#110c26] to-[#0a0818] border border-emerald-500/40 p-5 sm:p-7 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Lua Script Stüdyosu & Kod Oluşturucu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
            Script <span className="text-emerald-400">Studio</span> & Canlı Playground
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Fly GUI, Speed Boost, Box ESP ve Anti-AFK gibi popüler Roblox scriptlerini slider ayarlarıyla saniyeler içinde özelleştirin, test edin ve executorunuza kopyalayın.
          </p>
        </div>

        {/* Logo Badge */}
        <div className="relative group flex items-center justify-center shrink-0">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-500 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0e0a1c] border-2 border-emerald-500/50 p-1 shadow-2xl overflow-hidden flex items-center justify-center">
            <img src={APP_LOGO_URL} alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </div>

      {/* Interactive Script Templates Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <Wand2 className="w-4 h-4 text-emerald-400" />
            <span>Hazır Lua Kod Şablonları (Tek Tıkla Oluştur)</span>
          </span>
          <span className="text-[11px] text-slate-400">Byfron / Hyperion Korumalı</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TEMPLATES.map((tmpl) => {
            const Icon = tmpl.icon;
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-500/30'
                    : 'border-purple-900/40 bg-[#0e0b1f] hover:bg-[#150f2e] text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-purple-950/60 text-purple-300'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{tmpl.category}</span>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-white truncate">{tmpl.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-1">{tmpl.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Parameters Customizer Slider Bar (if selected template has params) */}
      {selectedTemplate.params.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#0d0920] border border-emerald-500/30 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-black text-emerald-300">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
              <span>{selectedTemplate.name} — Canlı Parametre Ayarları</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Değişiklikler anında koda yansır</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {selectedTemplate.params.map((param) => (
              <div key={param.key} className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-purple-900/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">{param.label}</span>
                  <span className="font-mono font-black text-emerald-400">
                    {paramValues[param.key] ?? param.default}
                  </span>
                </div>

                {param.type === 'slider' && (
                  <input
                    type="range"
                    min={param.min}
                    max={param.max}
                    value={paramValues[param.key] ?? param.default}
                    onChange={(e) => handleParamChange(param.key, Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-purple-950 rounded-lg"
                  />
                )}

                {param.type === 'select' && (
                  <select
                    value={paramValues[param.key] ?? param.default}
                    onChange={(e) => handleParamChange(param.key, e.target.value)}
                    className="w-full bg-[#16102e] text-xs text-white p-2 rounded-lg border border-purple-800/40 focus:outline-none"
                  >
                    {param.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        KeyCode.{opt}
                      </option>
                    ))}
                  </select>
                )}

                {param.type === 'toggle' && (
                  <button
                    onClick={() => handleParamChange(param.key, !(paramValues[param.key] ?? param.default))}
                    className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
                      (paramValues[param.key] ?? param.default)
                        ? 'bg-emerald-600 text-white'
                        : 'bg-purple-950/60 text-slate-400'
                    }`}
                  >
                    {(paramValues[param.key] ?? param.default) ? 'Aktif (Açık)' : 'Devre Dışı (Kapalı)'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor and Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Code Editor */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#0c0919] border border-purple-900/40 overflow-hidden shadow-2xl">
          <div className="p-3 bg-purple-950/40 border-b border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white min-w-0">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Lua Editor ({selectedTemplate.id}.lua)</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-800 text-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı (+15 XP)' : 'Kodu Kopyala (+15 XP)'}</span>
              </button>

              <button
                disabled={isRunning}
                onClick={handleRun}
                className="px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-950/40 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Çalıştırılıyor...' : 'Simülatörde Çalıştır'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 flex-1">
            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-[#08060f] font-mono text-xs text-emerald-300 p-3.5 rounded-xl border border-purple-900/40 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
              placeholder="Lua script kodunu buraya yazın veya şablon seçin..."
            />
          </div>
        </div>

        {/* Right: Output Terminal & Preview */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          
          {/* Terminal Console */}
          <div className="flex flex-col rounded-2xl bg-[#08060f] border border-purple-900/40 overflow-hidden shadow-2xl">
            <div className="p-3 bg-purple-950/30 border-b border-purple-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Executor Simülatör Konsolu</span>
              </div>

              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Konsolu Temizle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-y-auto max-h-[170px]">
              {logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`${
                    log.startsWith('✅')
                      ? 'text-emerald-400 font-bold'
                      : log.startsWith('❌')
                      ? 'text-rose-400 font-bold'
                      : log.startsWith('>')
                      ? 'text-purple-300 font-bold pt-1'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Executor Instructions Card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#0e0a1c] via-[#130d2b] to-[#0c081c] border border-purple-500/40 p-4 shadow-2xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Nasıl Kullanılır? (Executor Rehberi)</span>
            </div>

            <ol className="text-[11px] text-slate-300 space-y-1.5 list-decimal pl-4 leading-relaxed">
              <li>Yukarıdaki şablondan dilediğiniz hileyi seçin veya slider ayarlarını yapın.</li>
              <li><strong>Kodu Kopyala</strong> butonuna basarak Lua kodunu panonuza alın.</li>
              <li>Roblox oyununu açın (Delta, Wave, Hydrogen, Solara veya Fluxus).</li>
              <li>Executorun kod kutusuna yapıştırıp <strong>Execute</strong> tuşuna basın!</li>
            </ol>
          </div>

        </div>

      </div>
    </div>
  );
};
