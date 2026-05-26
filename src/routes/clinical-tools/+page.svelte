<script>
	import PHQ9Tool from '$lib/components/PHQ9Tool.svelte';
	import GAD7Tool from '$lib/components/GAD7Tool.svelte';
	import AUDITTool from '$lib/components/AUDITTool.svelte';
	import DAST10Tool from '$lib/components/DAST10Tool.svelte';
	import PCPTSD5Tool from '$lib/components/PCPTSD5Tool.svelte';
	import ASRS6Tool from '$lib/components/ASRS6Tool.svelte';
	import NormsTool from '$lib/components/NormsTool.svelte';
</script>

<svelte:head>
	<title>Clinical Screening Tools | Plan Your Recovery</title>
	<meta
		name="description"
		content="Validated screening instruments for clinicians — PHQ-9, GAD-7, and more. Brief, evidence-based tools to support clinical intake and monitoring."
	/>
</svelte:head>

<div class="page">
	<section class="hero">
		<div class="container">
			<p class="eyebrow">For Practitioners</p>
			<h1>Clinical Screening Tools</h1>
			<p class="intro">
				Brief, validated instruments to support clinical intake and symptom monitoring. Each tool
				is scored in-browser — no data is collected or transmitted.
			</p>
		</div>
	</section>

	<section class="tools">
		<div class="container">
			<div class="tools-grid">

				<div class="tool-card">
					<div class="card-accent accent-blue"></div>
					<div class="card-body">
						<div class="tool-meta">
							<span class="tool-tag">Depression</span>
							<span class="tool-detail">9 items &middot; ~3 min</span>
						</div>
						<h2>PHQ-9</h2>
						<p class="tool-name-full">Patient Health Questionnaire</p>
						<p class="tool-desc">
							Screens for and measures the severity of major depressive disorder. Widely used in
							primary care and behavioral health settings. Validated against structured clinical
							interview.
						</p>
						<div class="score-guide">
							<span>0–4 Minimal</span>
							<span>5–9 Mild</span>
							<span>10–14 Moderate</span>
							<span>15–19 Mod. Severe</span>
							<span>20–27 Severe</span>
						</div>
						<PHQ9Tool />
					</div>
				</div>

				<div class="tool-card">
					<div class="card-accent accent-green"></div>
					<div class="card-body">
						<div class="tool-meta">
							<span class="tool-tag">Anxiety</span>
							<span class="tool-detail">7 items &middot; ~2 min</span>
						</div>
						<h2>GAD-7</h2>
						<p class="tool-name-full">Generalized Anxiety Disorder Scale</p>
						<p class="tool-desc">
							Screens for generalized anxiety disorder and assesses symptom severity. Also performs
							well as a screener for panic disorder, social anxiety, and PTSD.
						</p>
						<div class="score-guide">
							<span>0–4 Minimal</span>
							<span>5–9 Mild</span>
							<span>10–14 Moderate</span>
							<span>15–21 Severe</span>
						</div>
						<GAD7Tool />
					</div>
				</div>

				<div class="tool-card">
					<div class="card-accent accent-yellow"></div>
					<div class="card-body">
						<div class="tool-meta">
							<span class="tool-tag">Alcohol</span>
							<span class="tool-detail">10 items &middot; ~3 min</span>
						</div>
						<h2>AUDIT</h2>
						<p class="tool-name-full">Alcohol Use Disorders Identification Test</p>
						<p class="tool-desc">
							WHO-developed tool to identify hazardous, harmful, and dependent alcohol use. Includes
							the 3-item AUDIT-C for rapid screening in time-limited settings.
						</p>
						<div class="score-guide">
							<span>0–7 Lower risk</span>
							<span>8–15 Increasing risk</span>
							<span>16–19 Higher risk</span>
							<span>20–40 Dependence</span>
						</div>
						<AUDITTool />
					</div>
				</div>

				<div class="tool-card">
					<div class="card-accent accent-purple"></div>
					<div class="card-body">
						<div class="tool-meta">
							<span class="tool-tag">Substances</span>
							<span class="tool-detail">10 items &middot; ~3 min</span>
						</div>
						<h2>DAST-10</h2>
						<p class="tool-name-full">Drug Abuse Screening Test</p>
						<p class="tool-desc">
							Screens for drug use problems over the past 12 months, excluding alcohol and tobacco.
							Validated across a range of substances and clinical populations.
						</p>
						<div class="score-guide">
							<span>0 None</span>
							<span>1–2 Low</span>
							<span>3–5 Moderate</span>
							<span>6–8 Substantial</span>
							<span>9–10 Severe</span>
						</div>
						<DAST10Tool />
					</div>
				</div>

				<div class="tool-card">
					<div class="card-accent accent-teal"></div>
					<div class="card-body">
						<div class="tool-meta">
							<span class="tool-tag">PTSD</span>
							<span class="tool-detail">5 items &middot; ~2 min</span>
						</div>
						<h2>PC-PTSD-5</h2>
						<p class="tool-name-full">Primary Care PTSD Screen for DSM-5</p>
						<p class="tool-desc">
							Brief PTSD screen designed for primary care and other medical settings. High sensitivity
							makes it suitable for initial triage; positive screens should prompt full assessment.
						</p>
						<div class="score-guide">
							<span>&lt; 4 Negative screen</span>
							<span>≥ 4 Positive screen</span>
						</div>
						<PCPTSD5Tool />
					</div>
				</div>

				<div class="tool-card">
					<div class="card-accent accent-orange"></div>
					<div class="card-body">
						<div class="tool-meta">
							<span class="tool-tag">ADHD</span>
							<span class="tool-detail">6 items &middot; ~2 min</span>
						</div>
						<h2>ASRS-6</h2>
						<p class="tool-name-full">Adult ADHD Self-Report Scale</p>
						<p class="tool-desc">
							WHO-developed screener for adult ADHD. The 6-item version has high sensitivity and
							specificity and is well-suited to busy clinical settings.
						</p>
						<div class="score-guide">
							<span>&lt; 4 Negative screen</span>
							<span>≥ 4 Positive screen</span>
						</div>
						<ASRS6Tool />
					</div>
				</div>

			</div>
		</div>
	</section>

	<section class="norms">
		<div class="container">
			<p class="eyebrow">Normative Feedback</p>
			<h2>How Does My Use Compare?</h2>
			<p class="norms-intro">
				Compare your substance use to U.S. national averages from the 2021–2024 National Survey on
				Drug Use and Health (NSDUH). Select a substance, filter by age and gender, and see where
				you fall on the actual population distribution.
			</p>
			<NormsTool />
		</div>
	</section>

	<section class="notice">
		<div class="container">
			<p>
				These tools are intended to support — not replace — clinical judgment. Scores should be
				interpreted in the context of a complete clinical evaluation. All results are processed
				entirely in the user's browser and are never transmitted to or stored by Plan Your Recovery.
			</p>
		</div>
	</section>
