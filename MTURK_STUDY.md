# MTurk User Study Protocol

## Overview

This document outlines the protocol for conducting a crowdsourced perceptual quality evaluation of 3D Gaussian Splatting formats using Amazon Mechanical Turk (MTurk).

**Study Goal**: Collect pairwise preference judgments to establish perceptual quality rankings of 3DGS compression formats and correlate with objective metrics.

**Platform**: Amazon Mechanical Turk (with Prolific as backup)

**Timeline**: June-August 2026 (post SIGGRAPH Asia submission)

**Budget**: $500-600 USD

---

## Study Design

### Task Type: Pairwise Comparison

**Task**: Workers view two versions of the same 3D scene and indicate which has better visual quality.

**Format**: Side-by-side interactive 3D viewers (Scene A vs Scene B)

**Questions per HIT**:
1. Which scene has better overall visual quality?
2. Which scene appears sharper/clearer?
3. Which scene looks smoother when rotating?
4. Attention check question

**Time per HIT**: ~2 minutes

**Payment per HIT**: $0.30 ($9/hour effective rate)

### Comparison Matrix

**Scenes**: 3 (bonsai, truck, playroom)

**Formats to compare**:
- Reference: .ply (uncompressed)
- Compressed: .splat, .ksplat, .spz

**Pairwise combinations per scene**:
- .ply vs .splat
- .ply vs .ksplat
- .ply vs .spz
- .splat vs .ksplat
- .splat vs .spz
- .ksplat vs .spz

**Total unique pairs**: 3 scenes × 6 comparisons = **18 unique comparisons**

**Viewpoints per pair**: 3 (front, detail, wide) to test consistency

**Total comparisons**: 18 pairs × 3 viewpoints = **54 unique HITs**

**Redundancy**: 10 workers per HIT

**Total HITs needed**: 54 × 10 = **540 HITs**

### Cost Breakdown

```
Worker payment:      $0.30 × 540 HITs = $162
MTurk fees (40%):    $162 × 0.40      = $65
Bonus pool (10%):    $162 × 0.10      = $16
Total:                                  $243

With 25% buffer:                        ~$300
```

**Note**: Original estimate was 1,350 HITs because I over-counted. With 3 scenes and strategic viewpoint selection, 540 HITs is sufficient and more cost-effective.

---

## Implementation Plan

### Phase 1: IRB Approval (May 2026)

**Timeline**: 2-4 weeks

**Required Documents**:
1. **Protocol Description**
   - Study purpose
   - Participant recruitment method (MTurk)
   - Task description
   - Data collected (anonymous preference judgments)
   - Risks (minimal - viewing 3D scenes)

2. **Informed Consent Form**
   ```
   Study Title: Perceptual Quality Evaluation of 3D Scenes
   
   Purpose: We are studying how people perceive quality differences 
   in 3D scene representations.
   
   Task: You will compare pairs of 3D scenes and indicate which 
   looks better. This takes about 2 minutes.
   
   Risks: Minimal. You may experience mild eye strain from viewing 
   3D graphics.
   
   Compensation: $0.30 per task
   
   Confidentiality: Your responses are anonymous. We collect no 
   personally identifiable information.
   
   Voluntary: You may withdraw at any time.
   
   Contact: [Your email] for questions
   IRB Contact: [Institution IRB]
   ```

3. **Recruitment Text** (MTurk HIT description)

4. **Data Management Plan**
   - Anonymous data storage
   - No IP addresses collected
   - Aggregated results only

**IRB Category**: Likely **Exempt** or **Expedited Review**
- No identifiable data
- Minimal risk
- Adult participants

**Action**: Submit IRB application immediately after SIGGRAPH Asia submission (May 2026)

### Phase 2: Technical Setup (June 2026)

**Week 1: Deploy Arena Mode Interface**

**Requirements**:
1. HTTPS hosting (required by MTurk for embedded iframes)
   - Options: Vercel, Netlify, AWS S3 + CloudFront
   - Recommendation: **Vercel** (free HTTPS, easy deploy)

