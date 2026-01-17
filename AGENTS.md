# Claude Guidelines for WebGSBench Academic Writing

## Core Principles

When working on academic literature reviews, papers, and technical documentation for this project, follow these guidelines to ensure accuracy, credibility, and academic rigor.

**MOST CRITICAL REQUIREMENTS:**
1. ⚠️ **NEVER cite a paper without reading it** - At minimum read the abstract and verify your claims
2. ⚠️ **AVOID HALLUCINATIONS** - Verify every claim is actually in the paper you're citing, not in papers it references
3. ⚠️ **TOP VENUES ONLY** - Only cite papers from SIGGRAPH, CVPR, ECCV, ICCV, ACM TOG, TPAMI, IJCV, and similar top-tier venues

---

## 1. Citation Quality and Verification

### CRITICAL: Always Read Papers Before Citing

**ABSOLUTE RULE**: You MUST read at least the abstract (preferably introduction) of EVERY paper you cite.

**Why This Matters**:
- Prevents first-order hallucinations (making up what a paper says)
- Prevents second-order hallucinations (attributing claims from cited papers)
- Ensures factual accuracy
- Maintains academic credibility

**How to Verify**:
```bash
# Use WebFetch to read the paper
WebFetch(url="https://arxiv.org/abs/XXXX",
         prompt="What are the main claims and performance numbers in this paper?")

# Or search for specific claims
WebFetch(url="https://arxiv.org/abs/XXXX",
         prompt="Does this paper claim to achieve >100 FPS? What exact FPS is reported?")
```

**Never cite based on**:
- ❌ Secondary sources only
- ❌ Blog posts about the paper
- ❌ Assumptions about what the paper likely says
- ❌ Other papers' descriptions of it

### Always Include DOIs

**Rule**: Every paper citation MUST include a DOI (Digital Object Identifier) when available.

**Why**: DOIs provide permanent, verifiable links to papers and are standard in academic publishing. This allows reviewers and readers to verify your citations.

**How**:
- Search for DOI using: `[Paper Title] [Authors] [Year] DOI`
- Check official sources: IEEE Xplore, ACM Digital Library, Springer, arXiv
- Add DOI to BibTeX entries using `doi = {...}` field
- For papers without DOIs (rare), note this explicitly

**Example**:
```bibtex
@article{kerbl2023gaussian,
  title = {3D Gaussian Splatting for Real-Time Radiance Field Rendering},
  author = {Kerbl, Bernhard and Kopanas, Georgios and ...},
  journal = {ACM Transactions on Graphics},
  year = {2023},
  doi = {10.1145/3592433},  % ALWAYS INCLUDE
  url = {https://doi.org/10.1145/3592433}
}
```

---

## 2. Avoid Second-Order Hallucinations

⚠️ **THIS IS THE MOST COMMON ERROR IN ACADEMIC WRITING** ⚠️

### What Are Second-Order Hallucinations?

**Definition**: Attributing content to Paper A when that content actually comes from Paper B, which Paper A cited.

**Why This Happens**: You read a survey paper or blog that says "Paper A does X", but when you check Paper A, it actually cites Paper B for claim X. If you write "Paper A does X [cite A]", you've created a second-order hallucination.

**Real Example from This Project**:
- ❌ We initially wrote: "NeRF requires hundreds of samples per ray [Mildenhall 2020]"
- ✓ Correct: The NeRF paper doesn't specify "hundreds" - this number comes from analysis in later papers
- ✓ Fixed to: "NeRF's volumetric rendering requires dense sampling along each ray [Mildenhall 2020]"

**Example of Error**:
```
❌ WRONG:
"NeRF [Mildenhall et al. 2020] requires hundreds of samples per ray..."

(This claim might be from a paper ABOUT NeRF, not from the NeRF paper itself)
```

**Correct Approach**:
```
✓ CORRECT:
"NeRF [Mildenhall et al. 2020] uses volumetric rendering.
Subsequent work [Chen et al. 2022] notes that this requires
hundreds of samples per ray, limiting real-time performance."
```

### Verification Process

