# Arena Mode Paper Strategy

## Three-Paper Publication Strategy

### Paper 1: SIGGRAPH Asia 2026 (Foundation)
**Title**: "WebGSBench: Benchmarking 3D Gaussian Splatting for Web Deployment"
- **Deadline**: May 2026
- **Notification**: September 2026
- **Conference**: December 2026
- **Status**: Primary focus, data collection in progress

**Contribution**: 
- Benchmarking infrastructure
- Objective quality metrics (PSNR/SSIM)
- Performance benchmarks (FPS, load time, memory)
- Browser compatibility analysis
- Mentions arena-style comparison UI as future work

---

### Paper 2: CHI 2027 (Methodology)
**Title**: "Arena Mode: A Crowdsourced Framework for Perceptual Quality Assessment of 3D Gaussian Splatting"
- **Deadline**: September 4, 2026 (~2 weeks BEFORE SIGGRAPH Asia notification)
- **Notification**: ~January 2027
- **Conference**: April 2027
- **Status**: Contingent on SIGGRAPH Asia acceptance

**Contribution** (HCI/Methodology Focus):
- Interactive interface for pairwise 3D scene comparisons
- Crowdsourced data collection pipeline
- Statistical framework (Bradley-Terry model, Elo ratings)
- Design decisions for 3D quality comparison UI
- Generalizable methodology for 3D format evaluation

**Key Framing**:
- Focus on the **tool/system** for collecting perceptual data
- Contribution is the **methodology**, not the findings
- Demonstrate system works and collects reliable data
- Show applicability beyond 3DGS (other 3D formats)

**Related Work**:
- Cite Chatbot Arena [ICML 2024] as inspiration
- Position as adaptation for 3D graphics domain
- Emphasize HCI contributions (interface design, crowdsourcing)

**Evaluation**:
- User study with 50-100 participants
- Inter-rater reliability
- System usability metrics
- Data quality validation
- Example findings (but not deep analysis)

---

### Paper 3: SIGGRAPH 2027 (Perceptual Findings)
**Title**: "When Metrics Fail: Perceptual Quality Assessment of 3D Gaussian Splatting Compression"
- **Deadline**: January 2027 (abstract), February 2027 (full paper)
- **Notification**: ~May 2027
- **Conference**: July 2027
- **Status**: Fallback if CHI rejects, OR follow-up if CHI accepts

**Two Scenarios**:

#### Scenario A: CHI Rejects Arena Paper
**Strategy**: Combine methodology + findings into one SIGGRAPH paper
- Include interface design (but condensed)
- Focus heavily on perceptual findings
- Use CHI reviews to strengthen paper
- Full contribution: system + findings

#### Scenario B: CHI Accepts Arena Paper
**Strategy**: Pure findings paper that cites CHI 2027
- Reference CHI paper for methodology
- Focus 100% on graphics findings
- Deep analysis of perceptual quality
- Implications for 3DGS compression research

**Contribution** (Graphics Focus):
- Perceptual rankings of compression formats
- Correlation analysis: objective vs subjective metrics
- Failure cases: when PSNR/SSIM mislead
- Which artifacts matter to humans?
- Guidance for 3DGS compression research

**Key Framing**:
- Focus on **what we learned** about human perception
- Contribution is the **findings**, not the tool
- Graphics community implications
- Challenge assumptions about metric reliability

**Related Work**:
- Cite SIGGRAPH Asia 2026 paper (benchmarking foundation)
- Cite CHI 2027 paper IF accepted (methodology)
- Deep dive into perceptual graphics literature
- Compare to perceptual studies in rendering/compression

**Evaluation**:
- Deep statistical analysis of preference data
- Case studies of metric failures
- Perceptual dimensions (quality vs smoothness vs clarity)
- Compression threshold analysis
- Cross-scene patterns

---

## Timeline

### 2026

**Now - February 2026** (4 weeks):
- Data collection for SIGGRAPH Asia paper
- Focus: Objective metrics, performance benchmarks

**March - April 2026** (8 weeks):
- Write SIGGRAPH Asia paper (Framework, Experiments, Results)
- Create figures and polish
- Implement basic Arena UI (for "future work" figure)

**May 2026**:
- Submit SIGGRAPH Asia 2026 ✅

**June - September 2026** (During SIGGRAPH Asia Review):
- Run user study (50-100 participants)
- Collect pairwise preference data
- Analyze results
- Write CHI paper (methodology focus)

**September 4, 2026**:
- Submit CHI 2027 ✅
- **2 weeks before SIGGRAPH Asia notification**

**September 2026**:
- SIGGRAPH Asia notification
- **Decision Point**: Continue with CHI or pivot?

**October 2026 - January 2027**:
- If SIGGRAPH Asia accepted: Polish presentation, prepare camera-ready
- If CHI notification comes (Jan 2027): Assess status
- Prepare SIGGRAPH 2027 paper (either way)

### 2027

**January 2027**:
- CHI 2027 notification (likely)
- **Decision Point**:
  - **CHI accepted**: Write pure findings paper for SIGGRAPH 2027
  - **CHI rejected**: Combine methodology + findings for SIGGRAPH 2027

**January-February 2027**:
- Write/revise SIGGRAPH 2027 paper
- Submit by February 2027 deadline ✅

**April 2027**:
- Present at CHI 2027 (if accepted)

**May 2027**:
- SIGGRAPH 2027 notification

**July 2027**:
- Present at SIGGRAPH 2027 (if accepted)

**December 2026**:
- Present at SIGGRAPH Asia 2026

---

## Risk Mitigation