2. Asset hosting (3D models)
   - Upload bonsai, truck, playroom in all formats
   - CDN for fast global loading
   - Recommendation: **AWS S3 + CloudFront** or **Vercel Edge**

3. MTurk integration
   - Embed viewer in iframe
   - Pass worker ID via URL parameter: `?workerId=${WORKER_ID}`
   - Submit results via MTurk form or API

**Technical Architecture**:
```
MTurk HIT Page
  └─> [Iframe] → Your Arena Mode Interface (HTTPS)
        ├─> Load Scene A (format 1)
        ├─> Load Scene B (format 2)
        ├─> User interacts (rotate, zoom)
        └─> User submits preference
            └─> POST to your backend
            └─> Return to MTurk with completion code
```

**Backend Needed**:
```javascript
// Simple Express.js API
app.post('/api/submit-judgment', (req, res) => {
  const { workerId, sceneId, formatA, formatB, 
          preference, sharpness, smoothness, 
          attentionCheck } = req.body;
  
  // Validate attention check
  if (attentionCheck !== expectedAnswer) {
    return res.status(400).json({ error: 'Failed attention check' });
  }
  
  // Store in database (Postgres/SQLite/Firebase)
  await db.judgments.insert({ 
    workerId: hash(workerId), // anonymize
    timestamp: Date.now(),
    sceneId, formatA, formatB,
    preference, sharpness, smoothness
  });
  
  // Return completion code
  res.json({ code: generateCompletionCode() });
});
```

**Week 2: Pilot Study (10 workers)**

**Goals**:
- Test technical infrastructure
- Validate task clarity
- Check loading times
- Identify confusing instructions
- Estimate actual completion time

**Checklist**:
- [ ] All 18 comparisons load correctly
- [ ] Scenes render properly on Chrome/Firefox/Safari
- [ ] Mobile users can complete task (if allowing)
- [ ] Completion time: 1.5-3 minutes (target: $9-12/hour effective wage)
- [ ] Attention checks work correctly
- [ ] Data captured correctly in database
- [ ] No worker complaints in feedback

**Adjustments**:
- Revise instructions if confusion detected
- Adjust payment if completion time off
- Fix any technical glitches
- Add viewpoint hints if workers struggle

### Phase 3: Full Study (July 2026)

**Week 1-2: Data Collection**

**MTurk HIT Configuration**:
```
Title: Compare Visual Quality of 3D Scenes

Description:
View two 3D scenes side-by-side and decide which looks better.
You can rotate and zoom the scenes to inspect quality.

Keywords: 3D, visual quality, image comparison, perception

Reward: $0.30

HITs Available: 540

Time Allotted: 10 minutes

HIT Expires In: 7 days

Auto-Approval: 24 hours

Worker Requirements:
- HIT Approval Rate ≥ 95%
- Number of HITs Approved ≥ 100
- Location: US, UK, CA, AU
- Adult (18+)
```

**Quality Control**:

1. **Attention Checks** (25% of HITs):
   - Compare .ply vs heavily compressed .spz (obvious difference)
   - Ask: "Which scene shows [specific object visible in scene]?"
   - Expected answer: Known correct response
   - Reject workers who fail

2. **Gold Standard HITs**:
   - Insert known comparisons (.ply is always better)
   - Workers who consistently fail → reject

3. **Consistency Checks**:
   - Same comparison shown twice (different viewpoints)
   - Workers who contradict themselves → flag for review

