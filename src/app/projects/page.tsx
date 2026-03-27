import ProjectCard from "@/components/ProjectCard";

const projects = [
  {
    title: "Aloha Robot Policy via vt-refine",
    description:
      "An end-to-end robot learning pipeline for the Aloha bimanual platform using a visual tokenizer refinement strategy (vt-refine). The system fine-tunes a Vision-Language-Action transformer on a compact set of teleoperation demos, dramatically reducing the data requirements for high-dexterity assembly policies. Evaluated on peg insertion, cable routing, and garment folding tasks.",
    stack: ["PyTorch", "ACT", "ROS 2", "JAX", "Aloha"],
    githubUrl: "https://github.com",
    imageSrc: "https://placehold.co/256x144/161c18/3d5048?text=Aloha+Policy",
  },
  {
    title: "LeRobot SO-101 Framework",
    description:
      "A comprehensive software framework for the LeRobot SO-101 low-cost robotic arm. Implements a modular policy training loop compatible with Diffusion Policy, ACT, and π₀ architectures. Includes hardware abstraction layers for servo control, a real-time teleoperation interface, and a dataset recording pipeline with automatic episode filtering and annotation.",
    stack: ["Python", "LeRobot", "HuggingFace", "PyTorch", "OpenCV"],
    githubUrl: "https://github.com",
    imageSrc: "https://placehold.co/256x144/161c18/3d5048?text=LeRobot+SO-101",
  },
  {
    title: "Diffusion Policy for Cloth Manipulation",
    description:
      "Adapts the Diffusion Policy framework for garment manipulation tasks using tactile sensor fusion. Integrates DIGIT tactile sensors with RGB-D observations to condition the denoising network, achieving significant improvements over vision-only baselines on T-shirt folding and towel straightening tasks.",
    stack: ["Diffusion Policy", "PyTorch", "DIGIT", "ROS 2", "Isaac Sim"],
    githubUrl: "https://github.com",
    imageSrc: "https://placehold.co/256x144/161c18/3d5048?text=Cloth+Policy",
  },
  {
    title: "Sim-to-Real Transfer Benchmark",
    description:
      "A reproducible benchmark for evaluating sim-to-real transfer methods on bimanual tasks. Provides standardized MuJoCo simulation environments paired with real-world task setups, along with evaluation protocols and leaderboard infrastructure for the community.",
    stack: ["MuJoCo", "IsaacLab", "Python", "FastAPI", "Next.js"],
    githubUrl: "https://github.com",
    imageSrc: "https://placehold.co/256x144/161c18/3d5048?text=Sim2Real",
  },
];

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
