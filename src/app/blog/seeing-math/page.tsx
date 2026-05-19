import "katex/dist/katex.min.css";
import katex from "katex";
import Link from "next/link";
import { TwoStreamBrain, GridPlaceCells, EigenvalueViz } from "@/components/blog/ClientVisuals";

function Math({
  children,
  display = false,
}: {
  children: string;
  display?: boolean;
}) {
  const html = katex.renderToString(children, {
    displayMode: display,
    throwOnError: false,
  });
  return (
    <span
      dangerouslySetInnerHTML={{ __html: html }}
      style={display ? { display: "block" } : undefined}
    />
  );
}

export default function SeeingMathPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/hobbies"
        className="text-ash text-sm hover:text-parchment transition-colors duration-200 mb-12 inline-block"
      >
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <p className="text-ash text-sm mb-3">May 2026 · Random Ideas</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-parchment leading-snug">
          How &ldquo;Seeing&rdquo; Math Hacks Your Brain&rsquo;s Hardware
        </h1>
      </div>

      <div className="border-t border-surface-border/40 mb-12" />

      {/* ── Section: The "Human Hard Drive" Fallacy ── */}
      <h3
        className="font-heading text-lg font-normal text-parchment mt-12 mb-4"
        style={{ letterSpacing: "0.03em" }}
      >
        The &ldquo;Human Hard Drive&rdquo; Fallacy
      </h3>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        I used to approach high school math with this sense of dread. Not because the numbers
        themselves were intimidating, but because I knew the class was going to eat up a massive
        chunk of my brain&rsquo;s memory storage.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        It wasn&rsquo;t until 12th grade that things started to shift. My school didn&rsquo;t
        heavily enforce the usual grind of AP classes in that final year. But stepping off that
        treadmill made me stop and ask myself a terrifying question:{" "}
        <em>Do I actually understand any of the stuff I&rsquo;m learning?</em>
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        That realization turned my senior summer into probably the most rewarding period of my
        life. I was reading a bunch of CS, math, and physics textbooks. I have to admit, the
        beginning was brutal. A lot of these texts are obscure af. (Pro-tip: lean heavily on the AI
        tools around you; they are absolute lifesavers).
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        But as I read, a massive common theme started jumping out at me: the authors who actually
        knew how to teach always stressed the{" "}
        <strong className="text-parchment font-medium">geometric intuition</strong> behind the
        concepts.
      </p>

      {/* ── Section: Your Brain is a Spatial Engine ── */}
      <h3
        className="font-heading text-lg font-normal text-parchment mt-12 mb-4"
        style={{ letterSpacing: "0.03em" }}
      >
        Your Brain is a Spatial Engine
      </h3>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        When you&rsquo;re looking down the heaps of endless quizzes, it&rsquo;s ineluctably
        tempting to treat learning like an effort to brute-force every tiny detail into your head
        and end up consuming an insane amount of brain power.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        The cognitive effort used to recall an abstract string of text versus recognizing a spatial
        pattern is vastly different.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        To understand why geometric intuition is a cheat code, we have to stop looking at math as
        a language, and start looking at our biology. Our brains did{" "}
        <strong className="text-parchment font-medium">not</strong> spend millions of years
        evolving to recite algebra; they evolved to navigate physical space.
      </p>

      {/* TwoStreamBrain */}
      <p className="text-xs tracking-widest uppercase text-ash mt-2 mb-0 text-center">
        visualization
      </p>
      <TwoStreamBrain />

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        When you learn math through rote memorization, you are putting 100% of the cognitive load
        on your working memory. You are treating your brain like a cheap flash drive. But when you
        map a concept geometrically, you engage in the so-called{" "}
        <strong className="text-parchment font-medium">Hippocampal Formation</strong>, specifically
        the <em>Grid Cells</em> and <em>Place Cells</em>. These neurons literally create a physical
        coordinate system in your mind.
      </p>

      {/* GridPlaceCells */}
      <p className="text-xs tracking-widest uppercase text-ash mt-2 mb-0 text-center">
        visualization
      </p>
      <GridPlaceCells />

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        This isn&rsquo;t just a metaphor; it&rsquo;s driven by hard neurocomputational math. In
        computational neuroscience, researchers model these grid cells using something called a{" "}
        <strong className="text-parchment font-medium">Continuous Attractor Network (CAN)</strong>.
        Basically, it&rsquo;s a mathematical model that explains how your brain maintains an
        internal GPS map even when your eyes are closed. The firing rate of a single neuron in this
        spatial map (<Math>{String.raw`s_i`}</Math>) is governed by:
      </p>

      {/* CAN equation */}
      <div className="my-8 overflow-x-auto py-4 flex justify-center">
        <Math display>
          {String.raw`\tau \frac{ds_i}{dt} = -s_i + f\!\left(\sum_j w_{ij} s_j + B_i\right)`}
        </Math>
      </div>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-3">
        Breaking this down:
      </p>

      <ul className="list-none space-y-2 mb-5">
        {[
          [
            String.raw`\tau`,
            "is the time constant — how quickly the neuron responds to input.",
          ],
          [
            String.raw`s_i`,
            "is the firing rate of the neuron at position i in the spatial map.",
          ],
          [
            String.raw`w_{ij}`,
            "are synaptic weights — stronger connections between nearby neurons in the map.",
          ],
          [String.raw`B_i`, "is an external velocity input — how fast you're moving through space."],
          [
            String.raw`f(\cdot)`,
            "is a nonlinear activation function that keeps the bump of activity stable.",
          ],
        ].map(([latex, desc], i) => (
          <li
            key={i}
            className="flex gap-3 text-parchment/80 text-sm leading-relaxed"
          >
            <span className="text-sage shrink-0">•</span>
            <span>
              <Math>{latex}</Math> — {desc}
            </span>
          </li>
        ))}
      </ul>

      {/* The Geometric Intuition */}
      <h4 className="font-sans font-semibold text-parchment text-base mt-8 mb-3">
        The Geometric Intuition
      </h4>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        The CAN maintains a stable &ldquo;bump&rdquo; of activity on a neural sheet. As you move
        through space, the velocity input <Math>{String.raw`B_i`}</Math> shifts this bump across
        the sheet, tracking your location. The synaptic weights{" "}
        <Math>{String.raw`w_{ij}`}</Math> are tuned so that nearby neurons excite each other (forming
        the bump) while distant neurons are inhibited (keeping it sharp). This is a geometric
        operation, not a lookup table.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        This physical realization is directly related to why you forget things. The neuroscientist
        Hermann Ebbinghaus formalized the{" "}
        <strong className="text-parchment font-medium">forgetting curve</strong>:
      </p>

      {/* Ebbinghaus equation */}
      <div className="my-8 overflow-x-auto py-4 flex justify-center">
        <Math display>{String.raw`R = e^{-\frac{t}{S}}`}</Math>
      </div>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Where <Math>R</Math> is retention, <Math>t</Math> is time, and{" "}
        <Math>S</Math> is the &ldquo;strength&rdquo; of the memory. Rote memorization keeps{" "}
        <Math>S</Math> small: one rehearsal, one encoding, and it decays fast. But Hebbian
        learning (neurons that fire together wire together) effectively increases{" "}
        <Math>S</Math> by embedding the memory in a richer, multi-modal network. Geometric
        intuition is exactly that: a spatial scaffold that multiplies the number of neural
        pathways encoding the same concept.
      </p>

      {/* ── Section: Stop Row-Reducing. Start Warping Space. ── */}
      <h3
        className="font-heading text-lg font-normal text-parchment mt-12 mb-4"
        style={{ letterSpacing: "0.03em" }}
      >
        Stop Row-Reducing. Start Warping Space.
      </h3>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Linear algebra is the clearest example of this principle. Most students learn it as a
        sequence of mechanical operations: row reduce this matrix, compute that determinant,
        invert this system. These are algorithms you execute, not ideas you understand.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        The geometric view is transformative. A matrix <em>is</em> a transformation of space:
        it stretches, rotates, shears, and squishes. The determinant is the factor by which
        areas (or volumes) scale. A zero determinant means the transformation collapses
        space down into a lower dimension. This is not metaphor; it is the literal definition.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Eigenvectors are the spine of this intuition. An eigenvector is a direction that the
        matrix doesn&rsquo;t rotate; it only stretches. Formally:
      </p>

      {/* Eigenvalue equation */}
      <div className="my-8 overflow-x-auto py-4 flex justify-center">
        <Math display>{String.raw`A \mathbf{x} = \lambda \mathbf{x}`}</Math>
      </div>

      {/* EigenvalueViz */}
      <p className="text-xs tracking-widest uppercase text-ash mt-2 mb-0 text-center">
        visualization
      </p>
      <EigenvalueViz />

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        In the visualization above, the matrix{" "}
        <Math>{String.raw`A = \begin{pmatrix} 2 & 1 \\ 1 & 2 \end{pmatrix}`}</Math> has
        eigenvectors along the diagonals. Drag the slider and watch: every other vector bends
        and rotates as the transformation unfolds, but the blue and green eigenvectors
        simply stretch in place. The blue one scales by{" "}
        <Math>{String.raw`\lambda = 3`}</Math>, the green one stays put at{" "}
        <Math>{String.raw`\lambda = 1`}</Math>.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        That geometric picture turns out to be surprisingly portable. Principal component
        analysis, Google&rsquo;s PageRank, quantum mechanics — each is genuinely hard in its own
        right. But once you understand eigenvectors, you start recognizing the same underlying
        question buried inside all of them: which directions does this transformation leave
        unchanged?
      </p>

      {/* ── Section: Surviving the Hard Stuff ── */}
      <h3
        className="font-heading text-lg font-normal text-parchment mt-12 mb-4"
        style={{ letterSpacing: "0.03em" }}
      >
        Surviving the Hard Stuff
      </h3>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Geometric intuition scales up. Take robotic manipulation — one of the harder domains in
        applied math. The central problem is: given a desired velocity of the end-effector (the
        robot&rsquo;s hand) in Cartesian space, what joint velocities should the motors apply?
        This is answered by the{" "}
        <strong className="text-parchment font-medium">Jacobian matrix</strong>:
      </p>

      {/* Jacobian equation */}
      <div className="my-8 overflow-x-auto py-4 flex justify-center">
        <Math display>{String.raw`\dot{\mathbf{x}} = J(\mathbf{q})\, \dot{\mathbf{q}}`}</Math>
      </div>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Where <Math>{String.raw`\dot{\mathbf{x}}`}</Math> is the end-effector velocity,{" "}
        <Math>{String.raw`\dot{\mathbf{q}}`}</Math> is the vector of joint velocities, and{" "}
        <Math>{String.raw`J(\mathbf{q})`}</Math> is the Jacobian, a matrix that depends on
        the current joint configuration.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Memorized as a formula, the Jacobian is impenetrable. But geometrically, it is exactly
        the same thing as a linear map: it tells you how small changes in joint angles{" "}
        <em>transform</em>{" "}into small changes in end-effector position. It&rsquo;s the local
        linearization of the robot&rsquo;s forward kinematics, a matrix that warps the
        joint-space tangent into Cartesian-space motion. When the Jacobian becomes singular
        (determinant → 0), the robot hits a{" "}
        <strong className="text-parchment font-medium">kinematic singularity</strong>: certain
        directions in Cartesian space become unreachable, exactly as losing dimensions in a
        linear transformation.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        The same intuition carries through to differential equations, control theory, manifold
        learning, and beyond. Every time, the question is the same: what shape is this transformation
        drawing in space?
      </p>

      {/* ── Section: The Reality ── */}
      <h3
        className="font-heading text-lg font-normal text-parchment mt-12 mb-4"
        style={{ letterSpacing: "0.03em" }}
      >
        The Reality
      </h3>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        None of this means you skip the algebra. You still have to do the problem sets, grind
        through the proofs, and pass the exams. The geometric intuition is not a shortcut around
        the work; it&rsquo;s the foundation that makes the work{" "}
        <em>stick</em>.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        The authors I respected most in those textbooks were the ones who never let you forget
        the picture. They would derive the formula, then immediately show you what it looked
        like: the shape it drew, what it preserved, what it destroyed. That alternation between
        symbol and shape is the whole game.
      </p>

      <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
        Your brain is already a spatial computer. The question is whether you&rsquo;re giving 
        them something to map, or just flooding your working memory with symbols and hoping for the best.
      </p>

    

      <div className="border-t border-surface-border/40 mt-16 pt-8">
        <Link
          href="/hobbies"
          className="text-ash text-sm hover:text-parchment transition-colors duration-200"
        >
          ← Back to writing
        </Link>
      </div>
    </div>
  );
}
