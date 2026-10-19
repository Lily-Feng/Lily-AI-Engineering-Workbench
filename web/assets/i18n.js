const params = new URLSearchParams(location.search);
let stored;
try { stored = localStorage.getItem('workbench-language'); } catch {}
export const language = (params.get('lang') || stored) === 'zh' ? 'zh' : 'en';
document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
try { localStorage.setItem('workbench-language', language); } catch {}

// Whole phrases preserve natural Chinese rather than translating individual words.
const phrases = {
  'Skip to content': '跳至主要内容', 'The modules': '知识模块', 'Switch to dark theme': '切换至深色模式', 'Switch to light theme': '切换至浅色模式',
  'Lily’s': 'Lily 的', 'AI Workbench': 'AI 工程工作台', 'Understand it. Change it. Build with it.': '理解原理，改变参数，动手构建。',
  '18 modules · one growing workbench': '18 个模块 · 持续生长的学习工作台', 'Opening the workbench…': '正在打开工作台…', 'Explore the interactive attention lesson': '探索交互式注意力课程',
  'A visual field guide · 2026': '可视化学习指南 · 2026', 'AI engineering.': 'AI 工程，', 'Make it make sense.': '看得见，想得通。',
  'From model internals to enterprise delivery.': '从模型原理，到企业交付。', 'Explore the ideas, change the inputs, and see what happens.': '探索概念、调整输入，亲眼观察变化。',
  'Explore attention': '探索注意力', 'Browse the modules': '浏览知识模块', '18 modules': '18 个模块', '5 connected layers': '5 个相互关联的层次',
  '1 interactive topic ready': '1 个交互主题已上线', 'Inside the first experiment': '走进第一个实验', 'Who can this token see?': '这个 token 能看到谁？',
  'Attention begins with a question of visibility.': '理解注意力，先从可见范围开始。', 'Start here · Module 02': '从这里开始 · 模块 02', 'Attention, made visible.': '看得见的注意力。',
  'Change a mask. Follow the Q/K/V math. Compare the cache behind MHA, GQA, and MQA.': '切换掩码，跟随 Q/K/V 的计算，比较 MHA、GQA 与 MQA 的缓存。',
  'Open the lesson': '开始学习', 'The learning map': '知识地图', 'One framework. Eighteen ways in.': '一套体系，十八个入口。',
  'The original syllabus is here in full.': '完整保留原有知识大纲。', 'Interactive explanations are being built one topic at a time.': '交互式讲解按主题逐步完善。',
  'All layers': '全部层次', 'Model principles': '模型原理', 'Application intelligence': '应用智能', 'Model systems': '模型系统', 'Production engineering': '生产工程', 'Enterprise delivery': '企业交付',
  'L1 / Model principles': 'L1 / 模型原理', 'L2 / Application intelligence': 'L2 / 应用智能', 'L3 / Model systems': 'L3 / 模型系统', 'L4 / Production engineering': 'L4 / 生产工程', 'L5 / Enterprise delivery': 'L5 / 企业交付',
  'L1 · Model principles': 'L1 · 模型原理', 'L2 · Application intelligence': 'L2 · 应用智能', 'L3 · Model systems': 'L3 · 模型系统', 'L4 · Production engineering': 'L4 · 生产工程', 'L5 · Enterprise delivery': 'L5 · 企业交付',
  'Filter by layer': '按知识层次筛选', 'Search modules and syllabus topics': '搜索模块与知识点', 'Find a concept…': '搜索一个概念…',
  '18 modules · 1 interactive topic': '18 个模块 · 1 个交互主题', '1 topic ready': '1 个主题已上线', 'Planned': '待建设',
  'No modules match. Try “attention”, “RAG”, or a different layer.': '没有匹配的模块。试试“Attention”“RAG”或其他层次。',
  'Built to learn by doing.': '在动手实践中理解。', 'Inspired by the': '延续', 'Reinforcement Learning simulations': '强化学习交互实验',
  ': first build intuition, then inspect the mechanism, then connect it to engineering. Each finished topic will follow the same pattern.': '的学习方式：先建立直觉，再拆解机制，最后连接工程实践。后续主题也将采用相同结构。',
  'Read the learning roadmap ↗': '阅读学习路线 ↗', '← All modules': '← 全部模块', 'The framework': '知识体系', 'Framework modules': '知识体系模块',
  'One interactive topic ready': '1 个交互主题已上线', '1 interactive topic': '1 个交互主题', 'Interactive lessons planned': '交互课程待建设',
  'Interactive · Ready to explore': '交互实验 · 可以开始探索', 'Masks → Q/K/V → MHA, GQA & MQA.': '掩码 → Q/K/V → MHA、GQA 与 MQA。',
  'Three connected experiments. One mental model.': '三个关联实验，建立一个完整的理解。', 'This bench is ready for its first experiment.': '这个模块，等待第一个实验。',
  'The chapter outline is available below. Its detailed visual lessons have not been built yet.': '下方是已有章节大纲。详细的可视化课程尚未建设。',
  'Try the first attention lesson ↗': '先体验注意力课程 ↗', 'Original chapter outline': '原有章节大纲', 'The topics ahead.': '接下来要探索的主题。',
  'Read chapter source ↗': '阅读章节原文 ↗', 'Explore in attention ↗': '在注意力课程中探索 ↗', '← Previous module': '← 上一模块', 'Next module →': '下一模块 →',
  '← Module 02 outline': '← 模块 02 大纲', '404 · Unknown module or topic': '404 · 未知模块或主题', 'That topic isn’t on this bench.': '工作台中没有这个主题。',
  'Back to all modules →': '返回全部模块 →', 'The workbench couldn’t open.': '工作台暂时无法打开。', 'Open the syllabus ↗': '打开知识大纲 ↗',
  'LLM foundations': '大模型基础', 'Transformers & modern architectures': 'Transformer 与现代架构', 'Models & selection': '模型生态与选型',
  'Prompt & context engineering': '提示词与上下文工程', 'RAG & knowledge engineering': 'RAG 与知识工程', 'Agent systems': '智能体系统', 'MCP, A2A & tool protocols': 'MCP、A2A 与工具协议',
  'Fine-tuning & post-training': '微调与后训练', 'Inference & serving': '推理与服务', 'Distributed training & GPUs': '分布式训练与 GPU', 'Multimodal & realtime AI': '多模态与实时 AI',
  'Evals & measurement': '评测与度量', 'LLMOps & AgentOps': 'LLMOps 与 AgentOps', 'Safety & governance': '安全与治理', 'AI full-stack engineering': 'AI 全栈工程',
  'Enterprise integration': '企业集成', 'FDE & delivery': 'FDE 与交付', 'AI system design': 'AI 系统设计',
  'The mathematics, objectives, and lifecycle behind language models.': '语言模型背后的数学基础、学习目标与训练生命周期。',
  'Follow information through attention, position, and modern model blocks.': '跟随信息流，理解注意力、位置编码与现代模型结构。',
  'Compare capabilities and make model choices against real constraints.': '比较模型能力，在实际约束下做出选型。',
  'Design the instructions and context a model actually receives.': '设计模型实际接收的指令与上下文。', 'Turn documents into retrievable, grounded knowledge.': '把文档转化为可检索、有依据的知识。',
  'Connect planning, tools, state, and bounded execution.': '连接规划、工具、状态与有边界的执行。', 'Understand how agents discover tools and work across boundaries.': '理解智能体如何发现工具、跨系统协作。',
  'Adapt model behavior with data, low-rank updates, and preferences.': '利用数据、低秩更新与偏好学习调整模型行为。', 'Explore the path from prefill to efficient token generation.': '探索从预填充到高效生成 token 的全过程。',
  'Partition work, synchronize gradients, and account for GPU resources.': '拆分计算、同步梯度，核算 GPU 资源。', 'Build across text, images, audio, and realtime interaction.': '连接文本、图像、音频与实时交互。',
  'Measure quality, expose failures, and catch regressions.': '度量质量、暴露失败、发现回归。', 'Operate model and agent systems with observability and cost controls.': '通过可观测性与成本控制运营模型和智能体系统。',
  'Design for permissions, privacy, and adversarial inputs.': '在设计中考虑权限、隐私与对抗性输入。', 'Bring models into reliable, usable software.': '将模型融入可靠、好用的软件。',
  'Connect AI to enterprise data, identity, and workflows.': '连接 AI 与企业数据、身份及工作流。', 'Turn ambiguous needs into a validated, maintainable delivery.': '将模糊需求转化为经过验证、可维护的交付成果。',
  'Balance architecture, quality, latency, scale, and cost.': '权衡架构、质量、延迟、规模与成本。',
  'The first visual lesson': '第一个可视化主题', 'Attention,': '注意力，', 'made visible.': '看得见。',
  'Who can a token see? How does it decide what matters? And what changes when heads share a memory?': '一个 token 能看到谁？它如何分配权重？当注意力头共享记忆时，又会发生什么？',
  '3 live experiments': '3 个交互实验', '2 intuition checks': '2 道理解自测', 'Module 02': '模块 02', 'In this lesson': '本课内容',
  'Visibility': '可见范围', 'The math': '计算过程', 'Shared memory': '共享缓存', 'Check yourself': '自测理解',
  '01 / VISIBILITY': '01 / 可见范围', 'Before attention decides': '在决定', 'how much': '读取多少', 'to read, a mask decides': '之前，掩码先决定', 'who': '谁', 'it is allowed to read.': '可以被读取。',
  'Change the visibility rule': '切换可见规则', 'Attention mask': '注意力掩码', 'Causal': '因果', 'Bidirectional': '双向', 'Prefix': '前缀',
  'KEY POSITION →': '键的位置 →', 'Attention visibility matrix': '注意力可见矩阵', 'Allowed': '可读取', '× Blocked': '× 被屏蔽', 'Selected query row': '选中的查询行',
  'Inspect a query position': '选择一个查询位置', 'Query token': '查询 token', 'Try this': '动手试试',
  'Select “cat”, then switch from causal to prefix. Can it see “sat” now?': '选择“cat”，把掩码从因果改为前缀。现在能看到“sat”了吗？',
  'Rows ask. Columns answer.': '行提出查询，列提供信息。', '↺ Reset experiment': '↺ 重置实验', 'The rule': '规则是什么',
  'Causal:': '因果：', 'a position can read itself and earlier positions.': '每个位置只能读取自身及更早的位置。', 'Bidirectional:': '双向：', 'every position can read every other position.': '所有位置相互可见。',
  'Prefix:': '前缀：', 'the first three positions read one another; the suffix reads the prefix and its own causal history.': '前三个位置相互可见；后续位置能读取前缀和自身的因果历史。',
  'The consequence': '为什么重要', 'A causal mask prevents future-token leakage in next-token training. Blocked scores become −∞ before softmax, so their weights become zero. A prefix position cannot see the generated suffix.': '因果掩码防止下一 token 训练泄露未来信息。被屏蔽的分数在 softmax 前变为 −∞，因此权重为零。前缀位置不能看到生成的后缀。',
  'This illustrates self-attention masks, not a complete encoder–decoder architecture. Cross-attention separately reads the encoder’s outputs. Padding masks, which block padding positions, are not shown here.': '这里展示的是自注意力掩码，并非完整的编码器—解码器架构。交叉注意力单独读取编码器输出。用于屏蔽填充位置的 padding mask 在此未展示。',
  '02 / THE MATH': '02 / 计算过程', 'Turn a question into a mixture.': '从一个查询，到一份加权混合。', 'Queries and keys determine the weights. Values carry the information that gets mixed.': '查询与键决定权重，值携带被混合的信息。',
  'Query': '查询', 'Key': '键', 'Value': '值', 'What am I looking for?': '我要寻找什么？', 'What can I match against?': '有什么可以匹配？', 'What information will I pass on?': '我要传递什么信息？',
  'Attention equals softmax of scaled query key dot products plus mask, multiplied by values': '注意力等于查询与键的缩放点积加上掩码，经过 softmax 后乘以值',
  'In a real model, learned projections produce Q, K, and V from hidden states. Below, every vector is a deliberately invented two-dimensional example. These numbers are': '在真实模型中，学习得到的投影将隐藏状态变成 Q、K、V。下方所有向量都是人为设定的二维示例，这些数字',
  'not learned word meanings': '不代表模型学习到的词义', 'Follow the numbers': '逐步跟随计算', 'First coordinate of Q': 'Q 的第一维',
  'The second coordinate stays at 1. Here dₖ = 2. Change the query to change its matches.': '第二维保持为 1，这里 dₖ = 2。改变查询，就会改变匹配结果。',
  'Key token': '键 token', 'Weight': '权重', 'Weighted sum of values': '值向量的加权和', '↺ Reset query': '↺ 重置查询',
  'Switch the mask above to causal and select the first token. Its output must equal its own V, whatever Q you choose. Only one position is visible, so softmax gives it weight 1.': '将上方掩码设为因果，选择第一个 token。无论如何改变 Q，输出都必定等于它自身的 V。因为只有一个位置可见，softmax 给它的权重为 1。',
  'Why divide by √dₖ?': '为什么除以 √dₖ？', 'When query and key components have roughly unit variance, the dot product’s variance grows with dimension. Scaling helps prevent large logits from pushing softmax into a saturated regime.': '当查询与键各分量的方差约为 1 时，点积的方差会随维度增长。缩放有助于避免过大的 logit 使 softmax 进入饱和区域。',
  'Why more than one head?': '为什么需要多个头？', 'Each head learns different Q/K/V projections and can form a different mixture. Head outputs are concatenated and projected back into the model’s hidden dimension. This toy shows one head before that projection.': '每个头学习不同的 Q/K/V 投影，形成不同的信息混合。各头输出拼接后，再投影回模型的隐藏维度。这个示例只展示该投影之前的单个头。',
  'Weights describe information routing. They are not, by themselves, a complete explanation of a model’s reasoning. The calculation uses a stable softmax; displayed values are rounded.': '权重描述信息如何流动，本身不能完整解释模型推理。计算采用数值稳定的 softmax；界面显示值经过四舍五入。',
  '03 / SHARED MEMORY': '03 / 共享缓存', 'Many questions. Less to remember.': '查询可以很多，缓存可以更少。',
  'During decoding, cached keys and values save repeated computation. But the cache grows with the sequence—and with every KV head.': '解码时，缓存键和值可以避免重复计算。但缓存随序列长度增加，也随 KV 头的数量增加。',
  'Keep 8 query heads. Change KV sharing.': '保持 8 个查询头，改变 KV 共享方式。', 'Head architecture': '注意力头架构', 'Cached tokens per sequence': '每条序列缓存的 token 数', 'Batch size': '批大小',
  'KV cache memory comparison': 'KV 缓存内存对比', 'Calculated memory · not a performance benchmark': '理论内存计算 · 非性能基准测试', '↺ Reset comparison': '↺ 重置对比',
  'KV bytes = 2 × batch × tokens × layers × KV heads × head dimension × bytes per element': 'KV 字节数 = 2 × 批大小 × token 数 × 层数 × KV 头数 × 头维度 × 每元素字节数',
  'The factor of 2 counts both keys and values. This example fixes': '系数 2 对应键和值。本例固定为', '32 layers, head dimension 128, two-byte elements': '32 层、头维度 128、每元素 2 字节',
  ', and 8 query heads. GiB = bytes / 2³⁰. It assumes a uniform, uncompressed cache and excludes weights, activations, allocator overhead, and replication across devices.': '，以及 8 个查询头。GiB = 字节数 / 2³⁰。假设缓存均匀、未压缩，不包含权重、激活、内存分配开销及跨设备复制。',
  'What changes': '改变的是什么', 'uses 8 separate KV pairs. Our': '使用 8 对独立的 KV。本例中的', 'example uses 2 groups, each sharing one KV pair.': '分为 2 组，每组共享一对 KV。',
  'uses 1 pair for all 8 query heads. Each query head still computes its own attention weights.': '让全部 8 个查询头共享 1 对 KV。每个查询头仍然独立计算注意力权重。',
  'What doesn’t follow': '不能据此推断什么', 'Eight times less KV storage does not guarantee eight times faster generation. Quality and runtime depend on training, kernels, hardware, batching, and the rest of the model. Sharing heads is an architectural choice, not a serving-time switch for an unchanged checkpoint.': 'KV 存储减少到八分之一，并不保证生成速度提升八倍。质量和运行时间取决于训练、算子、硬件、批处理及模型的其他部分。共享头是架构选择，不能对未经改动的模型检查点在服务时随意切换。',
  '04 / CHECK YOURSELF': '04 / 理解自测', 'Make a prediction.': '先做一个预测。', 'Two small checks before you take the idea into code.': '在写代码之前，用两道小题检查理解。',
  'From intuition to implementation': '从直觉走向实现', 'Three things to take with you.': '带走这三个要点。', 'Verify visibility.': '验证可见性。', 'Check masks for future-token leakage and padding before trusting outputs.': '在相信输出之前，检查掩码是否泄露未来信息，是否正确屏蔽填充位置。',
  'Trace a tiny example.': '追踪一个最小示例。', 'Verify score scaling, softmax normalization, and the weighted sum before scaling up.': '先验证分数缩放、softmax 归一化与加权求和，再扩大规模。',
  'Budget the cache.': '估算缓存预算。', 'Use the checkpoint’s actual KV-head count, expected context, and concurrency. Measure runtime separately.': '使用检查点的实际 KV 头数、预期上下文长度与并发量。运行时间需单独测量。',
  'The runnable math is in': '可运行的计算代码在', '. The local checks cover mask boundaries, normalization, a hand-calculated output, and cache scaling.': '中。本地检查覆盖掩码边界、归一化、手算输出及缓存缩放。',
  'Primary sources · reviewed October 17, 2026': '一手资料 · 核对日期：2026 年 10 月 17 日', 'Go to the originals.': '阅读原始论文。',
  'Vaswani et al. · scaled dot-product & multi-head attention': 'Vaswani 等 · 缩放点积与多头注意力', 'Shazeer · shared keys and values for decoding': 'Shazeer · 在解码中共享键和值', 'Ainslie et al. · grouping query heads and the quality tradeoff': 'Ainslie 等 · 查询头分组与质量权衡',
  '← Back to the Module 02 outline': '← 返回模块 02 大纲', 'Browse all 18 modules →': '浏览全部 18 个模块 →',
  'Read the past and the present. Future positions are blocked.': '读取过去和当前位置，屏蔽未来位置。', 'Read every position. Information can flow in both directions.': '读取所有位置，信息可双向流动。',
  'The first 3 tokens form a bidirectional prefix. Later positions have causal visibility.': '前 3 个 token 组成双向可见的前缀，后续位置采用因果可见规则。',
  'QUERY HEADS': '查询头', 'KV PAIR READ BY EACH HEAD': '每个头读取的 KV 对',
  'Eight query heads, eight independent key/value pairs. Every head keeps its own KV cache.': '8 个查询头，8 对独立的键和值，每个头维护自己的 KV 缓存。',
  'Eight query heads, two key/value pairs. Every group of four query heads shares one KV pair.': '8 个查询头，2 对键和值，每 4 个查询头共享一对 KV。',
  'Eight query heads, one shared key/value pair. All query heads read the same cached keys and values.': '8 个查询头，1 对共享的键和值，所有查询头读取相同的 KV 缓存。',
  'The baseline: a separate KV pair per query head.': '基准：每个查询头拥有独立的一对 KV。',
  'With a causal mask, what is the output at the first token?': '使用因果掩码时，第一个 token 的输出是什么？', 'Its own value vector': '它自身的值向量', 'The average of every value': '所有值向量的平均值', 'Always the zero vector': '始终为零向量',
  'Keep the batch and context fixed. Going from 8 KV heads to 2 makes this cache…': '批大小与上下文不变，KV 头从 8 个改为 2 个，缓存会……', '2× smaller': '缩小到二分之一', '4× smaller': '缩小到四分之一', '8× smaller': '缩小到八分之一',
  'Choose an answer to check your intuition.': '选择一个答案，检查你的理解。',
  'Correct. Only the first token is visible. Softmax over one allowed score is 1, so the output is exactly V₁.': '正确。只有第一个 token 可见。对单个允许分数做 softmax，结果为 1，因此输出恰好为 V₁。',
  'Try again. Only the first token is visible. Softmax over one allowed score is 1, so the output is exactly V₁.': '再试一次。只有第一个 token 可见。对单个允许分数做 softmax，结果为 1，因此输出恰好为 V₁。',
  'Correct. Cache storage is linear in the number of KV heads. 8 ÷ 2 = 4. This does not predict a 4× runtime improvement.': '正确。缓存存储与 KV 头数成正比。8 ÷ 2 = 4。但这并不意味着速度提升 4 倍。',
  'Try again. Cache storage is linear in the number of KV heads. 8 ÷ 2 = 4. This does not predict a 4× runtime improvement.': '再试一次。缓存存储与 KV 头数成正比。8 ÷ 2 = 4。但这并不意味着速度提升 4 倍。',
};