Before writing any claim about a paper:

1. **Read the abstract/paper directly** - Don't rely on secondary sources
2. **Verify specific numbers/claims** - Check if the paper actually states "100 FPS" vs "30 FPS"
3. **Distinguish primary vs secondary sources**:
   - Primary: The paper makes the claim directly
   - Secondary: The paper cites another paper for the claim
4. **Use WebFetch to verify** - For key claims, fetch the paper and check

**MANDATORY Verification Checklist** (Complete for EVERY citation):
- [ ] Did I read the paper's abstract/introduction?
- [ ] Is this claim in the paper itself, or in papers it cites?
- [ ] Are the specific numbers (FPS, accuracy, etc.) correct?
- [ ] Am I attributing the right contribution to the right paper?
- [ ] Did I use WebFetch to verify any questionable claims?

**Step-by-Step Verification Workflow**:
```
1. Find paper → 2. Use WebFetch on arXiv/PDF → 3. Read abstract
           ↓
4. Note exact claims and numbers → 5. Write citation with verified info
           ↓
6. Double-check: Does my claim match what the paper actually says?
```

---

## 3. Only Use Top-Tier Publication Venues

⚠️ **CRITICAL FOR ACCEPTANCE** - Reviewers judge your work partly by the quality of your citations.

### Why This Matters

For a SIGGRAPH/CVPR-level contribution, we must cite papers from respected venues to establish credibility. Citing weak papers signals that you don't know the field or haven't done proper literature review.

**Impact on Review**:
- ✓ Strong citations from top venues → Reviewers trust your scholarship
- ❌ Weak citations from obscure venues → Reviewers question your credibility
- ❌ Citing preprints when published versions exist → Looks sloppy

### Acceptable Publication Venues

**Tier 1 (Preferred)**:

**Computer Graphics**:
- SIGGRAPH / SIGGRAPH Asia (ACM TOG)
- Eurographics
- EGSR (Eurographics Symposium on Rendering)
- I3D (Symposium on Interactive 3D Graphics)

**Computer Vision**:
- CVPR (Conference on Computer Vision and Pattern Recognition)
- ICCV (International Conference on Computer Vision)
- ECCV (European Conference on Computer Vision)
- NeurIPS (if relevant to neural rendering)
- ICML (if relevant to learning)

**Journals**:
- ACM Transactions on Graphics (TOG)
- IEEE Transactions on Pattern Analysis and Machine Intelligence (TPAMI)
- International Journal of Computer Vision (IJCV)
- IEEE Transactions on Visualization and Computer Graphics (TVCG)

**Tier 2 (Acceptable for specialized content)**:
- 3DV (International Conference on 3D Vision)
- WACV (Winter Conference on Applications of Computer Vision)
- BMVC (British Machine Vision Conference)
- ACCV (Asian Conference on Computer Vision)

**Tier 3 (Use sparingly, only for specific tools/datasets)**:
- arXiv preprints (ONLY if no published version exists and the work is influential)
- Workshop papers (only for very recent work not yet published)
- Technical reports from reputable institutions (e.g., Google Research, Meta AI)

### What to Avoid

❌ **DO NOT cite**:
- Random Medium blog posts
- Non-peer-reviewed blog posts (unless from official project pages)
- Obscure conferences or journals
- Preprints when published versions exist
- Papers from predatory publishers
- Self-published work without peer review

### Guidelines for Web Formats and Tools

For web-based tools and formats (antimatter15/splat, PlayCanvas compression, etc.):
- ✓ Cite GitHub repositories and official documentation for tools
- ✓ Cite company blog posts for format specifications (PlayCanvas, Niantic SPZ)
- ✓ Note these as "implementation references" distinct from research papers
- ✓ Don't claim these are peer-reviewed research

**Example**:
```latex
% Research papers - peer reviewed
\cite{kerbl2023gaussian}

% Tools and implementations - note the distinction
\cite{antimatter2023splat} % GitHub implementation
\cite{niantic2024spz}      % Format specification
```

---

## 4. Fact-Checking Specific Claims

