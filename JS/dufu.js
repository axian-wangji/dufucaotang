
(function () {
    const dufuPanel = document.getElementById('dufuPanel');
    const dufuFloatBall = document.getElementById('dufuFloatBall');
    const dufuHoverMenu = document.getElementById('dufuHoverMenu');
    const closeBtn = document.getElementById('dufuCloseBtn');
    const minBtn = document.getElementById('dufuMinBtn');

    const tabButtons = document.querySelectorAll('.dufu-tab');
    const tabContents = document.querySelectorAll('.dufu-tab-content');
    const menuButtons = document.querySelectorAll('.dufu-menu-item');

    const messages = document.getElementById('dufuMessages');
    const questionInput = document.getElementById('dufuQuestion');
    const sendBtn = document.getElementById('dufuSendBtn');

    const searchBtn = document.getElementById('dufuSearchBtn');
    const searchKeyword = document.getElementById('dufuSearchKeyword');
    const searchCategory = document.getElementById('dufuSearchCategory');
    const searchResult = document.getElementById('dufuSearchResult');

    const annotationBtn = document.getElementById('dufuAnnotationBtn');
    const annotationText = document.getElementById('dufuAnnotationText');
    const annotationResult = document.getElementById('dufuAnnotationResult');

    const reciteBtn = document.getElementById('dufuReciteBtn');
    const stopReciteBtn = document.getElementById('dufuStopReciteBtn');
    const reciteText = document.getElementById('dufuReciteText');
    const reciteResult = document.getElementById('dufuReciteResult');

    const storyBtn = document.getElementById('dufuStoryBtn');
    const storyTitle = document.getElementById('dufuStoryTitle');
    const storyResult = document.getElementById('dufuStoryResult');

    function openPanel(tabName = 'chat') {
      dufuPanel.classList.add('show');
      switchTab(tabName);
    }

    function closePanel() {
      dufuPanel.classList.remove('show');
    }

    function switchTab(tabName) {
      tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });
      tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
      });
    }

    dufuFloatBall.addEventListener('click', () => openPanel('chat'));
    closeBtn.addEventListener('click', closePanel);
    minBtn.addEventListener('click', closePanel);

    menuButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        openPanel(btn.dataset.action);
      });
    });

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    function addMessage(role, text) {
      const msg = document.createElement('div');
      msg.className = `dufu-msg ${role}`;
      msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
      return msg;
    }

    function updateLastAssistantMessage(text) {
      const msg = document.createElement('div');
      msg.className = 'dufu-msg assistant';
      msg.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }

    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .replace(/\n/g, '<br>');
    }

      // ===== 1. AI问答 =====//
   
