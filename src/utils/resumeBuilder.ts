/**
 * Synthesizes high-impact 20-LPA level resume bullets using Google's "XYZ" formula:
 * Accomplished [X] as measured by [Y], by doing [Z].
 * Optimized for Member Technical at ADP transitioning to Senior Backend & Applied AI.
 */

interface BulletParams {
  featureOrBug: string;
  techStack: string;
  rootCauseOrBreakthrough: string;
  measurableImpact: string;
  used10MinNoAiRule: boolean;
}

export const generate20LpaResumeBullets = (params: BulletParams): string[] => {
  const { featureOrBug, techStack, rootCauseOrBreakthrough, measurableImpact } = params;

  // Clean strings
  const feature = featureOrBug.trim().replace(/\.$/, '');
  const tech = techStack.trim();
  const breakthrough = rootCauseOrBreakthrough.trim().replace(/\.$/, '');
  const impact = measurableImpact.trim().replace(/\.$/, '');

  const bullets: string[] = [];

  // Bullet 1: Engineering & Performance Focus
  if (impact && tech) {
    bullets.push(
      `Engineered ${feature.toLowerCase().startsWith('optimized') || feature.toLowerCase().startsWith('built') ? feature : 'and optimized ' + feature} using ${tech}, resolving ${breakthrough.toLowerCase()} to achieve ${impact}.`
    );
  } else {
    bullets.push(
      `Spearheaded the development and optimization of ${feature} utilizing ${tech}, ensuring high architectural resiliency and enterprise-grade reliability.`
    );
  }

  // Bullet 2: Architecture & Scalability Focus
  bullets.push(
    `Architected robust backend workflow in ${tech} by ${breakthrough.toLowerCase().replace(/^(discovered|fixed|added|implemented)\s+/i, '')}, resulting in ${impact || 'enhanced system throughput and zero-regression deployment'}.`
  );

  // Bullet 3: Applied AI / Problem Solving Focus
  bullets.push(
    `Modernized critical ADP enterprise service modules with ${tech}; leveraged automated telemetry, strict schema validation, and targeted algorithmic refactoring to deliver ${impact || 'measurable latency improvements across production workloads'}.`
  );

  return bullets;
};