### Common Pitfalls to Verify

1. **Performance Numbers**:
   - ✓ Check: Does the paper claim ">100 FPS" or "≥30 FPS"?
   - ✓ Verify: On what hardware? At what resolution?
   - ❌ Don't assume or generalize

2. **Dataset Sizes**:
   - ✓ Check: "14M images" vs "1.2M images"
   - ✓ Verify: Is this the original dataset or a subset?

3. **Method Capabilities**:
   - ✓ Check: Does the paper claim to handle "dynamic scenes"?
   - ❌ Don't assume capabilities not explicitly stated

4. **Comparative Claims**:
   - ✓ Verify: "Outperforms NeRF" - by how much? On what metrics?
   - ✓ Check: Is this claim in the paper or your interpretation?

### Verification Tools

Use these approaches to verify claims:

```bash
# 1. WebFetch the paper abstract
WebFetch(url="https://arxiv.org/abs/XXXX",
         prompt="Does this paper claim X? What are the exact numbers?")

# 2. Search for specific claims
WebSearch(query="Kerbl 3D Gaussian Splatting FPS performance numbers")

# 3. Check official project pages
WebFetch(url="https://project-page.com",
         prompt="What performance numbers are reported?")
```

---

## 5. Writing Style for Academic Papers

### For Literature Reviews

1. **Be precise, not vague**:
   - ❌ "Many papers have explored..."
   - ✓ "Recent work has extended 3DGS to dynamic scenes [Author 2024], sparse views [Author 2024], and compression [Author 2024]"

2. **Cite specific claims**:
   - ❌ "3DGS is faster than NeRF"
   - ✓ "3DGS achieves real-time rendering (≥30 fps) [Kerbl et al. 2023] compared to NeRF's minutes per frame [Mildenhall et al. 2020]"

3. **Distinguish contribution types**:
   - Method papers: New algorithms
   - Dataset papers: New benchmarks/data
   - Survey papers: Literature reviews
   - System papers: Tools/infrastructure

### Avoid AI-Generated Writing Patterns

⚠️ **CRITICAL**: Academic reviewers can detect AI-generated text. Avoid patterns that make writing feel like "AI slop".

**Em-Dashes (---) - Use Sparingly or Never**:
```latex
% ❌ BAD - Feels AI-generated
...web deployment---a significant mode of consumption...
...standardized evaluation---analogous to how KITTI...

% ✓ GOOD - Natural academic prose
...web deployment, a significant mode of consumption...
...standardized evaluation. This is analogous to how KITTI...
```

**Rule**: Em-dashes connect clauses in ways that feel mechanical. Use periods or commas instead.

**Other AI-Generated Patterns to Avoid**:

1. **Excessive Superlatives**:
   - ❌ "revolutionary," "groundbreaking," "game-changing" (overused)
   - ✓ "significant," "substantial," "notable" (measured)

2. **Flowery Transitions**:
   - ❌ "It is worth noting that..."
   - ❌ "Interestingly enough..."
   - ✓ Just state the fact directly

3. **Redundant Phrasing**:
   - ❌ "In order to" → ✓ "To"
   - ❌ "Due to the fact that" → ✓ "Because"
   - ❌ "A total of 5 methods" → ✓ "5 methods"

4. **Passive Voice Overuse**:
   - ❌ "It was found that the method achieves..."
   - ✓ "The method achieves..." or "We find that..."

5. **Numbered Lists for Everything**:
   - Don't force content into numbered lists unless it's truly a sequence
   - Natural paragraph flow is often better

**Writing Should Sound Human**:
- Use varied sentence structures
- Occasionally use contractions in less formal sections (don't, can't)
- Write as if explaining to a colleague, not a robot
- Read your writing aloud - does it sound natural?

**Quick Test**: If a sentence feels overly formal, mechanical, or like it came from a template, rewrite it.

### For Technical Claims

1. **Be specific about scope**:
   - ❌ "3DGS works on all scenes"
   - ✓ "3DGS achieves state-of-the-art results on the Mip-NeRF 360 dataset [Barron et al. 2022]"

