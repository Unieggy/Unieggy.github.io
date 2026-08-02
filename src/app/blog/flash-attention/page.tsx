import "katex/dist/katex.min.css";
import katex from "katex";
import Link from "next/link";

const PDF_URL = "/Flash%20Attention.pdf";

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

/* Centered display equation */
function Eq({ children }: { children: string }) {
  return (
    <div className="my-7 overflow-x-auto py-2 flex justify-center">
      <Math display>{children}</Math>
    </div>
  );
}

/* Section heading */
function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="font-heading text-lg font-normal text-parchment mt-14 mb-4"
      style={{ letterSpacing: "0.03em" }}
    >
      {children}
    </h3>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="font-sans font-semibold text-parchment text-base mt-9 mb-3">
      {children}
    </h4>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-parchment/80 text-base font-light leading-relaxed mb-5">
      {children}
    </p>
  );
}

/* A small cropped snippet lifted straight out of the PDF */
function Snip({
  src,
  alt,
  caption,
  narrow = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  narrow?: boolean;
}) {
  return (
    <figure className="my-6">
      <a href={src} target="_blank" rel="noreferrer" className="block group">
        <div
          className="rounded-md border border-surface-border/60 bg-white p-3 transition-colors duration-200 group-hover:border-sage/60"
          style={narrow ? { maxWidth: "34rem", margin: "0 auto" } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full block" loading="lazy" />
        </div>
      </a>
      {caption && (
        <figcaption className="text-ash text-xs mt-2 text-center font-light">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/* A full page of the PDF, allowed to bleed wider than the text column */
function PageShot({
  src,
  page,
  caption,
}: {
  src: string;
  page: number;
  caption: string;
}) {
  return (
    <figure className="my-10 lg:-mx-24">
      <a href={src} target="_blank" rel="noreferrer" className="block group">
        <div className="rounded-lg border border-surface-border/60 bg-white p-3 sm:p-5 transition-colors duration-200 group-hover:border-sage/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Page ${page} of the handwritten Flash Attention notes`}
            className="w-full block"
            loading="lazy"
          />
        </div>
      </a>
      <figcaption className="text-ash text-xs mt-3 text-center font-light">
        Page {page} — {caption}{" "}
        <span className="opacity-70">(click to open full size)</span>
      </figcaption>
    </figure>
  );
}

/* Bulleted "what each symbol means" list */
function SymbolList({ items }: { items: [string, string][] }) {
  return (
    <ul className="list-none space-y-2 mb-6">
      {items.map(([latex, desc], i) => (
        <li key={i} className="flex gap-3 text-parchment/80 text-sm leading-relaxed">
          <span className="text-sage shrink-0">•</span>
          <span>
            <Math>{latex}</Math> — {desc}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function FlashAttentionPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/hobbies"
        className="text-ash text-sm hover:text-parchment transition-colors duration-200 mb-12 inline-block"
      >
        ← Back
      </Link>

      {/* Header */}
      <div className="mb-12">
        <p className="text-ash text-sm mb-3">August 2026 · Technical</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-parchment leading-snug">
          Flash Attention, One Page at a Time
        </h1>
      </div>

      <div className="border-t border-surface-border/40 mb-12" />

      {/* ── Intro ─────────────────────────────────────────────── */}

      <P>
        Attention is not slow because of the math. Multiplying{" "}
        <Math>{String.raw`Q K^\top`}</Math> and then multiplying by{" "}
        <Math>V</Math>{" "}
        is a perfectly reasonable number of FLOPs for a modern
        GPU. It&rsquo;s slow because the <Math>{String.raw`N \times N`}</Math>{" "}
        score matrix has to be written to HBM, read back for the softmax,
        written again, and read one more time for the multiply by{" "}
        <Math>V</Math>. The GPU spends most of the wall clock waiting on memory
        while the tensor cores sit around doing nothing.
      </P>

      <P>
        Flash Attention&rsquo;s fix is to never materialize that matrix. It
        walks over blocks of <Math>Q</Math>, <Math>K</Math>, <Math>V</Math> that
        fit in on-chip SRAM, and keeps a running softmax so it can produce the
        exact same output without ever holding a full row of scores in memory.
        Not an approximation — the same numbers, computed in a smarter order.
      </P>

      <P>
        These are my handwritten notes working through the paper. The whole PDF
        is embedded below, and the rest of the post walks through it page by
        page.
      </P>

      {/* ── PDF embed ─────────────────────────────────────────── */}

      <div className="my-10">
        {/* Inline viewer — desktop only; mobile PDF embeds are uniformly awful */}
        <div className="hidden sm:block rounded-lg border border-surface-border/60 overflow-hidden bg-white">
          <object
            data={`${PDF_URL}#page=2`}
            type="application/pdf"
            className="w-full"
            style={{ height: "min(80vh, 780px)" }}
            aria-label="Flash Attention handwritten notes (PDF)"
          >
            <div className="p-8 text-sm text-neutral-700">
              Your browser won&rsquo;t render the PDF inline.{" "}
              <a href={PDF_URL} className="underline" target="_blank" rel="noreferrer">
                Open it in a new tab instead.
              </a>
            </div>
          </object>
        </div>

        {/* Mobile fallback */}
        <a
          href={PDF_URL}
          target="_blank"
          rel="noreferrer"
          className="sm:hidden block rounded-lg border border-surface-border/60 bg-surface-raised/40 p-5 text-parchment text-sm hover:border-sage/60 transition-colors duration-200"
        >
          Open Flash Attention.pdf ↗
        </a>

        <p className="text-ash text-xs mt-3 font-light">
          <a
            href={PDF_URL}
            target="_blank"
            rel="noreferrer"
            className="hover:text-parchment transition-colors duration-200 underline underline-offset-4 decoration-surface-border"
          >
            Flash Attention.pdf
          </a>{" "}
          — 4 sheets, ~2.5 MB. Sheet 1 is a cover page containing no attention
          whatsoever, so the walkthrough starts on page 2.
        </p>
      </div>

      {/* ── The short version ─────────────────────────────────── */}

      <H3>The short version</H3>

      <P>
        Three moving parts, and the notes hit them in order. Page 2 shows that
        softmax can be computed incrementally, then annotates Algorithm 1 and
        the SRAM budget that decides the block sizes. Page 3 grinds through the
        one line of the algorithm that looks like a hack —{" "}
        <em>the output rescaling</em>{" "}
        — and shows it isn&rsquo;t. Page 4 counts
        the memory traffic and gets{" "}
        <Math>{String.raw`O(N^2 d^2 M^{-1})`}</Math> HBM accesses instead of{" "}
        <Math>{String.raw`\Theta(N^2)`}</Math>.
      </P>

      {/* ═══════════════════ PAGE 2 ═══════════════════ */}

      <H3>Page 2 — A softmax that never sees the whole row</H3>

      <PageShot
        src="/flash-attention/page-2.png"
        page={2}
        caption="online softmax, Algorithm 1, and the SRAM budget"
      />

      <P>
        The obstacle to tiling attention is softmax. It needs a maximum over the
        whole row (for numerical stability) and a sum over the whole row (for
        the denominator), which is an inconvenient thing to need when you are
        deliberately looking at one block at a time. The top of this page fixes
        that by defining softmax through three running statistics instead of one
        pass.
      </P>

      <Snip
        src="/flash-attention/snip-softmax-basics.png"
        alt="Handwritten definition of the max, the exponentiated difference vector, and the denominator"
        caption="Steps 1–4: the three pieces softmax is actually made of"
      />

      <P>
        For an input vector <Math>{String.raw`x \in \mathbb{R}^N`}</Math>, grab
        only the first block of size <Math>B</Math>:
      </P>

      <Eq>{String.raw`m(x) := \max_i\, x_i \qquad f(x) := \left[\, e^{x_1 - m(x)} \ \cdots \ e^{x_B - m(x)} \,\right]`}</Eq>

      <Eq>{String.raw`\ell(x) := \sum_i f(x)_i \qquad \mathrm{softmax}(x) := \frac{f(x)}{\ell(x)}`}</Eq>

      <P>
        The subtraction in step 2 is the standard overflow guard. Every exponent{" "}
        <Math>{String.raw`x_i - m(x)`}</Math> is <Math>{String.raw`\leq 0`}</Math>,
        so every entry of <Math>{String.raw`f(x)`}</Math> lands safely in{" "}
        <Math>{String.raw`(0, 1]`}</Math> and nothing blows up. It also means{" "}
        <Math>m</Math> is baked into <Math>f</Math> and{" "}
        <Math>{String.raw`\ell`}</Math>, which is exactly the problem: a block
        computed against its own local max is, as the note bluntly puts it,{" "}
        <em>&ldquo;incorrect for softmax for now.&rdquo;</em>
      </P>

      <H4>Merging two blocks</H4>

      <P>
        Steps 5 and 6 are where it becomes an algorithm. Take two blocks{" "}
        <Math>{String.raw`x^{1}, x^{2} \in \mathbb{R}^{B}`}</Math> and
        concatenate them into{" "}
        <Math>{String.raw`x = [\,x^{1}, x^{2}\,] \in \mathbb{R}^{2B}`}</Math>.
        The new max is free:
      </P>

      <Snip
        src="/flash-attention/snip-merge.png"
        alt="Handwritten derivation of the merged max, merged exponent vector, and merged denominator"
        caption="Steps 5–6: two blocks in, one correct softmax out"
      />

      <Eq>{String.raw`m(x) = m\!\left(\left[x^{1}\ x^{2}\right]\right) = \max\!\left(m(x^{1}),\, m(x^{2})\right)`}</Eq>

      <P>
        The exponent vectors need a correction, and it&rsquo;s a single scalar
        per block. Whatever a block computed against its own local max gets
        re-based to the global one:
      </P>

      <Eq>{String.raw`f(x) = \left[\, e^{m(x^{1}) - m(x)} f(x^{1}) \quad e^{m(x^{2}) - m(x)} f(x^{2}) \,\right]`}</Eq>

      <P>
        The whole trick is one line of exponent arithmetic, drawn in the notes
        with a big <Math>{String.raw`\Downarrow`}</Math>:
      </P>

      <Eq>{String.raw`e^{\,m(x^{1}) - m(x)} \cdot e^{\,x_i - m(x^{1})} \;=\; e^{\,x_i - m(x)}`}</Eq>

      <P>
        The local max cancels itself out. Sum both rescaled halves and you get
        the denominator, which is step 6:
      </P>

      <Eq>{String.raw`\ell(x) = e^{\,m(x^{1}) - m(x)}\,\ell(x^{1}) \;+\; e^{\,m(x^{2}) - m(x)}\,\ell(x^{2}), \qquad \mathrm{softmax}(x) = \frac{f(x)}{\ell(x)}`}</Eq>

      <P>
        And since the merge takes two blocks and returns something with the same
        shape as a block, you can just keep going —{" "}
        <em>&ldquo;logic continues to <Math>{String.raw`N/B`}</Math> blocks with
        dim <Math>B</Math>.&rdquo;</em> Carry <Math>{String.raw`(m, \ell)`}</Math>{" "}
        as state, fold in one block at a time, and the exact softmax falls out at
        the end. Two scalars per row is the entire price.
      </P>

      <H4>Algorithm 1, annotated</H4>

      <P>
        The middle of the page is the algorithm box from the paper, with a
        reminder in the margin that it assumes a batch size of 1 — real
        implementations add batch and head dimensions on top, which changes
        nothing conceptually and everything about the indexing.
      </P>

      <Snip
        src="/flash-attention/snip-algorithm.png"
        alt="Algorithm 1 FlashAttention, as printed in the paper"
        caption="Algorithm 1, straight from the paper"
      />

      <P>
        Line 1 picks the block sizes from the SRAM capacity{" "}
        <Math>M</Math>, and this is the line worth staring at:
      </P>

      <Eq>{String.raw`B_c = \left\lceil \frac{M}{4d} \right\rceil, \qquad B_r = \min\!\left(\left\lceil \frac{M}{4d} \right\rceil,\; d\right)`}</Eq>

      <Snip
        src="/flash-attention/snip-setup-notes.png"
        alt="Handwritten notes on the ceiling term, HBM residents, and the block partitions"
        caption="Why the 4d, and what lives in HBM"
        narrow
      />

      <P>
        The <Math>{String.raw`4d`}</Math> is there because a block of rows costs
        four <Math>d</Math>-wide tiles at once: you are holding{" "}
        <Math>Q</Math>, <Math>K</Math>, <Math>V</Math> and <Math>O</Math>{" "}
        simultaneously. Divide the budget four ways and that&rsquo;s how many
        rows fit.
      </P>

      <P>Line 2 sets up what stays in HBM:</P>

      <SymbolList
        items={[
          [String.raw`O \in \mathbb{R}^{N \times d}`, "the output matrix, initialized to zero."],
          [String.raw`\ell \in \mathbb{R}^{N}`, "the running normalizer, initialized to all 0."],
          [String.raw`m \in \mathbb{R}^{N}`, "the running row-max vector, initialized to −∞ (so the first real max always wins)."],
        ]}
      />

      <P>
        Lines 3 and 4 do the tiling. <Math>Q</Math> splits into{" "}
        <Math>{String.raw`T_r = \lceil N/B_r \rceil`}</Math> blocks of shape{" "}
        <Math>{String.raw`B_r \times d`}</Math>; <Math>K</Math> and{" "}
        <Math>V</Math> each split into{" "}
        <Math>{String.raw`T_c = \lceil N/B_c \rceil`}</Math> blocks of shape{" "}
        <Math>{String.raw`B_c \times d`}</Math>. <Math>O</Math> follows{" "}
        <Math>Q</Math>&rsquo;s partition, and so do{" "}
        <Math>{String.raw`\ell`}</Math> and <Math>m</Math> — which, being{" "}
        <Math>{String.raw`B_r`}</Math>-length vectors rather than matrices, are
        small enough to keep resident in SRAM without anyone noticing.
      </P>

      <H4>Who loops over what</H4>

      <Snip
        src="/flash-attention/snip-tiling-diagram.png"
        alt="Diagram of the outer loop over K and V blocks and the inner loop over Q blocks, with copies into SRAM"
        caption="Outer loop over K/V (red), inner loop over Q (blue)"
        narrow
      />

      <P>
        The outer loop (line 5) walks over the <Math>K</Math>,{" "}
        <Math>V</Math> blocks; the inner loop (line 7) walks over the{" "}
        <Math>Q</Math> blocks. So a single <Math>{String.raw`K_j, V_j`}</Math>{" "}
        pair is loaded into SRAM once and reused against every query block,
        while <Math>{String.raw`Q_i, O_i, \ell_i, m_i`}</Math> get cycled
        through underneath it. Every block that gets computed on-chip is written
        back to HBM as a <Math>{String.raw`B_r \times d`}</Math> slice of the
        output — never as part of an{" "}
        <Math>{String.raw`N \times N`}</Math> anything.
      </P>

      <P>
        Line 9 is where that pays off. The score block is{" "}
        <Math>{String.raw`S_{ij} = Q_i K_j^\top \in \mathbb{R}^{B_r \times B_c}`}</Math>
        , and as the note in the corner says: we don&rsquo;t need the{" "}
        <Math>{String.raw`N \times N`}</Math>, since it&rsquo;s made of these
        tiny grids and we only ever handle{" "}
        <strong className="text-parchment font-medium">one grid at a time</strong>.
      </P>

      <H4>The SRAM budget</H4>

      <Snip
        src="/flash-attention/snip-sram-budget.png"
        alt="Handwritten SRAM budget: 2(B_r d) + 2(B_c d) + B_r B_c"
        caption="Everything that has to fit on-chip at once"
      />

      <P>
        Adding up what a single iteration needs resident on-chip:
      </P>

      <Eq>{String.raw`\underbrace{2\,(B_r \cdot d)}_{Q_i,\ O_i} \;+\; \underbrace{2\,(B_c \cdot d)}_{K_j,\ V_j} \;+\; \underbrace{(B_r \cdot B_c)}_{Q_i K_j^\top}`}</Eq>

      <P>
        The asymmetry between <Math>{String.raw`B_r`}</Math> and{" "}
        <Math>{String.raw`B_c`}</Math> is deliberate. <Math>K</Math> and{" "}
        <Math>V</Math> get the full column block size, because a wider{" "}
        <Math>{String.raw`B_c`}</Math> means more reuse per load. But{" "}
        <Math>Q</Math> and <Math>O</Math> are capped at{" "}
        <Math>d</Math> rows — they fall back to <Math>d</Math> to save
        resources, since making them taller buys nothing and costs SRAM. When{" "}
        <Math>{String.raw`B_c \leq d`}</Math> the min collapses and{" "}
        <Math>{String.raw`B_r = B_c`}</Math>, which tidies the budget to:
      </P>

      <Eq>{String.raw`4\,B_c \cdot d \;+\; B_c \cdot B_c`}</Eq>

      {/* ═══════════════════ PAGE 3 ═══════════════════ */}

      <H3>Page 3 — Why line 12 isn&rsquo;t a hack</H3>

      <PageShot
        src="/flash-attention/page-3.png"
        page={3}
        caption="unpacking the output update, term by term"
      />

      <P>
        Line 12 is the line that makes people squint. It rescales the output
        block you already computed by a ratio of exponentials and a pair of
        diagonal matrices, and it is not at all obvious that what comes out the
        other side is a correct softmax-weighted average. This whole page is
        the check.
      </P>

      <H4>First, the running statistics</H4>

      <Snip
        src="/flash-attention/snip-running-stats.png"
        alt="Handwritten line 11 with grid diagrams showing green processed blocks and the yellow current block"
        caption="Line 11: green is everything processed so far, yellow is the block in hand"
      />

      <P>
        Line 11 updates the two per-row statistics. The new max is the running
        max against the current block&rsquo;s max:
      </P>

      <Eq>{String.raw`m_i^{\mathrm{new}} = \max\!\left(m_i,\, \tilde m_{ij}\right) \in \mathbb{R}^{B_r}`}</Eq>

      <Eq>{String.raw`\ell_i^{\mathrm{new}} = \underbrace{e^{\,m_i - m_i^{\mathrm{new}}}\,\ell_i}_{\text{rescaled sum from past green blocks}} \;+\; \underbrace{e^{\,\tilde m_{ij} - m_i^{\mathrm{new}}}\,\tilde\ell_{ij}}_{\text{rescaled from the new yellow}}`}</Eq>

      <P>
        The two grids in the margin are the whole mental model. The small one
        makes the point that the max is taken{" "}
        <em>per row</em> of the block, not over the block as a whole — row{" "}
        <Math>{String.raw`i`}</Math> of the tile carries its own{" "}
        <Math>{String.raw`m_i`}</Math>, and that row-local max is simultaneously
        the running max for that row of the full attention matrix. The bigger
        grid colors row <Math>{String.raw`i=2`}</Math>: green for the key blocks{" "}
        <Math>{String.raw`j = 1, 2`}</Math> already folded in, yellow for{" "}
        <Math>{String.raw`j = 3`}</Math>, the one currently on-chip. That
        color coding runs through the rest of the page.
      </P>

      <H4>The line itself</H4>

      <Snip
        src="/flash-attention/snip-line12.png"
        alt="Handwritten line 12, with the green and yellow terms labelled"
        caption="Line 12, split into a green term and a yellow term"
      />

      <Eq>{String.raw`O_i \leftarrow \mathrm{diag}\!\left(\ell_i^{\mathrm{new}}\right)^{-1}\left( \textcolor{#6aa84f}{\mathrm{diag}(\ell_i)\, e^{\,m_i - m_i^{\mathrm{new}}} O_i} \;+\; \textcolor{#c8a532}{e^{\,\tilde m_{ij} - m_i^{\mathrm{new}}}\, \tilde P_{ij} V_j} \right)`}</Eq>

      <P>
        Read it as three moves: undo the old normalization, put both halves on a
        common exponent base, then re-normalize with the new denominator. The
        rest of the page checks the green and yellow terms separately.
      </P>

      <H4>Green: rewinding the old output</H4>

      <Snip
        src="/flash-attention/snip-green.png"
        alt="Handwritten breakdown of the green term, showing diag(l_i) undividing O_i"
        caption="diag(ℓᵢ) undoes the division, e^(mᵢ − mᵢⁿᵉʷ) re-bases the exponents"
      />

      <P>
        <Math>{String.raw`O_i \in \mathbb{R}^{B_r \times d}`}</Math> is the
        current output for key blocks <Math>{String.raw`j = 1, 2`}</Math> — a{" "}
        <em>finished</em> softmax average over the keys seen so far, meaning it
        has already been divided by <Math>{String.raw`\ell_i`}</Math>. Row{" "}
        <Math>k</Math> of it is:
      </P>

      <Eq>{String.raw`O_i[k] = \frac{1}{\ell_i[k]}\left[\, \mathrm{raw}\,o_1,\ \ldots,\ \mathrm{raw}\,o_d \,\right]`}</Eq>

      <P>
        Multiplying by the diagonal matrix{" "}
        <Math>{String.raw`\mathrm{diag}(\ell_i) \in \mathbb{R}^{B_r \times B_r}`}</Math>{" "}
        undivides it — each row is scaled by its own normalizer, which puts you
        back at the raw weighted sum:
      </P>

      <Eq>{String.raw`\mathrm{diag}(\ell_i)[k] \cdot O_i[k] = \left[\, \mathrm{raw}\,o_1,\ \ldots,\ \mathrm{raw}\,o_d \,\right], \qquad \mathrm{raw}_c = \sum_{\text{past keys } p} e^{\,s_{kp} - m_i}\, V_{pc}`}</Eq>

      <P>
        That sum is still expressed relative to the <em>old</em> max{" "}
        <Math>{String.raw`m_i`}</Math>. One scalar multiply fixes it, using the
        same cancellation from page 2:
      </P>

      <Eq>{String.raw`e^{\,m_i - m_i^{\mathrm{new}}} \sum_{p} e^{\,s_{kp} - m_i}\, V_{pc} \;=\; \sum_{p} e^{\,s_{kp} - m_i^{\mathrm{new}}}\, V_{pc}`}</Eq>

      <P>
        So the green term is the accumulated numerator over all past keys,
        rewritten in the new exponent base. No information lost, nothing
        approximated.
      </P>

      <H4>Yellow: the block in hand</H4>

      <Snip
        src="/flash-attention/snip-yellow.png"
        alt="Handwritten breakdown of the yellow term, P_ij times V_j"
        caption="The current block, re-based the same way"
      />

      <P>
        <Math>{String.raw`\tilde P_{ij} \in \mathbb{R}^{B_r \times B_c}`}</Math>{" "}
        holds the exponentiated scores for the current tile, each entry taken
        against the tile&rsquo;s <em>local</em> max{" "}
        <Math>{String.raw`\tilde m_{ij}`}</Math>:
      </P>

      <Eq>{String.raw`\tilde P_{ij}[k] = \left[\, e^{\,s_{k1} - \tilde m_{ij}},\ e^{\,s_{k2} - \tilde m_{ij}},\ \ldots,\ e^{\,s_{k B_c} - \tilde m_{ij}} \,\right]`}</Eq>

      <P>
        Multiplying by <Math>{String.raw`V_j \in \mathbb{R}^{B_c \times d}`}</Math>{" "}
        contracts over the <Math>{String.raw`B_c`}</Math> keys in the tile,
        giving a <Math>d</Math>-dimensional row:
      </P>

      <Eq>{String.raw`\left(\tilde P_{ij} V_j\right)[k] = \left[\, \sum_{q=1}^{B_c} e^{\,s_{kq} - \tilde m_{ij}} V_{q1},\ \ \sum_{q=1}^{B_c} e^{\,s_{kq} - \tilde m_{ij}} V_{q2},\ \ \ldots \,\right]`}</Eq>

      <P>Then the same one-scalar re-basing as before:</P>

      <Eq>{String.raw`e^{\,\tilde m_{ij} - m_i^{\mathrm{new}}}\left( \sum_{q=1}^{B_c} e^{\,s_{kq} - \tilde m_{ij}} V_{q1} \right) = \sum_{q=1}^{B_c} e^{\,s_{kq} - m_i^{\mathrm{new}}} V_{q1}`}</Eq>

      <H4>Green + yellow</H4>

      <Snip
        src="/flash-attention/snip-final.png"
        alt="Handwritten sum of part A and part B, and the final normalization"
        caption="Two partial sums over disjoint key sets, in the same base — so they just add"
      />

      <P>
        Both terms are now sums of{" "}
        <Math>{String.raw`e^{\,s - m_i^{\mathrm{new}}} V`}</Math> over disjoint
        sets of keys, in the same exponent base. Which means they simply add:
      </P>

      <Eq>{String.raw`\text{A}[k] = \sum_{\text{past } p} e^{\,s_{kp} - m_i^{\mathrm{new}}} V_{p}, \qquad \text{B}[k] = \sum_{q} e^{\,s_{kq} - m_i^{\mathrm{new}}} V_{q}`}</Eq>

      <Eq>{String.raw`\text{A} + \text{B} = \sum_{p\,+\,q} e^{\,s_{k,\text{all}} - m_i^{\mathrm{new}}}\, V_{\text{all}} \;\in\; \mathbb{R}^{B_r \times d}`}</Eq>

      <P>
        That is exactly the numerator of a softmax taken over every key seen so
        far. Divide by the new normalizer — the{" "}
        <Math>{String.raw`B_r \times B_r`}</Math> diagonal on the left — and you
        have the updated output block:
      </P>

      <Eq>{String.raw`\begin{bmatrix} \tfrac{1}{\ell_1} & & \\ & \ddots & \\ & & \tfrac{1}{\ell_{B_r}} \end{bmatrix} \times \left(\text{A} + \text{B}\right) \;=\; O_i^{\mathrm{new}} \;\in\; \mathbb{R}^{B_r \times d}`}</Eq>

      <P>
        Which is the punchline of the page:{" "}
        <Math>{String.raw`O_i`}</Math> is correct after <em>every</em>{" "}
        iteration, not just the last one. It&rsquo;s always the exact attention
        output restricted to the keys processed so far, which is why the loop
        can stop caring about everything it has already thrown away.
      </P>

      {/* ═══════════════════ PAGE 4 ═══════════════════ */}

      <H3>Page 4 — Counting the memory traffic</H3>

      <PageShot
        src="/flash-attention/page-4.png"
        page={4}
        caption="space and HBM-access complexity (the rest of the sheet is blank)"
      />

      <P>
        Start with what actually lives in HBM:{" "}
        <Math>{String.raw`Q, K, V, O \in \mathbb{R}^{N \times d}`}</Math> plus
        the two vectors <Math>{String.raw`\ell`}</Math> and <Math>m</Math> of
        length <Math>N</Math>:
      </P>

      <Eq>{String.raw`\text{total HBM memory} = 4Nd + 2N \;\;\Longrightarrow\;\; O(N)`}</Eq>

      <P>
        Treating the head dimension <Math>d</Math>{" "}
        as a constant (it&rsquo;s
        typically 64 or 128, while <Math>N</Math> runs into the thousands), that
        is linear in sequence length. Standard attention has an{" "}
        <Math>{String.raw`N \times N`}</Math> matrix sitting in there, so this
        is already the headline win.
      </P>

      <P>Then the IO count, in four steps:</P>

      <SymbolList
        items={[
          [
            String.raw`T = \frac{N}{B} = \frac{N}{M/4d} = \frac{4Nd}{M}`,
            "number of blocks along one axis, since the block size comes from the SRAM budget.",
          ],
          [
            String.raw`T_r \times T_c \approx \frac{16 N^2 d^2}{M^2}`,
            "total iterations of the doubly-nested loop.",
          ],
          [
            String.raw`B \cdot 4d = M`,
            "data moved per iteration — one iteration's worth of Q, K, V, O tiles, which is a full SRAM's worth by construction.",
          ],
          [
            String.raw`\frac{16 N^2 d^2}{M^2} \cdot M = \frac{16 N^2 d^2}{M}`,
            "iterations times bytes per iteration.",
          ],
        ]}
      />

      <Eq>{String.raw`\text{HBM accesses} = O\!\left(N^2 d^2 M^{-1}\right)`}</Eq>

      <P>
        Compare that to standard attention&rsquo;s{" "}
        <Math>{String.raw`\Theta(Nd + N^2)`}</Math>. The ratio is roughly{" "}
        <Math>{String.raw`d^2 / M`}</Math>, and on real hardware{" "}
        <Math>M</Math> is on the order of 100 KB while{" "}
        <Math>{String.raw`d^2`}</Math> is a few thousand — so the traffic drops
        by something like an order of magnitude. Note the direction of the{" "}
        <Math>M</Math>: <em>bigger</em> SRAM means <em>fewer</em>{" "}
        memory accesses, because bigger blocks mean more reuse per load. This is the
        rare complexity result where the constant factor of your hardware shows
        up in the exponent&rsquo;s neighborhood and you&rsquo;re glad about it.
      </P>

      {/* ── Closing ───────────────────────────────────────────── */}

      <H3>What I took away</H3>

      <P>
        The thing worth remembering isn&rsquo;t the algebra, it&rsquo;s the
        framing. Flash Attention doesn&rsquo;t reduce the number of operations
        at all — it does <em>more</em>{" "}
        arithmetic than standard attention, since
        every block re-scales work that was already done. It wins anyway,
        because on a modern GPU the arithmetic is nearly free and the memory
        movement isn&rsquo;t.
      </P>

      <P>
        The softmax decomposition on page 2 is what makes that trade legal.
        Everything after it is bookkeeping: carry{" "}
        <Math>{String.raw`(m, \ell)`}</Math>, re-base when the max moves, divide
        at the end. Once you&rsquo;ve seen it, the same running-statistics
        pattern shows up everywhere — Welford&rsquo;s algorithm for variance,
        streaming log-sum-exp, half of what a distributed reduce does.
      </P>

      {/* ── PDF attachment (bottom) ───────────────────────────── */}

      <div className="mt-12 rounded-lg border border-surface-border/60 bg-surface-raised/40 p-5">
        <p className="text-xs font-medium tracking-widest text-ash uppercase mb-3">
          Attachment
        </p>
        <a
          href={PDF_URL}
          target="_blank"
          rel="noreferrer"
          className="text-parchment text-sm hover:text-sage transition-colors duration-200"
        >
          Flash Attention.pdf ↗
        </a>
        <p className="text-ash text-sm font-light mt-2 leading-relaxed">
          The original handwritten notes, all four sheets, unedited. Based on{" "}
          <em>
            FlashAttention: Fast and Memory-Efficient Exact Attention with
            IO-Awareness
          </em>{" "}
          (Dao, Fu, Ermon, Rudra, Ré, 2022).
        </p>
      </div>

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