async function handleChat() {
  const question = questionInput.value.trim();
  if (!question) return;
  addMessage('user', question);
  questionInput.value = '';
  const thinkingMsg = addMessage('assistant', '正在深度思考中，请稍候...');
  const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  const API_KEY = '462f8acfece545f7b29a3c0652cb18e6.GivDC5s9wSzRTpur'; 

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        // 修复 1: 修正了 Header 的写法，去掉了错误的 $ {} 语法
        'Authorization': `Bearer ${API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        // 修复 2: 修改为标准的 Chat Completions 格式
        model: "glm-4-flash", // 可以根据需要选择模型
        messages: [
          {
            role: "system", 
            // 这里设置 AI 的人设
            content: "你是一位杜甫数字人，负责杜甫诗词的讲解、问答和赏析。"
          },
          {
            role: "user", 
            content: question // 将用户输入的实时问题传入
          }
        ],
        // 可选参数
        temperature: 0.7,
      })
    });

    // 检查 HTTP 状态码
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    const botReply = data.choices[0].message.content;
    if (thinkingMsg && thinkingMsg.parentNode) {
            messages.removeChild(thinkingMsg);
        }
        addMessage('assistant', botReply);
   
    
  } catch (err) {
    console.error(err); // 方便调试
    if (thinkingMsg && thinkingMsg.parentNode) {
      thinkingMsg.remove();
        }

        // 显示错误信息
        addMessage('assistant', `请求失败：${err.message}。请检查网络或API Key。`);
    }
}

sendBtn.addEventListener('click', handleChat);
questionInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

    // ===== 2. 杜诗检索 =====
    searchBtn.addEventListener('click', async function () {
      const keyword = searchKeyword.value.trim();
      const category = searchCategory.value;
      if (!keyword && !category) {
    searchResult.textContent = '请输入关键词或选择分类。';
    return;
  }

  searchResult.textContent = '正在检索与创作中...';
const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  const API_KEY = '462f8acfece545f7b29a3c0652cb18e6.GivDC5s9wSzRTpur';

      try {
        // 对接后端诗词数据库检索接口
        const systemPrompt = "你是一位杜甫数字人。请根据杜甫的生平和创作风格，回答用户关于诗词的检索请求。如果找不到完全匹配的诗，请根据他的风格现场创作一首，并附上简短的赏析。";
    
    const userPrompt = `请帮我检索或创作一首杜甫风格的诗词。
      关键词：${keyword || '无'}
      分类/主题：${category || '无'}
      
      要求：
. 如果有确切的原作，请展示原作并附带简介。
. 如果没有确切原作，请模仿杜甫的沉郁顿挫风格，现场创作一首五言或七言律诗。
. 格式为：
         《诗名》
         [诗句内容]
         
         【简介】
         [简短的赏析或创作背景]`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json' },
            body: JSON.stringify({
        model: "glm-4-flash", // 使用你指定的模型
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8, // 稍微高一点，让 AI 在“检索不到”时更愿意创作
      })
    });
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
        const data = await response.json();
        const aiReply = data.choices[0].message.content;
        searchResult.textContent = aiReply;

} catch (err) {
  console.error(err);
  // 错误兜底
  searchResult.textContent = `检索失败：${err.message}。请检查网络或稍后重试。`;
}
});
       

    // ===== 3. 注释解析 =====
    annotationBtn.addEventListener('click', async function () {
      const text = annotationText.value.trim();
      if (!text) {
        annotationResult.textContent = '请输入需要注释的诗句。';
        return;
      }

      annotationResult.textContent = '正在生成注释...';
      const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  const API_KEY = '462f8acfece545f7b29a3c0652cb18e6.GivDC5s9wSzRTpur'; 

      try {
        const systemPrompt = "你是一位中国古代文学研究专家，尤其精通杜甫的诗歌。请对用户提供的杜甫诗句进行详细的现代文注释和赏析。";

    const userPrompt = `请对以下杜甫的诗句进行深度注释：
    
    【原句】
    ${text}

    请严格按照以下格式输出：
    
    🔍 **字词注释**
    - 词汇1：解释
    - 词汇2：解释
    ...
    
    📖 **句意翻译**
    [用现代白话文流畅翻译这句诗的含义]
    
    🌟 **赏析**
    [分析这句诗在修辞、情感、意境上的特点，以及它在全诗中的作用]`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${API_KEY}`, 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        model: "glm-4-flash", // 使用你指定的模型
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3, // 低一点，注释需要准确，不需要太发散
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // 3. 显示结果
    annotationResult.textContent = aiReply;

  } catch (err) {
    console.error(err);
    // 错误兜底（保留原来的示例，或者显示错误信息）
    annotationResult.textContent = `注释生成失败：${err.message}。请检查网络或稍后重试。`;
  }
});
//lsong//
reciteBtn.addEventListener('click', async function () {
  const text = reciteText.value.trim();
  if (!text) {
    reciteResult.textContent = '请输入需要朗诵的诗词内容。';
    return;
  }

  reciteResult.textContent = '正在朗诵...';

  // 优先使用浏览器内置语音
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
    reciteResult.textContent = '已调用浏览器朗诵功能。若需更拟人化音色，可接入后端TTS。';
  } else {
    reciteResult.textContent = '当前浏览器不支持内置朗读，请接入后端TTS语音接口。';
  }
});

stopReciteBtn.addEventListener('click', function () {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  reciteResult.textContent = '朗诵已停止。';
});
       // ===== 5. 背景故事 =====//
       storyBtn.addEventListener('click', async function () {
      const title = storyTitle.value.trim();
      if (!title) {
        storyResult.textContent = '请输入诗作名称。';
        return;
      }

      storyResult.textContent = '正在获取背景故事...';
      const apiUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  const API_KEY = '462f8acfece545f7b29a3c0652cb18e6.GivDC5s9wSzRTpur';

      try {
        const systemPrompt = "你是一位杜甫生平与创作背景研究专家。请根据用户提供的杜甫诗作名称，生成其创作背景、历史语境和情感内核的详细解读。";

        const userPrompt = `请为杜甫的诗作《${title}》撰写一段背景故事和创作解读。 要求： - 如果该诗作真实存在，请基于历史事实和杜甫生平经历进行解读。 - 如果该诗作不存在或无法考证，请根据杜甫的风格和时代背景，进行合理的文学性创作解读。 - 内容需要包含：创作时间/地点推测、历史背景（如安史之乱等）、诗人当时的心境、以及该作品在杜甫诗歌体系中的地位或特色。 - 语言风格要严谨且富有文学性。`;

    const response = await fetch(apiUrl, { // <-- 注意这里不要加引号
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`, // <-- 加上认证头
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "glm-4-flash", // 使用模型
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7, // 控制创意程度
      })
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API 请求失败，状态码: ${response.status}`);
    }

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // 4. 显示结果
    storyResult.textContent = aiReply;

  } catch (err) {
    console.error('获取背景故事失败:', err);
    // 备用的兜底方案
    storyResult.textContent = `获取背景故事失败: ${err.message}。请检查网络或稍后重试。`;
  }
});
  })();