2. **Quantify when possible**:
   - ❌ "Much better quality"
   - ✓ "Improves PSNR by 2.5 dB on average"

3. **Note limitations**:
   - ✓ "While 3DGS achieves real-time rendering, memory requirements can exceed 4GB for large scenes"

---

## 6. BibTeX Best Practices

### Complete Citations

Always include:
- `author` - Full author list
- `title` - Complete title
- `year` - Publication year
- `booktitle` or `journal` - Where published
- `doi` - Digital Object Identifier (when available)
- `url` - Direct link (preferably DOI link)

### For Different Publication Types

**Conference Papers**:
```bibtex
@inproceedings{key,
  author = {Last, First and Last, First},
  title = {Paper Title},
  booktitle = {Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)},
  year = {2024},
  pages = {1--10},
  doi = {10.1109/CVPR.2024.00001},
  url = {https://doi.org/10.1109/CVPR.2024.00001}
}
```

**Journal Papers**:
```bibtex
@article{key,
  author = {Last, First and Last, First},
  title = {Paper Title},
  journal = {ACM Transactions on Graphics},
  volume = {42},
  number = {4},
  year = {2023},
  doi = {10.1145/3592433},
  url = {https://doi.org/10.1145/3592433}
}
```

**arXiv Preprints** (use only when no published version exists):
```bibtex
@misc{key,
  author = {Last, First},
  title = {Paper Title},
  year = {2024},
  eprint = {2401.00000},
  archivePrefix = {arXiv},
  primaryClass = {cs.CV},
  url = {https://arxiv.org/abs/2401.00000}
}
```

**GitHub Repositories/Tools**:
```bibtex
@misc{key,
  author = {{Username or Organization}},
  title = {Tool Name},
  year = {2023},
  howpublished = {\url{https://github.com/user/repo}},
  note = {Accessed: 2026-01-13}
}
```

---

## 7. Specific Guidance for WebGSBench

### When Citing 3DGS Methods

- ✓ Always cite the original Kerbl et al. 2023 paper
- ✓ Be specific about which variant (original, compressed, dynamic, etc.)
- ✓ Note the evaluation benchmark (Mip-NeRF 360, Tanks & Temples, DTU)

### When Citing Benchmarks/Datasets

- ✓ Cite the original dataset paper (ImageNet [Deng 2009], COCO [Lin 2014])
- ✓ Note the size and composition
- ✓ Mention the evaluation metrics used

### When Citing Web Technologies

- ✓ Distinguish between research papers and implementation tools
- ✓ For formats (.ply, .splat, .spz): Cite the format specification
- ✓ For viewers: Cite the GitHub repository, not as peer-reviewed work

---

## 8. Review Checklist Before Finalizing

Before submitting any writing:

- [ ] All papers have DOIs (or noted as unavailable)
- [ ] All claims verified against primary sources
- [ ] No second-order hallucinations (verified with WebFetch if uncertain)
- [ ] All cited papers from top-tier venues (or justified exceptions)
- [ ] Specific numbers/claims are accurate (not rounded or assumed)
- [ ] Citations properly formatted in BibTeX
- [ ] References list is complete and consistent
- [ ] No broken URLs or DOI links
- [ ] Placeholder citations removed (e.g., "Author 2024" without real paper)
- [ ] Clear distinction between peer-reviewed papers and tools/implementations

---

## 9. When in Doubt

### Verification Priority

1. **Always verify before citing** - If you're not sure, use WebFetch
2. **Primary sources over secondary** - Read the paper, don't rely on descriptions
3. **Be conservative with claims** - Better to understate than overstate
4. **Ask the user** - If uncertain about a claim's accuracy, ask for clarification

### Red Flags

🚩 Watch out for:
- Round numbers that seem too perfect ("exactly 100 FPS")
- Claims without specific metrics ("much better")
- Vague citations ("recent work has shown...")
- Papers you haven't actually read
- Web search results from unreliable sources

---

## 10. Examples of Good vs Bad Citations

### Example 1: Performance Claims

