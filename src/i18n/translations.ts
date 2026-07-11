export type Lang = "en" | "zh";

/** Per-language string. */
export type L = Record<Lang, string>;

/* ─── UI labels & prose (no language-invariant fields) ─────────────────────── */
export const dict = {
  en: {
    nav: { home: "Home", projects: "Projects", about: "About Me", logo: "Zeyu Lai" },
    hero: {
      name: "Zeyu (Michael) Lai",
      bio: "Undergraduate Student interested in world models, reinforcement learning, and generalist policy learning",
      cv: "CV",
    },
    education: { heading: "Education" },
    experience: { heading: "Experience" },
    publications: { heading: "Research & Publications", readPaper: "Read Paper" },
    projects: {
      heading: "Projects",
      subtitle:
        "Selected technical projects in robot learning, hardware integration, and machine learning infrastructure.",
      viewOnGitHub: "View on GitHub",
    },
    hobbies: {
      about: "About",
      thingsILove: "Things I Love",
      writing: "Writing",
      empty: "Nothing here yet.",
      bio: [
        "Hi, I'm Zeyu Lai—I go by Michael—a first-year undergraduate at UC San Diego, working on a stubborn stammer, leaving my hair alone, and surviving on matcha with help from two very reliable plushies.",
        "I have a habit of dragging chatbots into infinite, good-natured arguments until I truly understand the concept behind it. I'm also constantly trying to wrap my head around the latest shifts in generative models and robotic architectures. Rather than just reading the theory, my main goal is to get my hands as dirty as possible with actual hardware and code, building alongside and learning from the greatest minds I can find.",
        "I also have what you might call “spiky attention”—or, if we're being generous, breadth-first thinking. My brain simply refuses to focus on just one thing at a time; for me to even feel like I'm actually working, I need to be juggling several tasks at once. I used to hate this about myself and fought it constantly, but I've slowly come to accept that I can't defy my own wiring: a little chaotic, but it turns out this is exactly how I operate best.",
      ],
      categories: {
        All: "All",
        Technical: "Technical",
        Personal: "Personal",
        "Random Ideas": "Random Ideas",
      },
      photos: {
        Sudoku: "Sudoku",
        Engineering: "Engineering",
        Matcha: "Matcha",
        Plushies: "Plushies",
        Multitasking: "Multitasking",
        BFRB: "BFRB",
      },
    },
    langToggle: { label: "切换到中文", short: "中" },
  },
  zh: {
    nav: { home: "首页", projects: "项目", about: "关于我", logo: "赖泽宇" },
    hero: {
      name: "赖泽宇 (Michael)",
      bio: "本科生，研究方向包括世界模型、强化学习与通用策略学习",
      cv: "简历",
    },
    education: { heading: "教育经历" },
    experience: { heading: "研究与工作经历" },
    publications: { heading: "研究与论文", readPaper: "阅读论文" },
    projects: {
      heading: "项目",
      subtitle: "在机器人学习、硬件集成与机器学习基础设施方向上的精选技术项目。",
      viewOnGitHub: "在 GitHub 查看",
    },
    hobbies: {
      about: "关于",
      thingsILove: "我喜欢的",
      writing: "写作",
      empty: "暂无内容。",
      bio: [
        "你好，我是赖泽宇（大家叫我 Michael），加州大学圣地亚哥分校的一年级本科生。我正在对付顽固的口吃、努力管住想拔头发的手，并靠抹茶和两只非常靠谱的玩偶撑过每一天。",
        "我有个习惯：喜欢把聊天机器人拖进无休止却友好的辩论，直到真正理解背后的概念为止。我也一直在努力搞懂生成模型与机器人架构的最新进展。比起只读理论，我更想尽可能地把手弄脏——直接上手真实的硬件与代码，与我能找到的最厉害的人一起构建、向他们学习。",
        "我还有一种可以称为“尖峰式注意力”的特质——说得好听点，是广度优先的思维方式。我的大脑就是拒绝一次只专注于一件事；只有同时处理好几项任务，我才真的觉得自己在工作。我曾经很讨厌这一点并不断与之对抗，但我慢慢接受了自己无法违抗大脑的构造：虽然有点混乱，但事实证明这正是我状态最好的方式。",
      ],
      categories: {
        All: "全部",
        Technical: "技术",
        Personal: "个人",
        "Random Ideas": "随想",
      },
      photos: {
        Sudoku: "数独",
        Engineering: "工程",
        Matcha: "抹茶",
        Plushies: "玩偶",
        Multitasking: "多任务",
        BFRB: "BFRB",
      },
    },
    langToggle: { label: "Switch to English", short: "EN" },
  },
} as const;