</div>

<style lang="scss">
	.page { width: 100%; }

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--container-padding);
	}

	.hero {
		padding: var(--space-large) 0 var(--space-small);

		.eyebrow {
			font-size: 0.8rem;
			font-weight: 600;
			letter-spacing: 0.08em;
			text-transform: uppercase;
			color: var(--accent, var(--c-blue));
			filter: brightness(0.75);
			margin-bottom: 0.5rem;
		}

		h1 { margin-bottom: var(--space-tiny); }

		.intro {
			font-size: 1.1rem;
			line-height: 1.7;
			max-width: 680px;
			color: #444;
		}
	}

	.tools {
		padding: var(--space-small) 0 var(--space-large);
	}

	.tools-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;

		@media (min-width: 640px) {
			grid-template-columns: repeat(2, 1fr);
		}

		@media (min-width: 1000px) {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.tool-card {
		display: flex;
		flex-direction: column;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		overflow: hidden;
		background: white;
		transition: box-shadow 0.2s;

		&:not(.coming-soon):hover {
			box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
		}

		&.coming-soon {
			opacity: 0.6;
		}
	}

	.card-accent {
		height: 6px;
		flex-shrink: 0;

		&.accent-blue   { background: var(--c-blue, #4a90d9); }
		&.accent-green  { background: var(--c-green, #34a853); }
		&.accent-yellow { background: var(--c-yellow, #f5a623); }
		&.accent-purple { background: var(--c-purple, #9b59b6); }
		&.accent-teal   { background: #2a9d8f; }
		&.accent-orange { background: #e76f51; }
	}

	.card-body {
		padding: 1.25rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tool-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.tool-tag {
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		background: #f0f0f0;
		padding: 0.2rem 0.55rem;
		border-radius: 3px;
		color: #555;
	}

	.tool-detail {
		font-size: 0.8rem;
		color: #888;
		font-family: ibm-plex-mono, monospace;
	}

	h2 {
		font-size: 1.6rem;
		margin: 0;
		line-height: 1.1;
		color: var(--c-dark);
	}

	.tool-name-full {
		font-size: 0.8rem;
		color: #888;
		margin: 0;
	}

	.tool-desc {
		font-size: 0.875rem;
		line-height: 1.6;
		color: #555;
		margin: 0;
		flex: 1;
	}

	.score-guide {
		display: flex;
		flex-wrap: wrap;
		gap: 0.3rem;
		margin-top: 0.25rem;

		span {
			font-size: 0.72rem;
			font-family: ibm-plex-mono, monospace;
			background: #f5f5f5;
			border: 1px solid #e8e8e8;
			border-radius: 3px;
			padding: 0.15rem 0.4rem;
			color: #555;
		}
	}

	.soon-badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		background: #f0f0f0;
		color: #888;
		padding: 0.3rem 0.65rem;
		border-radius: 20px;
		align-self: flex-start;
		margin-top: 0.5rem;
	}

	.norms {
		padding: var(--space-small) 0 var(--space-large);
		border-top: 1px solid #e8e8e8;

		h2 {
			font-size: 1.5rem;
			margin-bottom: var(--space-tiny);
			color: var(--c-dark);
		}

		.norms-intro {
			font-size: 0.95rem;
			line-height: 1.7;
			max-width: 680px;
			color: #555;
			margin-bottom: 1.25rem;
		}
	}

	.notice {
		background: #f8f8f8;
		border-top: 1px solid #e8e8e8;
		padding: var(--space-small) 0;

		p {
			font-size: 0.85rem;
			line-height: 1.7;
			color: #666;
			max-width: 800px;
			font-style: italic;
			margin: 0;
		}
	}
</style>