❌ **BAD**:
```latex
3DGS achieves over 100 FPS on consumer GPUs~\cite{kerbl2023gaussian}.
```

✓ **GOOD**:
```latex
3DGS achieves real-time rendering at ≥30 fps at 1080p resolution on
consumer GPUs~\cite{kerbl2023gaussian}.
```

### Example 2: Dataset Size

❌ **BAD**:
```latex
ImageNet contains millions of images~\cite{deng2009imagenet}.
```

✓ **GOOD**:
```latex
ImageNet~\cite{deng2009imagenet} contains 14 million images across
21,841 categories, providing a large-scale benchmark for image classification.
```

### Example 3: Method Capabilities

❌ **BAD**:
```latex
Many methods have been proposed for dynamic 3DGS~\cite{author2024}.
```

✓ **GOOD**:
```latex
Recent work has extended 3DGS to dynamic scenes, including deformable
Gaussians~\cite{luiten2023dynamic} and 4D representations~\cite{wu20234d}.
```
(Only use this if you've actually found and verified these papers!)

---

## 11. LaTeX Formatting Best Practices

### Two-Column ACM Format Challenges

SIGGRAPH/ACM papers use a two-column format (`acmtog` style) which has strict width constraints. Follow these guidelines to avoid overfull boxes and formatting issues.

### Table Formatting

**Common Issues**:
- Tables overflow column width
- Long text in cells
- Wide column headers

**Solutions**:

1. **Use `\small` or `\footnotesize`**: Reduce font size for dense tables
   ```latex
   \begin{table}[htbp]
   \caption{Your caption}
   \small  % Add this
   \begin{tabular}{...}
   ```

3. **Abbreviate Text**: Use shorter phrases in tables
   ```latex
   % ❌ BAD
   "Variable compression levels" & "GPU-accelerated sorting"

   % ✓ GOOD
   "Var. levels" & "GPU-based sort"
   ```

4. **Use `p{width}` for Text Columns**: Allow text wrapping
   ```latex
   \begin{tabular}{llp{3.2cm}}  % Third column wraps at 3.2cm
   ```

### Text Overflow (Overfull \hbox)

**Common Causes**:
- Long URLs or file paths
- Compound words with slashes (quality/performance)
- Long technical terms
- Citation clusters

**Solutions**:

1. **Replace Slashes with "and"**: Better hyphenation
   ```latex
   % ❌ BAD - Causes overflow
   quality/performance metrics

   % ✓ GOOD - Allows line breaks
   quality and performance metrics
   ```

2. **Use `\url{}` for URLs**: Allows breaking
   ```latex
   % ❌ BAD
   https://github.com/user/very-long-repository-name

   % ✓ GOOD
   \url{https://github.com/user/very-long-repository-name}
   ```

3. **Shorten Technical Terms**: Use abbreviations when appropriate
   ```latex
   % ❌ BAD - Too long
   GPU-accelerated parallel rendering

   % ✓ GOOD - Concise
   GPU-based rendering
   ```

4. **Break Long Itemize Entries**: Split into multiple lines
   ```latex
   \item \textbf{Method}~\cite{ref}: Short description here.
   Additional details on next line if needed.
   ```

### Acceptable Overfull Warnings

**Not all overflows need fixing**:
- ✓ **<3pt**: Acceptable, imperceptible
- ⚠️ **3-7pt**: Minor, acceptable for drafts
- ❌ **>7pt**: Should fix, visible gaps

**Check with**:
```bash
pdflatex main.tex 2>&1 | grep "Overfull.*too wide"
```

### Figure and Table Placement

**Best Practices**:

1. **Use `[htbp]` placement**: Flexible positioning
   ```latex
   \begin{table}[htbp]  % here, top, bottom, page
   ```

2. **Don't Force Placement**: Let LaTeX optimize
   ```latex
   % ❌ BAD - Forces position
   \begin{table}[h!]

   % ✓ GOOD - Flexible
   \begin{table}[htbp]
   ```

3. **Reference Properly**: Always use `\ref{}`
   ```latex
   ... as shown in Table~\ref{tab:formats}.
   ```

### Common ACM Template Errors

1. **Missing Affiliation Fields**:
   ```latex
   % ❌ ERROR - Missing required fields
   \affiliation{%
     \institution{University}
   }

   % ✓ FIXED
   \affiliation{%
     \institution{University}
     \city{City}
     \country{Country}
   }
   ```

2. **Anonymous Submission**:
   ```latex
   \author{Anonymous Submission}
   \affiliation{%
     \institution{Anonymous for Review}
     \city{Anonymous}
     \country{Anonymous}
   }
   ```

### Compilation Best Practices

**⚠️ IMPORTANT: Only Compile When Necessary**
- **Don't recompile PDF after every .tex edit** - This wastes time during drafting
- **Only compile when**:
  - User explicitly asks to see the PDF
  - You need to verify final output (e.g., checking formatting, overflow issues)
  - Preparing for submission
  - Testing cross-references or citations
- During active writing/editing, focus on content without compiling

**Always compile multiple times** for cross-references:
```bash
# Clean build
rm -f main.aux main.bbl main.blg main.out
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex  # Third time resolves all references
```

**Check for issues**:
```bash
# Find undefined references
pdflatex main.tex 2>&1 | grep "undefined"

# Find overfull boxes
pdflatex main.tex 2>&1 | grep "Overfull"

# Check compilation success
pdflatex main.tex 2>&1 | grep "Output written"
```

### Quick Reference: Table Overflow Fix

When you see table overflow:
1. ✓ Add `\small` after `\caption{}`
2. ✓ Abbreviate text in cells
3. ✓ Use `p{width}` for text columns
4. ✓ Adjust column widths (`p{3cm}` → `p{2.5cm}`)
5. ✓ Consider removing optional columns if needed

**Example Fix**:
```latex
% BEFORE (overflows)
\begin{table}[htbp]
\caption{Comparison of 3D Gaussian Splatting web formats}
\begin{tabular}{@{}llp{3cm}@{}}
Format & Size & Features \\
PLY (original) & 1.0× & Full SH, uncompressed \\
...
\end{tabular}
\end{table}

% AFTER (fits)
\begin{table}[htbp]
\caption{3D Gaussian Splatting web format comparison}
\small  % Added to reduce size
\begin{tabular}{@{}llp{3.2cm}@{}}
Format & Size & Features \\
PLY & 1.0× & Full SH, uncompressed \\  % Shortened "PLY (original)" to "PLY"
...
\end{tabular}
\end{table}
```

---

## Summary

**THE THREE MOST CRITICAL RULES** (Never Break These):

1. ⚠️ **ALWAYS READ THE PAPER** - You MUST read at least the abstract and introduction of every paper you cite. Use WebFetch to verify claims. Never cite based on secondary sources, assumptions, or what you think the paper says.

2. ⚠️ **AVOID ALL HALLUCINATIONS**
   - **First-order**: Don't make up what a paper says
   - **Second-order**: Don't attribute claims to Paper A when they're actually from Paper B that Paper A cited
   - Verify every specific claim (FPS numbers, accuracy, dataset sizes) directly from the source paper

3. ⚠️ **TOP VENUES ONLY** - Only cite papers from:
   - **Graphics**: SIGGRAPH/ACM TOG, Eurographics, EGSR
   - **Vision**: CVPR, ICCV, ECCV, NeurIPS, ICML
   - **Journals**: TPAMI, IJCV, TVCG
   - Tools/formats can be GitHub/blogs but clearly distinguish from research papers

**Additional Important Rules**:
4. **DOIs for all peer-reviewed papers** - Enables verification
5. **Fix LaTeX overflows >7pt** - Use `\small`, abbreviate text, adjust widths
6. **Compile 3+ times** - pdflatex → bibtex → pdflatex → pdflatex

**When in Doubt**:
- Use WebFetch to read the paper abstract
- Ask the user if you're unsure about a claim
- Be conservative - don't cite if you can't verify
- Under-claim rather than over-claim

Follow these guidelines to maintain academic rigor and credibility for the WebGSBench project.