### Risk 1: SIGGRAPH Asia Rejects (Sept 2026)
**Impact**: Foundation paper missing, CHI already submitted
**Mitigation**:
- CHI paper can stand alone (cite arXiv version of benchmarking work)
- Resubmit benchmarking to SIGGRAPH 2027 or EGSR 2027
- Arena paper can reference "submitted" work

### Risk 2: Both SIGGRAPH Asia and CHI Reject
**Impact**: No foundation, methodology paper rejected
**Mitigation**:
- Combine all three contributions into one comprehensive SIGGRAPH 2027 paper:
  - Benchmarking framework + Arena methodology + Perceptual findings
- Use reviews to strengthen combined paper
- Alternatively: Submit benchmarking to EGSR 2027, arena to SIGGRAPH 2027

### Risk 3: Can't Complete User Study in Time for CHI
**Impact**: Miss CHI deadline (Sept 4, 2026)
**Mitigation**:
- Skip CHI 2027 entirely
- Focus on comprehensive SIGGRAPH 2027 paper
- More time for thorough study and analysis

### Risk 4: User Study Data Insufficient
**Impact**: Not enough participants or unreliable data
**Mitigation**:
- Pilot study first (10-20 users) to validate methodology
- Recruit from MTurk/Prolific for scale
- Over-recruit to account for attention check failures
- Budget for participant compensation

---

## Content Boundaries (Avoiding Overlap)

### SIGGRAPH Asia 2026 Paper
**Includes**:
- ✅ Framework architecture
- ✅ Objective metrics (PSNR/SSIM)
- ✅ Performance benchmarks
- ✅ Browser compatibility
- ✅ Screenshot of Arena UI (future work)

**Excludes**:
- ❌ User study results
- ❌ Perceptual rankings
- ❌ Bradley-Terry analysis
- ❌ Subjective vs objective comparison

### CHI 2027 Paper (Methodology Focus)
**Includes**:
- ✅ Interface design rationale
- ✅ Pairwise comparison protocol
- ✅ Crowdsourcing pipeline
- ✅ Bradley-Terry model implementation
- ✅ Data quality validation
- ✅ Basic findings (proof of concept)

**Excludes**:
- ❌ Deep perceptual analysis
- ❌ Extensive graphics implications
- ❌ Detailed compression failure modes
- ❌ Scene-specific findings

### SIGGRAPH 2027 Paper (Findings Focus)
**Includes**:
- ✅ Perceptual rankings and patterns
- ✅ Metric correlation analysis
- ✅ Failure case studies
- ✅ Compression artifact importance
- ✅ Graphics research implications
- ✅ Design recommendations for 3DGS compression

**Excludes** (if CHI accepted):
- ❌ Interface design details (cite CHI)
- ❌ Crowdsourcing methodology (cite CHI)
- ❌ Basic statistics (cite CHI)

**Includes** (if CHI rejected):
- ✅ Condensed methodology section
- ✅ All of the above findings
- ✅ Combined contribution

---

## Success Criteria

### Minimum Success (1 paper)
- ✅ SIGGRAPH Asia 2026 accepted
- ⚠️ CHI 2027 rejected
- ⚠️ SIGGRAPH 2027 rejected
- **Result**: One benchmarking paper published

### Good Success (2 papers)
**Path A**: SIGGRAPH Asia + CHI
- ✅ SIGGRAPH Asia 2026 accepted
- ✅ CHI 2027 accepted
- ⚠️ SIGGRAPH 2027 rejected/not submitted
- **Result**: Benchmarking + methodology papers

**Path B**: SIGGRAPH Asia + SIGGRAPH
- ✅ SIGGRAPH Asia 2026 accepted
- ⚠️ CHI 2027 rejected
- ✅ SIGGRAPH 2027 accepted (combined paper)
- **Result**: Benchmarking + comprehensive findings

### Best Success (3 papers)
- ✅ SIGGRAPH Asia 2026 accepted (benchmarking)
- ✅ CHI 2027 accepted (methodology)
- ✅ SIGGRAPH 2027 accepted (findings)
- **Result**: Complete story across venues

---

## Key Decision Points

### Decision Point 1: September 4, 2026
**Question**: Submit to CHI 2027?
**Conditions**:
- ✅ User study complete
- ✅ Arena UI fully functional
- ✅ Data analysis done
- ✅ Paper draft ready

**If any condition fails**: Skip CHI, focus on SIGGRAPH 2027

### Decision Point 2: September 2026
**Question**: SIGGRAPH Asia accepted?
**If YES**: Continue with plan
**If NO**: 
- Assess CHI paper (already submitted)
- Plan to resubmit benchmarking work
- Consider combined SIGGRAPH 2027 paper

### Decision Point 3: January 2027
**Question**: CHI accepted?
**If YES**: Write pure findings paper for SIGGRAPH 2027
**If NO**: Combine methodology + findings for SIGGRAPH 2027

---

## Notes

- **Non-competing deadlines**: CHI (Sept 2026) → SIGGRAPH Asia notification (Sept 2026) → SIGGRAPH (Feb 2027)
- **Fallback strategy**: Every rejection has a resubmission path
- **Modular contributions**: Can combine or separate as needed
- **Citation chain**: Each paper cites the previous (if accepted)
- **Community reach**: Graphics (SIGGRAPH Asia/2027) + HCI (CHI) = broader impact

---

## References for Arena Paper

**Must cite**:
- Chatbot Arena [ICML 2024] - Methodology inspiration
- Bradley & Terry 1952 - Statistical model
- ITU-R BT.500 - Subjective assessment standard
- SIGGRAPH Asia 2026 paper - Benchmarking foundation (once published)

**Related perceptual studies** (to find):
- Perceptual quality papers in SIGGRAPH
- Compression psychophysics studies
- User studies in graphics