/* ─── Structured data: language-invariant fields kept single-sourced ───────── */

export interface EducationItem {
  degree: L;
  institution: L;
  period: string;
  description?: L;
}

export const educationData: EducationItem[] = [
  {
    degree: {
      en: "B.S. in Electrical Engineering & Data Science",
      zh: "电气工程与数据科学 · 理学学士",
    },
    institution: { en: "UC San Diego", zh: "加州大学圣地亚哥分校" },
    period: "2025 — 2029",
  },
];

export interface ExperienceItem {
  role: L;
  org: L;
  period: string;
  detail: L;
}

export const experienceData: ExperienceItem[] = [
  {
    role: { en: "Embodied AI Undergraduate Researcher", zh: "具身智能本科研究员" },
    org: {
      en: "Hao Su's AI Lab — UC San Diego",
      zh: "苏昊人工智能实验室 · 加州大学圣地亚哥分校",
    },
    period: "Mar 2026 — Present",
    detail: {
      en: "Developing dexterous teleoperation frameworks, sim-to-real pipelines, and predictive world models.",
      zh: "开发灵巧遥操作框架，执行高保真的仿真到现实（sim-to-real）迁移，并构建预测性世界模型。",
    },
  },
  {
    role: { en: "Undergraduate Researcher", zh: "本科研究员" },
    org: {
      en: "MURO Lab — UC San Diego",
      zh: "MURO 实验室 · 加州大学圣地亚哥分校",
    },
    period: "Oct 2025 — May 2026",
    detail: {
      en: "Developing multi-robot map-merging infrastructure for autonomous TurtleBot4 fleets.",
      zh: "为自主 TurtleBot4 集群开发多机器人地图融合基础设施。",
    },
  },
  {
    role: { en: "Member — Perception & Planning", zh: "成员 · 感知与规划" },
    org: {
      en: "Triton AI — UC San Diego",
      zh: "Triton AI · 加州大学圣地亚哥分校",
    },
    period: "Oct 2025 — Present",
    detail: {
      en: "LiDAR–camera fusion for FTENTH and path planning for an autonomous go-kart.",
      zh: "为 F1TENTH 实现激光雷达与相机融合，并为自主卡丁车设计路径规划。",
    },
  },
];

export interface PublicationItem {
  title: L;
  venue: string;
  year: string;
  abstract: L;
  link: string;
  imageSrc?: string;
}

export const publicationsData: PublicationItem[] = [
  {
    title: {
      en: "Diving into the virtual realm: Exploring the mechanics of virtual reality",
      zh: "潜入虚拟世界：探索虚拟现实的机制",
    },
    venue: "Applied and Computational Engineering",
    year: "2024",
    abstract: {
      en: "This research explores the fundamental mechanics of virtual reality environments, focusing on computational engineering principles to enhance user immersion and system performance within virtual realms.",
      zh: "本研究探讨虚拟现实环境的基本机制，聚焦于计算工程原理，以提升虚拟世界中的用户沉浸感与系统性能。",
    },
    link: "https://www.researchgate.net/publication/377831494_Diving_into_the_virtual_realm_Exploring_the_mechanics_of_virtual_reality",
    imageSrc: "https://placehold.co/208x117/161c18/3d5048?text=ACE+2024",
  },
];

export interface ProjectItem {
  title: L;
  year: string;
  description: L;
  stack: string[];
  githubUrl: string;
  imageSrc?: string;
}

