<script>
  import FAQ from '$lib/components/FAQ.svelte';
  import pageData from '$lib/content/conditions/depression.json';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalCondition',
    'name': pageData.condition.name,
    'alternateName': pageData.condition.alternateName ?? [],
    'description': pageData.condition.schemaDescription,
    'possibleTreatment': pageData.treatments.map(t => ({
      '@type': 'MedicalTherapy',
      'name': t.name
    }))
  };
</script>

<svelte:head>
  <title>{pageData.seo.title}</title>
  <meta name="description" content={pageData.seo.description} />
  {@html `<script type="application/ld+json">${JSON.stringify(schema)}</script>`}
</svelte:head>

<div class="page">
  <section class="hero">
    <div class="container">
      <h1>{pageData.hero.headline}</h1>
      <p class="intro">{pageData.hero.intro}</p>
    </div>
  </section>

  <section class="criteria">
    <div class="container">
      <h2>{pageData.criteria.heading}</h2>
      <p>{pageData.criteria.description}</p>
      <ul class="criteria-list">
        {#each pageData.criteria.items as item}
          <li><strong>{item.label}:</strong> {item.description}</li>
        {/each}
      </ul>
      {#if pageData.criteria.note}
        <p class="criteria-note">{pageData.criteria.note}</p>
      {/if}
    </div>
  </section>

  <section class="how-it-feels">
    <div class="container">
      <h2>{pageData.howItFeels.heading}</h2>
      {#each pageData.howItFeels.paragraphs as p}
        <p>{p}</p>
      {/each}
    </div>
  </section>

  <section class="treatment">
    <div class="container">
      <h2>{pageData.treatmentSection.heading}</h2>
      <p>{pageData.treatmentSection.intro}</p>
      <div class="treatments-grid">
        {#each pageData.treatments as treatment}
          <div class="treatment-card">
            <h3>{treatment.name}</h3>
            <p>{treatment.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <FAQ items={pageData.faqs} heading="Common Questions" />

  <section class="cta">
    <div class="container">
      <h2>Ready to Talk?</h2>
      <p>Our clinicians are experienced in treating {pageData.condition.name.toLowerCase()} alongside co-occurring conditions. Getting started begins with a conversation.</p>
      <div class="cta-actions">
        <a href="/booking/" class="button--link"><button class="primary">Make an Appointment</button></a>
        <div class="contact-info">
          <a href="tel:314-222-5896">314-222-5896</a>
          <span> · </span>
          <a href="mailto:info@planyourrecovery.com">info@planyourrecovery.com</a>
        </div>
      </div>
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

  section { padding: var(--space-large) 0; }

  .hero {
    padding: var(--space-xlarge) 0 var(--space-large);
    h1 { margin-bottom: var(--space-tiny); }
    .intro {
      font-size: 1.15rem;
      max-width: 720px;
      line-height: 1.7;
    }
  }

  .criteria {
    background-color: #f8f8f8;
    border-left: 4px solid var(--c-blue);
    .criteria-list {
      margin: var(--space-tiny) 0;
      padding-left: 1.5rem;
      li {
        margin-bottom: 0.75rem;
        line-height: 1.6;
      }
    }
    .criteria-note {
      font-style: italic;
      color: #666;
      font-size: 0.925rem;
    }
  }

  .how-it-feels {
    p { max-width: 720px; line-height: 1.8; margin-bottom: var(--space-tiny); }
  }

  .treatment {
    background-color: #f8f8f8;
    .treatments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: var(--space-small);
      margin-top: var(--space-small);
    }
    .treatment-card {
      background: white;
      padding: var(--space-tiny);
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      h3 { margin-bottom: 0.5rem; font-size: 1.1rem; }
      p { font-size: 0.95rem; line-height: 1.6; margin: 0; }
    }
  }

  .cta {
    background-color: var(--c-blue);
    color: white;
    text-align: center;
    h2 { margin-bottom: var(--space-tiny); }
    p { max-width: 600px; margin: 0 auto var(--space-small); }
    .cta-actions { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .contact-info {
      font-size: 1.1rem;
      a { color: white; box-shadow: 0 1px 0 0 white; }
    }
  }

  @media (min-width: 768px) {
    .cta .cta-actions { flex-direction: row; justify-content: center; }
  }
</style>
