import ProjectCard from "@/components/ProjectCard";
const projects = [
  {
    title: "LeRobot SO-101 VLA Policy",
    year: "2026",
    description:
      "Currently developing an end-to-end Vision-Language-Action (VLA) policy pipeline for the LeRobot SO-101 robotic arm. The project focuses on data collection, imitation learning, and deploying state-of-the-art transformer architectures for continuous robotic manipulation tasks.",
    stack: ["Python", "PyTorch", "LeRobot", "Hugging Face", "VLA Models", "SO-101 Arm"],
    githubUrl: "https://github.com/Unieggy/roboticarm-project", 
    imageSrc: "https://placehold.co/256x144/161c18/3d5048?text=LeRobot+VLA",
  },
  {
    title: "RL & Path Planning Algorithms (Gymnasium)",
    year: "2026",
    description:
      "Developed a clean, extensible repository for training classic Gymnasium control tasks. Implemented classical path planning (A*, RRT*), state estimation (Kalman Filters), and a suite of Reinforcement Learning algorithms including PPO, DQN, and Tabular Q-Learning.",
    stack: ["Python", "PyTorch", "Gymnasium", "Reinforcement Learning"],
    githubUrl: "https://github.com/Unieggy/rl-algs-and-random-algs", 
    imageSrc: "/rl:pathplanning.png",
  },
  {
    title: "Isaac RL Tasks: Custom Manipulation Environments",
    year: "2026",
    description:
      "A collection of custom reinforcement learning environments built on NVIDIA's IsaacGymEnvs. Designed to port manipulation tasks from established simulators (ManiSkill, RoboSuite) into Isaac Gym's massively parallel GPU simulation for extremely fast policy training at scale.",
    stack: ["Python", "Isaac Gym", "Reinforcement Learning", "PyTorch", "GPU Simulation"],
    githubUrl: "https://github.com/Unieggy/isaac-rl-tasks", 
    imageSrc: "/issacgym.jpg",
  },
  {
    title: "Uniq: Intelligent Browser Automation",
    year: "2026",
    description:
      "Engineered an autonomous browser agent that uses Google Gemini 3.0 Flash to decompose user tasks into multi-step plans. Developed a resilient Agent Loop featuring semantic auto-scroll, graduated failure recovery, and DOM-based interactive region detection. Built during the Google Gemini Hackathon 2026.",
    stack: ["TypeScript", "Node.js", "Playwright", "Gemini 3 Flash", "WebSockets", "SQLite"],
    githubUrl: "https://github.com/Unieggy/uniq",
    imageSrc: "/uniq.png",
  },
  {
    title: "English–Chinese NMT with Transformer",
    year: "2025",
    description:
      "Built a Transformer-based neural machine translation system from scratch. Trained on Hugging Face's opus-100 parallel dataset. Includes a Gradio app for quick interactive translation and auto-detects Google Colab paths for seamless cloud training.",
    stack: ["Python", "PyTorch", "Transformers", "SentencePiece", "Hugging Face", "Gradio"],
    githubUrl: "https://github.com/Unieggy/transformer-nmt-en-zh", 
    imageSrc: "/transformer.png",
  },
  {
    title: "Voice-Controlled Ground-Aerial Robot",
    year: "2025",
    description:
      "Designed a hybrid, multi-modal vehicle with a detachable drone basket and retractable arms. Built a system of four coordinated codebases integrating an ESP32-S3 and Arduino UNO. It transcribes audio via Deepgram and uses OpenAI GPT-4o to parse commands, executing real wheel/propeller motion in ~1 second.",
    stack: ["C++", "Node.js", "ESP32-S3", "Deepgram API", "OpenAI API", "Arduino"],
    githubUrl: "https://github.com/Unieggy/voice-controlled-ground-aerial-robot",
    imageSrc: "/vehicle.jpg",
  },
  {
    title: "Gesture-Based Brightness Adjuster",
    year: "2024",
    description:
      "Created a contact-free webcam tool to control screen brightness using OpenCV and MediaPipe. Continuously maps thumb-index pinch distance to brightness levels, using a pinky-curl gesture as a commit trigger. Won 1st place out of 36 participants at the BASIS national hackathon.",
    stack: ["Python", "OpenCV", "MediaPipe", "Computer Vision"],
    githubUrl: "https://github.com/Unieggy/gesturebased-brightness-controller",
    imageSrc: "/handtrack.jpg",
  },
  {
    title: "Monte Carlo Ising Simulation",
    year: "2024",
    description:
      "Simulated 2D Ising spin-lattice models using the Metropolis Monte Carlo method. Explored phase transitions, total energy calculations, and equilibrium states in statistical mechanics. Conducted as part of Cetus Research under PI Prof. Erik Luijten at Northwestern University.",
    stack: ["Python", "NumPy", "Matplotlib", "Statistical Physics", "Algorithms"],
    githubUrl: "https://github.com/Unieggy/ising-montecarlo-sim",
    imageSrc: "/monte-carlo-ising-9.png",
  },
]

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 pb-24">
      <div className="mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-parchment mb-3">
          Projects
        </h1>
        <p className="text-ash text-base max-w-lg">
          Selected technical projects in robot learning, hardware integration, and
          machine learning infrastructure.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {projects.map((project, i) => (
          <ProjectCard key={i} {...project} />
        ))}
      </div>
    </div>
  );
}