export function translate(text) {
  if (language !== 'zh') return text;
  const trimmed = text.trim();
  let translated = phrases[trimmed];
  if (!translated) {
    translated = trimmed
      .replace(/^(\d+) syllabus topics · (P\d)$/, '$1 个大纲知识点 · $2')
      .replace(/^(\d+) topics$/, '$1 个主题')
      .replace(/^(\d+) modules?$/, '$1 个模块')
      .replace(/^(\d+) modules? matching “(.+)”$/, '$1 个模块匹配“$2”')
      .replace(/^MODULE (\d+) \/ (P\d)$/, '模块 $1 / $2')
      .replace(/^Inspect query (\d+), (.+)$/, '查看查询 $1，$2')
      .replace(/^Query (\d+) (.+), key (\d+) (.+): (allowed|blocked)\. Inspect this query row\.$/, (_, a, b, c, d, state) => `查询 ${a} ${b}，键 ${c} ${d}：${state === 'allowed' ? '可读取' : '被屏蔽'}。查看此查询行。`)
      .replace(/^can read$/, '可读取')
      .replace(/^(\d+) of 6$/, '6 个位置中的 $1 个')
      .replace(/^positions\.$/, '。')
      .replace(/^\(blocked\)$/, '（被屏蔽）')
      .replace(/^(causal|bidirectional|prefix) · query (\d+): (.+)$/, (_, mode, n, token) => `${{ causal: '因果', bidirectional: '双向', prefix: '前缀' }[mode]} · 查询 ${n}：${token}`)
      .replace(/^Q = (.+)\. Same mask and query position as experiment 01\.$/, 'Q = $1。使用与实验 01 相同的掩码和查询位置。')
      .replace(/^Visible weights sum to (.+) \(before display rounding\)\.$/, '可见位置的权重之和为 $1（显示值舍入之前）。')
      .replace(/^(\d+) query heads? sharing$/, '$1 个查询头共享')
      .replace(/^(\d+) distinct KV pairs? stored\. Repeated KV labels above indicate the same shared pair\.$/, '共存储 $1 对不同的 KV。上方重复的 KV 标签代表同一对共享缓存。')
      .replace(/^(\d+) sequences?$/, '$1 条序列')
      .replace(/^(\d+) KV heads?$/, '$1 个 KV 头')
      .replace(/^(.+)× smaller KV cache than MHA · (.+)% less storage\.$/, 'KV 缓存为 MHA 的 1/$1 · 节省 $2% 存储。')
      .replace(/^(.+) tokens × (\d+) sequences? · (\d+) KV heads?$/, '$1 个 token × $2 条序列 · $3 个 KV 头');
  }
  return translated === trimmed ? text : text.replace(trimmed, translated);
}

export function localize(root = document.body) {
  if (language === 'zh') {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      if (!['SCRIPT', 'STYLE'].includes(walker.currentNode.parentElement?.tagName)) nodes.push(walker.currentNode);
    }
    for (const node of nodes) { const result = translate(node.textContent); if (result !== node.textContent) node.textContent = result; }
    root.querySelectorAll('[placeholder], [aria-label], [title]').forEach((element) => {
      for (const attr of ['placeholder', 'aria-label', 'title']) if (element.hasAttribute(attr)) element.setAttribute(attr, translate(element.getAttribute(attr)));
    });
  }
  // Keep language in shareable URLs and across every module navigation.
  root.querySelectorAll('a[href]').forEach((link) => {
    const raw = link.getAttribute('href');
    if (raw.startsWith('#')) return;
    const url = new URL(raw, location.href);
    if (url.origin === location.origin && (url.pathname === location.pathname || url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'))) {
      url.searchParams.set('lang', language);
      link.href = url.pathname + url.search + url.hash;
    }
  });
}
