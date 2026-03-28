const hobbies = [
  {
    title: "Sudoku",
    caption:
      "Solving complex grids. A daily ritual for pattern recognition and mental clarity.",
    imageSrc: "/sudoku.png",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Meaningless Engineering",
    caption:
      "Building and engineering random, delightfully meaningless little contraptions just for the pure joy of making.",
    imageSrc: "/eng.jpg",
    span: "col-span-1 row-span-2",
  },
  {
    title: "Matcha Enthusiast",
    caption:
      "Consuming anything and everything matcha..",
    imageSrc: "/matcha.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Plushie Consultations",
    caption:
      "Talking to my fluffy best friends whenever I feel a bit lonely. They are excellent listeners.",
    imageSrc: "/nailongxm.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Anxiety-Induced Stimming (BFRB)",
    caption:
      "A Body-Focused Repetitive Behavior. When I feel anxious, my hand instinctively goes to my hair to find and untangle knots. It completely derails my focus, but it is how my brain self-regulates",
    imageSrc: "/stress.png",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Extreme Multitasking",
    caption:
      "Opening a chaotic number of browser tabs and rapid-fire context switching. Oddly enough, the digital chaos feels fulfilling.",
    imageSrc: "/multitask.jpg",
    span: "col-span-1 row-span-1",
  },
];

export default function HobbiesSection() {
  return (
    <section className="py-12">
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-parchment mb-3">
        Hobbies
      </h1>
      <p className="text-ash text-base mb-10 max-w-lg">
        Things I care about and pursue outside of research.
      </p>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {hobbies.map((hobby, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-xl overflow-hidden border border-surface-border bg-surface-raised/40 hover:border-sage/30 hover:bg-surface-raised/60 transition-all duration-300 group"
          >
            <div className="overflow-hidden">
              <img
                src={hobby.imageSrc}
                alt={hobby.title}
                className="w-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.02] transition-all duration-500"
              />
            </div>
            <div className="p-4">
              <h3 className="font-serif text-parchment font-semibold text-sm mb-1">
                {hobby.title}
              </h3>
              <p className="text-ash text-xs leading-relaxed">{hobby.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