4. **Time-based Filtering**:
   - Reject completions < 30 seconds (didn't actually compare)
   - Reject completions > 5 minutes (likely distracted/inattentive)

5. **Inter-rater Agreement**:
   - Calculate Fleiss' kappa across workers
   - Identify outlier workers (always disagree with majority)
   - Reject and exclude outliers, re-run their HITs

**Monitoring**:
- Check dashboard daily
- Respond to worker questions within 4 hours
- Approve/reject HITs within 24 hours
- Monitor completion rate (should be ~90%+)

**Worker Communication**:
```
HIT Instructions (shown first):

=== Visual Quality Comparison Study ===

TASK: Compare two 3D scenes and decide which looks better.

INSTRUCTIONS:
1. Two scenes (A and B) will load side-by-side
2. Rotate and zoom both scenes to inspect quality
3. Look for: clarity, sharpness, artifacts, visual fidelity
4. Answer 4 quick questions about the scenes
5. Submit your responses

TIPS:
- Take your time to explore both scenes
- Rotate to see all angles
- Look for blur, distortion, missing details
- Trust your perception - there's no "wrong" answer

TIME: 2-3 minutes
PAY: $0.30 (~$9-12/hour)

By accepting this HIT, you consent to participate in this study.
Your responses are anonymous and will be used for academic research.

[START TASK]
```

**Daily Checklist**:
- [ ] Monitor completion rate
- [ ] Review flagged workers
- [ ] Respond to worker messages
- [ ] Approve/reject HITs
- [ ] Check for technical issues
- [ ] Export data for backup

### Phase 4: Data Analysis (August 2026)

**Week 1: Data Cleaning**

**Steps**:
1. Export all judgments from database
2. Filter out rejected HITs
3. Remove outlier workers (< 50% agreement with majority)
4. Check for missing data
5. Validate attention check performance

**Expected Data**:
```csv
workerId,sceneId,formatA,formatB,viewpoint,preference,sharpness,smoothness,timestamp
worker_abc,bonsai,ply,splat,front,A,A,A,2026-07-15T10:23:45Z
worker_def,bonsai,ply,splat,front,A,A,A,2026-07-15T10:25:12Z
worker_ghi,bonsai,ply,splat,front,B,A,A,2026-07-15T10:27:33Z
...
```

**Data Validation**:
- Minimum 8 valid judgments per comparison (after filtering)
- Inter-rater reliability κ ≥ 0.4 (moderate agreement)
- Attention check pass rate ≥ 80%

**Week 2: Statistical Analysis**

**Analysis 1: Bradley-Terry Model**

Fit Bradley-Terry model to estimate "quality score" for each format:

```python
import choix  # Bradley-Terry implementation

# Convert pairwise comparisons to win matrix
comparisons = []
for _, row in data.iterrows():
    winner = row['formatA'] if row['preference'] == 'A' else row['formatB']
    loser = row['formatB'] if row['preference'] == 'A' else row['formatA']
    comparisons.append((format_to_id[winner], format_to_id[loser]))

# Fit Bradley-Terry model
scores = choix.ilsr_pairwise(n_items=4, data=comparisons)

# Normalize to Elo ratings
elo_ratings = 1500 + (scores - np.mean(scores)) * 400
```

**Analysis 2: Correlation with Objective Metrics**

```python
import scipy.stats as stats

# Load PSNR/SSIM from benchmarking paper
objective_scores = load_objective_metrics()  # From SIGGRAPH Asia data

# Correlate Bradley-Terry scores with PSNR
pearson_r, p_value = stats.pearsonr(elo_ratings, objective_scores['psnr'])
spearman_r, p_value = stats.spearmanr(elo_ratings, objective_scores['psnr'])

# Identify divergences (where metrics fail)
divergent_cases = []
for scene, format in comparisons:
    if (subjective_rank[format] - objective_rank[format]) > threshold:
        divergent_cases.append((scene, format))
```

**Analysis 3: Failure Modes**

Identify specific cases where:
- High PSNR but low subjective rating (false positive)
- Low PSNR but high subjective rating (false negative)
- Metrics disagree with humans on ranking

**Analysis 4: Cross-Scene Consistency**

Check if preference patterns hold across scenes:
```python
# Does .splat always beat .ksplat across all scenes?
consistency_matrix = np.zeros((n_formats, n_formats))
for scene in scenes:
    for formatA, formatB in pairs:
        winner = get_majority_preference(scene, formatA, formatB)
        consistency_matrix[formatA][formatB] += (winner == formatA)
```

**Outputs for Paper**:
1. Table: Bradley-Terry scores (Elo ratings) per format
2. Table: PSNR/SSIM vs subjective rank correlation
3. Figure: Scatter plot (objective vs subjective)
4. Figure: Heatmap of pairwise preferences
5. Case studies: 3-5 examples where metrics fail

---

## HIT Interface Design

### Option A: Embedded Viewer (Recommended)

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  Visual Quality Comparison Study                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Instructions: Compare the two 3D scenes below...       │
│                                                          │
│  ┌────────────────────┐  ┌────────────────────┐        │
│  │                    │  │                    │        │
│  │   Scene A          │  │   Scene B          │        │
│  │                    │  │                    │        │
│  │  [3D Viewer]       │  │  [3D Viewer]       │        │
│  │                    │  │                    │        │
│  │  Click to rotate   │  │  Click to rotate   │        │
│  │                    │  │                    │        │
│  └────────────────────┘  └────────────────────┘        │
│                                                          │
│  Questions:                                             │
│  1. Which scene has better overall quality?             │
│     ○ Scene A    ○ Scene B    ○ About the same         │
│                                                          │
│  2. Which scene appears sharper/clearer?                │
│     ○ Scene A    ○ Scene B    ○ About the same         │
│                                                          │
│  3. Which scene looks smoother when rotating?           │
│     ○ Scene A    ○ Scene B    ○ About the same         │
│                                                          │
│  4. [Attention Check] What object is shown in scene?    │
│     ○ Tree    ○ Car    ○ Building    ○ Animal          │
│                                                          │
│  [Submit]                                               │
└─────────────────────────────────────────────────────────┘
```

**Features**:
- Synchronized camera (optional: toggle sync)
- Reset camera button
- Loading indicators
- Auto-start rotation on load (draw attention)

### Option B: Video Comparison (Fallback)

If interactive viewers have issues (loading time, WebGL compatibility):

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│  ┌────────────────────┐  ┌────────────────────┐        │
│  │  [Video A]         │  │  [Video B]         │        │
│  │  10 sec loop       │  │  10 sec loop       │        │
│  └────────────────────┘  └────────────────────┘        │
│                                                          │
│  [Play/Pause] [Restart]                                 │
│                                                          │
│  Questions: [same as above]                             │
└─────────────────────────────────────────────────────────┘
```

**Video specs**:
- 10 seconds per video
- 1080p, 60fps
- Synchronized rotation path
- H.264, high quality encode

---

## Risk Mitigation

### Risk 1: Low Worker Participation
**Symptoms**: HITs not completing after 2-3 days
**Solutions**:
- Increase payment to $0.40-0.50
- Reduce qualifications (lower approval rate to 90%)
- Add bonus incentive ($0.10 for 10+ HITs)
- Post in MTurk forums/subreddits

### Risk 2: Poor Quality Responses
**Symptoms**: Random clicking, failing attention checks
**Solutions**:
- Implement stricter qualification test
- Increase redundancy (15 workers per HIT)
- Use "master" workers only (MTurk premium qualification)
- Switch to Prolific (higher quality, higher cost)

### Risk 3: Technical Issues
**Symptoms**: Workers report scenes not loading
**Solutions**:
- Pre-load assets with loading bar
- Reduce model complexity (decimate if needed)
- Provide "skip" option with penalty
- Fall back to video comparison (Option B)

### Risk 4: Insufficient Statistical Power
**Symptoms**: High variance in responses, no clear preferences
**Solutions**:
- Increase redundancy to 15-20 workers per HIT
- Focus on fewer comparisons (drop borderline cases)
- Collect more data (extend study timeline)

### Risk 5: IRB Delays
**Symptoms**: Approval takes > 4 weeks
**Solutions**:
- Submit expedited review (minimal risk)
- Contact IRB directly to expedite
- Run pilot without IRB (if institution allows)
- Delay study launch, still meet CHI deadline

---

## Timeline Summary

```
May 2026:
  Week 1: Submit SIGGRAPH Asia paper ✅
  Week 2: Submit IRB application
  Week 3: IRB review
  Week 4: IRB review

June 2026:
  Week 1: IRB approval, deploy interface
  Week 2: Pilot study (10 workers)
  Week 3: Fix issues, prepare full launch
  Week 4: Launch full study (540 HITs)

July 2026:
  Week 1: Data collection continues
  Week 2: Monitor and approve HITs
  Week 3: Data cleaning
  Week 4: Statistical analysis

August 2026:
  Week 1: Write CHI paper (methodology focus)
  Week 2: Create figures, polish paper
  Week 3: Internal review
  Week 4: Final edits

September 4, 2026:
  Submit CHI 2027 ✅
```

---

## Budget Summary

| Item | Cost |
|------|------|
| MTurk worker payments | $162 |
| MTurk platform fees (40%) | $65 |
| Bonus pool (10% extra) | $16 |
| Hosting (Vercel/AWS) | $20 |
| Database (Firebase/Supabase) | $10 |
| Buffer (unexpected costs) | $27 |
| **Total** | **~$300** |

**Note**: With institutional AWS/Google Cloud credits, hosting may be free.

---

## Success Criteria

### Minimal Success
- ✅ 400+ valid HITs (75% of target)
- ✅ Inter-rater reliability κ ≥ 0.3
- ✅ Sufficient data to fit Bradley-Terry model
- ✅ At least 1 clear divergence from objective metrics

### Target Success
- ✅ 500+ valid HITs (90% of target)
- ✅ Inter-rater reliability κ ≥ 0.4
- ✅ Significant correlation with PSNR/SSIM (p < 0.05)
- ✅ 3-5 clear cases where metrics fail

### Excellent Success
- ✅ 540+ valid HITs (100% completion)
- ✅ Inter-rater reliability κ ≥ 0.5
- ✅ Strong correlation but identifiable divergences
- ✅ Clear patterns across scenes
- ✅ Novel insights about human perception of 3DGS quality

---

## References

**Similar Studies Using MTurk for Perceptual Evaluation**:
- Chatbot Arena [ICML 2024] - Crowdsourced LLM evaluation
- "Perceptual Losses for Real-Time Style Transfer" [ECCV 2016] - MTurk for image quality
- "Perceptually-Motivated Mesh Simplification" [SIGGRAPH] - MTurk for 3D model quality
- "The Unreasonable Effectiveness of Deep Features as a Perceptual Metric" [CVPR 2018] - Validation using crowdsourcing

**MTurk Best Practices**:
- "Best Practices for Conducting Crowdsourced Perceptual Studies" [ACM CHI]
- "Quality Control on Amazon Mechanical Turk" [ACM CSCW]
- IRB guidelines for MTurk research

---

## Contact and Resources

**MTurk Resources**:
- Requester dashboard: https://requester.mturk.com/
- Developer docs: https://docs.aws.amazon.com/mturk/
- Academic subreddit: r/mturk, r/TurkerNation

**Alternatives**:
- Prolific: https://www.prolific.co/
- CloudResearch: https://www.cloudresearch.com/

**IRB Resources**:
- [Your institution IRB website]
- Common Rule exemption categories
- Template consent forms for online studies

**Technical Stack**:
- Frontend: Existing Arena Mode (React + Vite)
- Backend: Express.js or Supabase Functions
- Database: PostgreSQL (Supabase) or Firebase
- Hosting: Vercel (frontend) + Railway/Render (backend)

---

## Next Steps

**Immediate** (May 2026):
1. Draft IRB protocol
2. Design HIT interface mockup
3. Estimate exact sample size (power analysis)

**After SIGGRAPH Asia submission** (June 2026):
4. Deploy interface to HTTPS
5. Run pilot with 10 workers
6. Launch full study

**For CHI paper** (August 2026):
7. Analyze data
8. Write methodology section
9. Create figures
10. Submit paper