export const projectsData: ProjectItem[] = [
  {
    title: {
      en: "s-motf: Latent World-Action Model (L-WAM)",
      zh: "s-motf：潜在世界-动作模型（L-WAM）",
    },
    year: "2026",
    description: {
      en: "Architected a 50 Hz proprioceptive quadruped controller (Unitree Go1, MuJoCo) around a Mixture-of-Transformers backbone with a 3-step rectified flow-matching action head and prior/posterior latent-plan alignment. Distilled three PPO specialists — locomotion, hind-leg balance, fall recovery — into a single command-conditioned policy retaining 83–96% of specialist return, where an equal-capacity MLP baseline collapsed on the multimodal skill (4.7× lower return, 4.1× shorter survival).",
      zh: "围绕混合 Transformer（Mixture-of-Transformers）主干，构建了 50 Hz 的本体感知四足控制器（Unitree Go1、MuJoCo），配备三步整流流匹配（rectified flow-matching）动作头与先验/后验潜在规划对齐。将运动、后腿平衡与摔倒恢复三个 PPO 专家策略蒸馏为单一的指令条件化策略，保留了专家 83–96% 的回报；而同等容量的 MLP 基线在多模态技能上崩溃（回报低 4.7 倍，存活时间短 4.1 倍）。",
    },
    stack: [
      "Python",
      "PyTorch",
      "MuJoCo",
      "Unitree Go1",
      "PPO",
      "Flow Matching",
      "Mixture-of-Transformers",
      "World Models",
    ],
    githubUrl: "https://github.com/Unieggy/S-MOTF",
    imageSrc: "/smotf.png",
  },
  {
    title: {
      en: "Baton: Multi-Agent Handoff & Orchestration Framework",
      zh: "Baton：多智能体交接与编排框架",
    },
    year: "2026",
    description: {
      en: "Engineered a local control framework to hot-swap active CLI coding sessions (Claude Code ↔ Codex) mid-task. Captured terminal streams via node-pty/xterm.js and distilled unverified workspace states into provider-neutral handoff packets to bypass rate limits without task re-explanation.",
      zh: "构建了一个本地控制框架，可在任务进行中热切换活跃的 CLI 编码会话（Claude Code ↔ Codex）。通过 node-pty/xterm.js 捕获终端流，并将未经验证的工作区状态提炼为与供应商无关的交接数据包，从而绕过速率限制且无需重新说明任务。",
    },
    stack: [
      "TypeScript",
      "Node.js",
      "node-pty",
      "xterm.js",
      "Multi-Agent Systems",
      "CLI Tooling",
    ],
    githubUrl: "https://github.com/Unieggy/Baton",
    imageSrc: "/interface.png",
  },
  {
    title: { en: "LeRobot SO-101 VLA Policy", zh: "LeRobot SO-101 VLA 策略" },
    year: "2026",
    description: {
      en: "Currently developing an end-to-end Vision-Language-Action (VLA) policy pipeline for the LeRobot SO-101 robotic arm. The project focuses on data collection, imitation learning, and deploying state-of-the-art transformer architectures for continuous robotic manipulation tasks.",
      zh: "正在为 LeRobot SO-101 机械臂开发端到端的视觉-语言-动作（VLA）策略流程。项目聚焦于数据采集、模仿学习，以及部署前沿的 Transformer 架构以完成连续机器人操作任务。",
    },
    stack: ["Python", "PyTorch", "LeRobot", "Hugging Face", "VLA Models", "SO-101 Arm"],
    githubUrl: "https://github.com/Unieggy/roboticarm-project",
    imageSrc: "https://placehold.co/256x144/161c18/3d5048?text=LeRobot+VLA",
  },
  {
    title: {
      en: "RL & Path Planning Algorithms (Gymnasium)",
      zh: "强化学习与路径规划算法（Gymnasium）",
    },
    year: "2026",
    description: {
      en: "Developed a clean, extensible repository for training classic Gymnasium control tasks. Implemented classical path planning (A*, RRT*), state estimation (Kalman Filters), and a suite of Reinforcement Learning algorithms including PPO, DQN, and Tabular Q-Learning.",
      zh: "构建了一个简洁、可扩展的仓库，用于训练经典 Gymnasium 控制任务。实现了经典路径规划（A*、RRT*）、状态估计（卡尔曼滤波），以及包括 PPO、DQN 和表格型 Q-Learning 在内的一系列强化学习算法。",
    },
    stack: ["Python", "PyTorch", "Gymnasium", "Reinforcement Learning"],
    githubUrl: "https://github.com/Unieggy/rl-algs-and-random-algs",
    imageSrc: "/rl:pathplanning.png",
  },
  {
    title: {
      en: "Isaac RL Tasks: Custom Manipulation Environments",
      zh: "Isaac 强化学习任务：自定义操作环境",
    },
    year: "2026",
    description: {
      en: "A collection of custom reinforcement learning environments built on NVIDIA's IsaacGymEnvs. Designed to port manipulation tasks from established simulators (ManiSkill, RoboSuite) into Isaac Gym's massively parallel GPU simulation for extremely fast policy training at scale.",
      zh: "一组基于 NVIDIA IsaacGymEnvs 构建的自定义强化学习环境。旨在将已有模拟器（ManiSkill、RoboSuite）中的操作任务移植到 Isaac Gym 的大规模并行 GPU 仿真中，以实现极快的大规模策略训练。",
    },
    stack: ["Python", "Isaac Gym", "Reinforcement Learning", "PyTorch", "GPU Simulation"],
    githubUrl: "https://github.com/Unieggy/isaac-rl-tasks",
    imageSrc: "/issacgym.jpg",
  },
  {
    title: { en: "Uniq: Intelligent Browser Automation", zh: "Uniq：智能浏览器自动化" },
    year: "2026",
    description: {
      en: "Engineered an autonomous browser agent that uses Google Gemini 3.0 Flash to decompose user tasks into multi-step plans. Developed a resilient Agent Loop featuring semantic auto-scroll, graduated failure recovery, and DOM-based interactive region detection. Built during the Google Gemini Hackathon 2026.",
      zh: "打造了一个自主浏览器智能体，利用 Google Gemini 3.0 Flash 将用户任务分解为多步计划。开发了具备语义自动滚动、渐进式故障恢复与基于 DOM 的交互区域检测的稳健 Agent 循环。构建于 2026 年 Google Gemini 黑客松。",
    },
    stack: ["TypeScript", "Node.js", "Playwright", "Gemini 3 Flash", "WebSockets", "SQLite"],
    githubUrl: "https://github.com/Unieggy/uniq",
    imageSrc: "/uniq.png",
  },
  {
    title: {
      en: "English–Chinese NMT with Transformer",
      zh: "基于 Transformer 的英汉神经机器翻译",
    },
    year: "2025",
    description: {
      en: "Built a Transformer-based neural machine translation system from scratch. Trained on Hugging Face's opus-100 parallel dataset. Includes a Gradio app for quick interactive translation and auto-detects Google Colab paths for seamless cloud training.",
      zh: "从零构建了基于 Transformer 的神经机器翻译系统，在 Hugging Face 的 opus-100 平行语料上训练。包含用于快速交互翻译的 Gradio 应用，并可自动检测 Google Colab 路径以实现无缝云端训练。",
    },
    stack: ["Python", "PyTorch", "Transformers", "SentencePiece", "Hugging Face", "Gradio"],
    githubUrl: "https://github.com/Unieggy/transformer-nmt-en-zh",
    imageSrc: "/transformer.png",
  },
  {
    title: {
      en: "Voice-Controlled Ground-Aerial Robot",
      zh: "语音控制的地空两栖机器人",
    },
    year: "2025",
    description: {
      en: "Designed a hybrid, multi-modal vehicle with a detachable drone basket and retractable arms. Built a system of four coordinated codebases integrating an ESP32-S3 and Arduino UNO. It transcribes audio via Deepgram and uses OpenAI GPT-4o to parse commands, executing real wheel/propeller motion in ~1 second.",
      zh: "设计了一款混合式多模态载具，配有可拆卸的无人机吊篮与可伸缩机械臂。构建了整合 ESP32-S3 与 Arduino UNO 的四套协同代码库。通过 Deepgram 转写音频，并使用 OpenAI GPT-4o 解析指令，在约 1 秒内执行真实的车轮/螺旋桨运动。",
    },
    stack: ["C++", "Node.js", "ESP32-S3", "Deepgram API", "OpenAI API", "Arduino"],
    githubUrl: "https://github.com/Unieggy/voice-controlled-ground-aerial-robot",
    imageSrc: "/vehicle.jpg",
  },
  {
    title: { en: "Gesture-Based Brightness Adjuster", zh: "基于手势的亮度调节器" },
    year: "2024",
    description: {
      en: "Created a contact-free webcam tool to control screen brightness using OpenCV and MediaPipe. Continuously maps thumb-index pinch distance to brightness levels, using a pinky-curl gesture as a commit trigger. Won 1st place out of 36 participants at the BASIS national hackathon.",
      zh: "使用 OpenCV 与 MediaPipe 打造了一款非接触式网络摄像头工具来控制屏幕亮度。持续将拇指-食指的捏合距离映射到亮度等级，并以小指弯曲手势作为确认触发。在 BASIS 全国黑客松中于 36 名参赛者中夺得第一。",
    },
    stack: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    githubUrl: "https://github.com/Unieggy/gesturebased-brightness-controller",
    imageSrc: "/handtrack.jpg",
  },
  {
    title: { en: "Monte Carlo Ising Simulation", zh: "蒙特卡洛伊辛模型模拟" },
    year: "2024",
    description: {
      en: "Simulated 2D Ising spin-lattice models using the Metropolis Monte Carlo method. Explored phase transitions, total energy calculations, and equilibrium states in statistical mechanics. Conducted as part of Cetus Research under PI Prof. Erik Luijten at Northwestern University.",
      zh: "使用 Metropolis 蒙特卡洛方法模拟二维伊辛自旋点阵模型，探索统计力学中的相变、总能量计算与平衡态。作为西北大学 Cetus 研究项目的一部分，导师为 Erik Luijten 教授。",
    },
    stack: ["Python", "NumPy", "Matplotlib", "Statistical Physics", "Algorithms"],
    githubUrl: "https://github.com/Unieggy/ising-montecarlo-sim",
    imageSrc: "/monte-carlo-ising-9.png",
  },
];
