#!/usr/bin/env node

/**
 * Data transformation script for System Design problems
 * Converts nested categories/problems structure to flat problemsById dictionary
 */

const fs = require('fs');
const path = require('path');

const PROBLEMS_FILE = path.join(__dirname, '../system-design/data/system-design-problems.json');
const SOLUTIONS_FILE = path.join(__dirname, '../system-design/data/system-design-solutions.json');
const OUTPUT_FILE = path.join(__dirname, '../system-design/data/system-design-problems.json');

// Company tags based on industry knowledge
const COMPANY_TAGS = {
  'design-rate-limiter': ['Google', 'Amazon', 'Meta'],
  'design-url-shortener': ['Google', 'Amazon', 'Twitter'],
  'design-youtube': ['Google', 'Netflix', 'Amazon'],
  'design-whatsapp': ['Meta', 'Telegram', 'Signal'],
  'design-distributed-cache': ['Redis Labs', 'Amazon', 'Google'],
  'design-ticketmaster': ['Ticketmaster', 'StubHub', 'Eventbrite'],
  'design-web-crawler': ['Google', 'Microsoft', 'DuckDuckGo'],
  'design-proximity-service': ['Yelp', 'Google', 'Uber'],
  'design-ride-sharing': ['Uber', 'Lyft', 'Didi'],
  'design-news-feed': ['Meta', 'Twitter', 'LinkedIn'],
  'design-notification-system': ['Twilio', 'SendGrid', 'Amazon'],
  'design-cloud-storage': ['Dropbox', 'Google', 'Microsoft'],
  'design-metrics-monitoring': ['Datadog', 'New Relic', 'Splunk'],
  'design-unique-id-generator': ['Twitter', 'Snowflake', 'Instagram'],
  'design-distributed-sql': ['Google', 'CockroachDB', 'Amazon']
};

// Real-world use cases
const REAL_WORLD_USE = {
  'design-rate-limiter': 'API throttling, DDoS protection, fair resource allocation',
  'design-url-shortener': 'Marketing campaigns, link tracking, QR codes',
  'design-youtube': 'Video platforms, livestreaming, educational content',
  'design-whatsapp': 'Messaging apps, team collaboration, customer support',
  'design-distributed-cache': 'Session storage, CDN, database query optimization',
  'design-ticketmaster': 'Event ticketing, concert sales, flash sales',
  'design-web-crawler': 'Search indexing, price monitoring, data aggregation',
  'design-proximity-service': 'Location search, restaurant discovery, nearby services',
  'design-ride-sharing': 'Transportation, food delivery, package delivery',
  'design-news-feed': 'Social feeds, news aggregation, content recommendations',
  'design-notification-system': 'Alerts, reminders, multi-channel messaging',
  'design-cloud-storage': 'File sync, backup, collaboration',
  'design-metrics-monitoring': 'Infrastructure monitoring, alerting, observability',
  'design-unique-id-generator': 'Distributed ID generation, database sharding',
  'design-distributed-sql': 'Global databases, multi-region apps, ACID transactions'
};

function transformData() {
  console.log('📦 Reading source files...');
  
  const problemsData = JSON.parse(fs.readFileSync(PROBLEMS_FILE, 'utf8'));
  const solutionsData = JSON.parse(fs.readFileSync(SOLUTIONS_FILE, 'utf8'));

  console.log('🔄 Transforming data structure...');

  const transformed = {
    metadata: {
      version: '1.0',
      lastUpdated: new Date().toISOString().split('T')[0],
      totalProblems: 0
    },
    categories: [],
    problemsById: {}
  };

  // Transform categories and collect problems
  let totalProblems = 0;
  problemsData.categories.forEach((category, index) => {
    const problemIds = [];
    
    category.problems.forEach(problem => {
      const slug = problem.slug;
      const solutionData = solutionsData[slug];
      
      // Extract estimated time from string format (e.g., "45 mins" -> 45)
      let estimatedTimeMinutes = 45; // default
      if (problem.estimatedTime) {
        const match = problem.estimatedTime.match(/(\d+)/);
        if (match) estimatedTimeMinutes = parseInt(match[1]);
      }

      // Build the transformed problem
      transformed.problemsById[slug] = {
        id: problem.id,
        title: problem.title,
        slug: problem.slug,
        difficulty: problem.difficulty,
        description: problem.description,
        estimatedTimeMinutes,
        companies: COMPANY_TAGS[slug] || [],
        isPremium: false, // All are free for now
        realWorldUse: REAL_WORLD_USE[slug] || '',
        topics: problem.topics || [],
        has_solution: problem.has_solution !== undefined ? problem.has_solution : true,
        // Keep video data from solutions if available
        videoId: solutionData?.videoId || null
      };

      problemIds.push(slug);
      totalProblems++;
    });

    transformed.categories.push({
      id: category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      name: category.name,
      icon: category.icon,
      description: `${category.name} architecture patterns and concepts`,
      sequence: index + 1,
      problemIds
    });
  });

  transformed.metadata.totalProblems = totalProblems;

  console.log(`✨ Transformed ${totalProblems} problems across ${transformed.categories.length} categories`);
  console.log('💾 Writing output file...');
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(transformed, null, 2));
  
  console.log('✅ Data transformation complete!');
  console.log(`   Output: ${OUTPUT_FILE}`);
  console.log(`   Total problems: ${totalProblems}`);
  console.log(`   Categories: ${transformed.categories.map(c => c.name).join(', ')}`);
}

try {
  transformData();
} catch (error) {
  console.error('❌ Error during transformation:', error.message);
  process.exit(1);
}
